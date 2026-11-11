import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { execFile } from "child_process";
import fs from "fs/promises";
import os from "os";

dotenv.config();

const app = express();

// Parse CLI port or env port. In AI Studio, nginx listens on 8080 and proxies to 3000.
const portArgIndex = process.argv.indexOf("--port");
const cliPort = portArgIndex !== -1 ? Number(process.argv[portArgIndex + 1]) : null;
const envPort = process.env.PORT ? Number(process.env.PORT) : null;
const PORT = cliPort || (envPort && envPort !== 8080 ? envPort : 3000);

app.use((_req, res, next) => {
  res.setHeader("Permissions-Policy", "microphone=*");
  res.setHeader("Feature-Policy", "microphone *");
  next();
});

app.use(express.json({ limit: "25mb" }));

/**
 * Convert audio buffer (webm, ogg, etc.) to 16kHz mono PCM WAV via ffmpeg.
 * Falls back to original buffer if ffmpeg is unavailable.
 */
async function convertBufferToWav(audioBuffer: Buffer, mimeType: string): Promise<{ buffer: Buffer; filename: string }> {
  const ext = mimeType.includes("webm")
    ? "webm"
    : mimeType.includes("ogg")
    ? "ogg"
    : mimeType.includes("mp4")
    ? "m4a"
    : mimeType.includes("wav")
    ? "wav"
    : "raw";

  if (ext === "wav") {
    return { buffer: audioBuffer, filename: "clip.wav" };
  }

  const tmpIn = path.join(os.tmpdir(), `stt_in_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`);
  const tmpOut = path.join(os.tmpdir(), `stt_out_${Date.now()}_${Math.random().toString(36).slice(2)}.wav`);

  try {
    await fs.writeFile(tmpIn, audioBuffer);
    await new Promise<void>((resolve, reject) => {
      execFile(
        "ffmpeg",
        ["-y", "-i", tmpIn, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", tmpOut],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    const wavBuffer = await fs.readFile(tmpOut);
    return { buffer: wavBuffer, filename: "clip.wav" };
  } catch (err) {
    console.warn("ffmpeg audio conversion warning, using direct buffer:", err);
    return { buffer: audioBuffer, filename: `clip.${ext}` };
  } finally {
    await fs.unlink(tmpIn).catch(() => {});
    await fs.unlink(tmpOut).catch(() => {});
  }
}

/**
 * Japanese Speech-to-Text Proxy
 *
 * Primary: JPTranscribe (https://jptranscribe.com/) API:
 *   POST https://api.jptranscribe.com/v1/transcribe
 *   -H "Authorization: Bearer <KEY>"
 *   -F "file=@clip.wav" -F "language=ja" -F "translate=true"
 *
 * Fallbacks:
 *   - Local FunASR / SenseVoice container (FUNASR_CONTAINER_URL)
 *   - FunAudioLLM / DashScope API (DASHSCOPE_API_KEY)
 *   - Gemini ASR (GEMINI_API_KEY)
 */
app.post("/api/transcribe", async (req: Request, res: Response): Promise<void> => {
  try {
    const { audioBase64, mimeType = "audio/webm", language = "ja" } = req.body;

    if (!audioBase64) {
      res.status(400).json({ error: "Missing audioBase64 in request body" });
      return;
    }

    // Clean base64 string correctly (accounting for parameters like ;codecs=opus)
    const base64Index = audioBase64.indexOf(";base64,");
    const cleanBase64 = (base64Index !== -1 ? audioBase64.slice(base64Index + 8) : audioBase64).trim();
    const rawAudioBuffer = Buffer.from(cleanBase64, "base64");

    // Convert audio to 16kHz mono WAV for high accuracy ASR
    const { buffer: wavBuffer, filename: wavFilename } = await convertBufferToWav(rawAudioBuffer, mimeType);

    // 1. PRIMARY: JPTranscribe (https://jptranscribe.com/) API
    const jptApiKey =
      process.env.JPTRANSCRIBE_API_KEY ||
      "jpt_qaZewTR_wLyBNdeN7fndHCm8_la9zXio";

    if (jptApiKey) {
      try {
        const formData = new FormData();
        const fileBlob = new Blob([new Uint8Array(wavBuffer)], { type: "audio/wav" });
        formData.append("file", fileBlob, wavFilename);
        formData.append("language", language);

        const jptRes = await fetch("https://api.jptranscribe.com/v1/transcribe", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jptApiKey}`,
          },
          body: formData,
        });

        if (jptRes.ok) {
          const data = await jptRes.json();
          let recognizedText = (data.text || "").trim();

          // If the task was queued / async, poll for completion
          if (data.status === "processing" && data.poll) {
            const pollUrl = data.poll.startsWith("http")
              ? data.poll
              : `https://api.jptranscribe.com${data.poll}`;

            for (let attempt = 0; attempt < 5; attempt++) {
              await new Promise((r) => setTimeout(r, 1000));
              try {
                const pollRes = await fetch(pollUrl, {
                  headers: { Authorization: `Bearer ${jptApiKey}` },
                });
                if (pollRes.ok) {
                  const pollData = await pollRes.json();
                  if (pollData.status === "done" || (pollData.text !== undefined && pollData.text !== "")) {
                    recognizedText = (pollData.text || "").trim();
                    break;
                  }
                }
              } catch {
                // retry next attempt
              }
            }
          }

          res.json({
            provider: "JPTranscribe",
            text: recognizedText,
          });
          return;
        } else {
          const errText = await jptRes.text();
          console.warn("JPTranscribe API returned non-200:", jptRes.status, errText);
        }
      } catch (jptErr) {
        console.warn("JPTranscribe request error:", jptErr);
      }
    }

    // 2. SECONDARY: Local FunASR / SenseVoice container if configured
    const localContainerUrl = process.env.FUNASR_CONTAINER_URL || "";
    if (localContainerUrl) {
      try {
        const baseUrl = localContainerUrl.replace(/\/+$/, "");
        const targetUrl =
          baseUrl.includes("/v1/audio/transcriptions") ||
          baseUrl.includes("/recognition") ||
          baseUrl.includes("/transcribe")
            ? baseUrl
            : `${baseUrl}/v1/audio/transcriptions`;

        const formData = new FormData();
        const fileBlob = new Blob([new Uint8Array(wavBuffer)], { type: "audio/wav" });
        formData.append("file", fileBlob, "clip.wav");
        formData.append("model", "sensevoice-v1");
        formData.append("language", language);

        const localRes = await fetch(targetUrl, {
          method: "POST",
          body: formData,
        });

        if (localRes.ok) {
          const data = await localRes.json();
          const rawText =
            typeof data === "string"
              ? data
              : data.text ||
                data.transcription ||
                data.result ||
                (Array.isArray(data) && data[0]?.text) ||
                "";
          const text = rawText.replace(/<\|.*?\|>/g, "").trim();
          res.json({
            provider: "Local FunASR Container",
            text,
          });
          return;
        }
      } catch (localErr) {
        console.warn("Failed calling local FunASR container:", localErr);
      }
    }

    // 3. TERTIARY: DashScope / FunAudioLLM API
    const dashscopeApiKey = process.env.DASHSCOPE_API_KEY || "";
    if (dashscopeApiKey) {
      try {
        const formData = new FormData();
        const fileBlob = new Blob([new Uint8Array(wavBuffer)], { type: "audio/wav" });
        formData.append("file", fileBlob, "clip.wav");
        formData.append("model", "sensevoice-v1");
        formData.append("language", language);

        const funAudioRes = await fetch(
          "https://dashscope.aliyuncs.com/compatible-mode/v1/audio/transcriptions",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${dashscopeApiKey}` },
            body: formData,
          }
        );

        if (funAudioRes.ok) {
          const data = await funAudioRes.json();
          const rawText = (data.text || data.transcription || "").trim();
          const text = rawText.replace(/<\|.*?\|>/g, "").trim();
          res.json({
            provider: "FunAudioLLM (SenseVoice)",
            text,
          });
          return;
        }
      } catch (funErr) {
        console.warn("Failed calling DashScope API:", funErr);
      }
    }

    // 2. Fallback if FunAudioLLM API key is not yet set in environment:
    // Check if GEMINI_API_KEY is available for high-accuracy Japanese speech transcription
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI();
        const genaiRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType || "audio/webm",
                    data: cleanBase64,
                  },
                },
                {
                  text: "You are an automated Japanese speech recognizer. Transcribe only the spoken Japanese words from this audio into Japanese text (Hiragana or Kanji). Return strictly the transcription with no quotes, no markdown, and no extra commentary. If no intelligible Japanese words are spoken, output nothing.",
                },
              ],
            },
          ],
        });

        const text = genaiRes.text?.trim() || "";
        res.json({
          provider: "Gemini ASR (FunAudioLLM fallback)",
          text,
        });
        return;
      } catch (genaiErr) {
        console.warn("ASR fallback error:", genaiErr);
      }
    }

    res.status(503).json({
      error: "No ASR backend available. Please set DASHSCOPE_API_KEY in environment.",
      text: "",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal transcription error";
    console.error("Transcription error:", err);
    res.status(500).json({ error: message, text: "" });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
