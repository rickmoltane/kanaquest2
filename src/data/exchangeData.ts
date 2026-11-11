export interface ExchangeItem {
  id: string;
  category: 
    | 'places-work' 
    | 'occupations' 
    | 'introductions' 
    | 'people' 
    | 'courtesy' 
    | 'countries-origin' 
    | 'languages' 
    | 'age-numbers' 
    | 'daily-inquiry' 
    | 'time-days' 
    | 'demonstratives'
    | 'classroom'
    | 'food-drinks'
    | 'dining-preferences'
    | 'daily-routine'
    | 'places-transit'
    | 'time-schedules';
  categoryLabel: string;
  situationTitle: string;
  englishMeaning: string;
  promptSpeaker?: string;
  semanticPattern?: string; // Grouping to prevent asking similar questions in the same session
  subjectEntity?: string;   // father, mother, man, woman, elderly, self, colleague, teacher, etc.
  spriteId?: string;        // Visual sprite reference '01' to '16' from 4x4 sprite sheet

  // Prompt / Question (Full multi-word phrase)
  promptRomaji: string;
  promptHiragana: string;

  // Correct Reply (Full multi-word phrase)
  correctRomaji: string;
  correctHiragana: string;
  correctEnglish: string;

  // Distractors: Plausible decoys strictly using the user's vocabulary (swapped word order, particle error, or altered grammar)
  distractors: [
    { romaji: string; hiragana: string; english: string },
    { romaji: string; hiragana: string; english: string }
  ];

  // Optional: Decoys when the prompt is the answer/reply and options are the question
  questionDistractors?: [
    { romaji: string; hiragana: string; english: string },
    { romaji: string; hiragana: string; english: string }
  ];
}

/**
 * STRICT USER-CURRICULUM EXCHANGE DATA
 * All vocabulary, nouns, pronouns, verbs, and phrases come 100% EXCLUSIVELY
 * from the user-provided vocabulary database.
 * No unintroduced words.
 */
export const EXCHANGE_DATA: ExchangeItem[] = [
  // 1. Where do you work? -> I work at a company.
  {
    id: 'exch-1',
    category: 'places-work',
    categoryLabel: 'Places & Work',
    situationTitle: 'Asking Workplace',
    englishMeaning: 'Where do you work?',
    promptSpeaker: 'Acquaintance',
    promptRomaji: 'Doko de hataraite imasu ka?',
    promptHiragana: 'どこではたらいていますか？',
    correctRomaji: 'Kaisha de hataraite imasu.',
    correctHiragana: 'かいしゃではたらいています。',
    correctEnglish: 'I work at a company.',
    distractors: [
      { romaji: 'Kaisha o hataraite imasu.', hiragana: 'かいしゃをはたらいています。', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Hataraite kaisha de imasu.', hiragana: 'はたらいてかいしゃでいます。', english: 'Incorrect word order' },
    ],
  },

  // 2. Do you work at a school? -> Yes, I work at a school.
  {
    id: 'exch-2',
    category: 'places-work',
    categoryLabel: 'Places & Work',
    situationTitle: 'School Employment',
    englishMeaning: 'Do you work at a school?',
    promptSpeaker: 'Neighbor',
    promptRomaji: 'Gakkō de hataraite imasu ka?',
    promptHiragana: 'がっこうではたらいていますか？',
    correctRomaji: 'Hai, gakkō de hataraite imasu.',
    correctHiragana: 'はい、がっこうではたらいています。',
    correctEnglish: 'Yes, I work at a school.',
    distractors: [
      { romaji: 'Hai, gakkō ni hataraite imasu.', hiragana: 'はい、がっこうにはたらいています。', english: 'Particle error: "ni" instead of "de"' },
      { romaji: 'Hai, hataraite gakkō de imasu.', hiragana: 'はい、はたらいてがっこうでいます。', english: 'Incorrect word order' },
    ],
  },

  // 3. Do you work at a hospital? -> Yes, I work at a hospital.
  {
    id: 'exch-3',
    category: 'places-work',
    categoryLabel: 'Places & Work',
    situationTitle: 'Hospital Employment',
    englishMeaning: 'Do you work at a hospital?',
    promptSpeaker: 'Colleague',
    promptRomaji: 'Byōin de hataraite imasu ka?',
    promptHiragana: 'びょういんではたらいていますか？',
    correctRomaji: 'Hai, byōin de hataraite imasu.',
    correctHiragana: 'はい、びょういんではたらいています。',
    correctEnglish: 'Yes, I work at a hospital.',
    distractors: [
      { romaji: 'Hai, byōin o hataraite imasu.', hiragana: 'はい、びょういんをはたらいています。', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Hai, byōin de hataraki imasu.', hiragana: 'はい、びょういんではたらきます。', english: 'Incorrect verb form' },
    ],
  },

  // 4. Do you live on a pension? -> Yes, I live on a pension.
  {
    id: 'exch-4',
    category: 'places-work',
    categoryLabel: 'Places & Work',
    situationTitle: 'Living on Pension',
    englishMeaning: 'Do you live on a pension?',
    promptSpeaker: 'Friend',
    promptRomaji: 'Nenkin de seikatsu shite imasu ka?',
    promptHiragana: 'ねんきんでせいかつしていますか？',
    correctRomaji: 'Hai, nenkin de seikatsu shite imasu.',
    correctHiragana: 'はい、ねんきんでせいかつしています。',
    correctEnglish: 'Yes, I live on a pension.',
    distractors: [
      { romaji: 'Hai, nenkin o seikatsu shite imasu.', hiragana: 'はい、ねんきんをせいかつしています。', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Hai, seikatsu de nenkin shite imasu.', hiragana: 'はい、せいかつでねんきんしています。', english: 'Inverted noun order' },
    ],
  },

  // 5. Does that elderly person live on a pension? -> Yes, they live on a pension.
  {
    id: 'exch-5',
    category: 'places-work',
    categoryLabel: 'Places & Work',
    situationTitle: 'Elderly Person Pension',
    englishMeaning: 'Does that elderly person live on a pension?',
    promptSpeaker: 'Social Worker',
    promptRomaji: 'Ano otoshiyori wa nenkin de seikatsu shite imasu ka?',
    promptHiragana: 'あのおとしよりはねんきんでせいかつしていますか？',
    correctRomaji: 'Hai, nenkin de seikatsu shite imasu.',
    correctHiragana: 'はい、ねんきんでせいかつしています。',
    correctEnglish: 'Yes, they live on a pension.',
    distractors: [
      { romaji: 'Hai, nenkin wa seikatsu de imasu.', hiragana: 'はい、ねんきんはせいかつでいます。', english: 'Mismatched particle and verb' },
      { romaji: 'Hai, seikatsu shite nenkin de imasu.', hiragana: 'はい、せいかつしてねんきんでいます。', english: 'Inverted clause order' },
    ],
  },

  // 6. What is your name? -> My name is Tanaka.
  {
    id: 'exch-6',
    category: 'introductions',
    categoryLabel: 'Introductions',
    situationTitle: 'Asking Name',
    englishMeaning: 'What is your name?',
    promptSpeaker: 'Receptionist',
    promptRomaji: 'Anata no namae wa nan desu ka?',
    promptHiragana: 'あなたのなまえはなんですか？',
    correctRomaji: 'Watashi no namae wa Tanaka desu.',
    correctHiragana: 'わたしのなまえはたなかです。',
    correctEnglish: 'My name is Tanaka.',
    distractors: [
      { romaji: 'Watashi wa namae no Tanaka desu.', hiragana: 'わたしはなまえのたなかです。', english: 'Misplaced particle "no"' },
      { romaji: 'Namae wa watashi no Tanaka desu.', hiragana: 'なまえはわたしのたなかです。', english: 'Mismatched topic and possessive' },
    ],
  },

  // 7. Nice to meet you. Please do your self-introduction. -> Yes, I will do my self-introduction.
  {
    id: 'exch-7',
    category: 'introductions',
    categoryLabel: 'Self-Introduction',
    situationTitle: 'Self-Introduction Request',
    englishMeaning: 'Please give your self-introduction.',
    promptSpeaker: 'Host',
    promptRomaji: 'Jiko shōkai o onegaishimasu.',
    promptHiragana: 'じこしょうかいをおねがいします。',
    correctRomaji: 'Hai, watashi no jiko shōkai o shimasu.',
    correctHiragana: 'はい、わたしのじこしょうかいをします。',
    correctEnglish: 'Yes, I will do my self-introduction.',
    distractors: [
      { romaji: 'Hai, watashi wa jiko shōkai o kudasai.', hiragana: 'はい、わたしはじこしょうかいをください。', english: 'Incorrect request ending "kudasai"' },
      { romaji: 'Hai, jiko shōkai de watashi o shimasu.', hiragana: 'はい、じこしょうかいでわたしをします。', english: 'Particle inversion' },
    ],
  },

  // 8. Nice to meet you. Pleased to meet you. -> Pleased to meet you too.
  {
    id: 'exch-8',
    category: 'introductions',
    categoryLabel: 'Introductions',
    situationTitle: 'Meeting for the First Time',
    englishMeaning: 'Nice to meet you. Pleased to make your acquaintance.',
    promptSpeaker: 'New Colleague',
    promptRomaji: 'Hajimemashite. Dōzo yoroshiku onegaishimasu.',
    promptHiragana: 'はじめまして。どうぞよろしくおねがいします。',
    correctRomaji: 'Hajimemashite. Dōzo yoroshiku.',
    correctHiragana: 'はじめまして。どうぞよろしく。',
    correctEnglish: 'Nice to meet you. Pleased to meet you too.',
    distractors: [
      { romaji: 'Hajimemashite. Dōzo yoroshikunai desu.', hiragana: 'はじめまして。どうぞよろしくないです。', english: 'Negative error: "yoroshikunai"' },
      { romaji: 'Hajimemashite. Yoroshiku dōzo no desu.', hiragana: 'はじめまして。よろしくどうぞのです。', english: 'Confused word order and particle' },
    ],
  },

  // 9. Please read this noun. -> Yes, I will read this noun.
  {
    id: 'exch-9',
    category: 'introductions',
    categoryLabel: 'Introductions & Greetings',
    situationTitle: 'Reading Instruction',
    englishMeaning: 'Please read this noun.',
    promptSpeaker: 'Teacher',
    promptRomaji: 'Kono meishi o yonde kudasai.',
    promptHiragana: 'このめいしをよんでください。',
    correctRomaji: 'Hai, kono meishi o yomimasu.',
    correctHiragana: 'はい、このめいしをよみます。',
    correctEnglish: 'Yes, I will read this noun.',
    distractors: [
      { romaji: 'Hai, kono meishi o yonde kudasai.', hiragana: 'はい、このめいしをよんでください。', english: 'Echoing request "yonde kudasai" instead of replying' },
      { romaji: 'Hai, meishi no kono o yomimasu.', hiragana: 'はい、めいしのこのをよみます。', english: 'Inverted noun modifier' },
    ],
  },

  // 10. What is your job? -> I work as an engineer.
  {
    id: 'exch-10',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Asking Job Role',
    englishMeaning: 'What is your job?',
    promptSpeaker: 'Interviewer',
    promptRomaji: 'Anata no shigoto wa nan desu ka?',
    promptHiragana: 'あなたのしごとはなんですか？',
    correctRomaji: 'Watashi wa enjinia desu.',
    correctHiragana: 'わたしはえんじにあです。',
    correctEnglish: 'I am an engineer.',
    distractors: [
      { romaji: 'Watashi no enjinia desu.', hiragana: 'わたしのえんじにあです。', english: 'Incorrect particle: "no" instead of "wa"' },
      { romaji: 'Enjinia wa watashi desu ka?', hiragana: 'えんじにあはわたしですか？', english: 'Question inversion' },
    ],
  },

  // 11. Are you a student? -> Yes, I am a student.
  {
    id: 'exch-11',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Student Inquiry',
    englishMeaning: 'Are you a student?',
    promptSpeaker: 'Teacher',
    promptRomaji: 'Anata wa gakusei desu ka?',
    promptHiragana: 'あなたはがくせいですか？',
    correctRomaji: 'Hai, watashi wa gakusei desu.',
    correctHiragana: 'はい、わたしはがくせいです。',
    correctEnglish: 'Yes, I am a student.',
    distractors: [
      { romaji: 'Hai, watashi no gakusei desu.', hiragana: 'はい、わたしのがくせいです。', english: 'Incorrect particle: "no" instead of "wa"' },
      { romaji: 'Hai, gakusei wa watashi desu.', hiragana: 'はい、がくせいはわたしです。', english: 'Reversed topic and predicate' },
    ],
  },

  // 12. Are you a doctor? -> No, I am not a doctor.
  {
    id: 'exch-12',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Doctor Inquiry',
    englishMeaning: 'Are you a doctor?',
    promptSpeaker: 'Patient',
    promptRomaji: 'Anata wa isha desu ka?',
    promptHiragana: 'あなたはいしゃですか？',
    correctRomaji: 'Iie, watashi wa isha ja arimasen.',
    correctHiragana: 'いいえ、わたしはいしゃじゃありません。',
    correctEnglish: 'No, I am not a doctor.',
    distractors: [
      { romaji: 'Iie, watashi wa isha de arimasen.', hiragana: 'いいえ、わたしはいしゃでありません。', english: 'Colloquial negative slip: "de arimasen"' },
      { romaji: 'Iie, isha wa watashi ja arimasen.', hiragana: 'いいえ、いしゃはわたしじゃありません。', english: 'Inverted topic and subject' },
    ],
  },

  // 13. Are you a teacher? -> Yes, I work at a school.
  {
    id: 'exch-13',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Teacher Inquiry',
    englishMeaning: 'Are you a teacher?',
    promptSpeaker: 'Student',
    promptRomaji: 'Anata wa kyōshi desu ka?',
    promptHiragana: 'あなたはきょうしですか？',
    correctRomaji: 'Hai, gakkō de hataraite imasu.',
    correctHiragana: 'はい、がっこうではたらいています。',
    correctEnglish: 'Yes, I work at a school.',
    distractors: [
      { romaji: 'Hai, gakkō o hataraite imasu.', hiragana: 'はい、がっこうをはたらいています。', english: 'Incorrect particle: "o" instead of "de"' },
      { romaji: 'Hai, hataraite gakkō de imasu.', hiragana: 'はい、はたらいてがっこうでいます。', english: 'Incorrect word order' },
    ],
  },

  // 14. Is she a nurse? -> Yes, she works at a hospital.
  {
    id: 'exch-14',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Nurse Inquiry',
    englishMeaning: 'Is she a nurse?',
    promptSpeaker: 'Visitor',
    promptRomaji: 'Kanojo wa kangoshi desu ka?',
    promptHiragana: 'かのじょはかんごしですか？',
    correctRomaji: 'Hai, byōin de hataraite imasu.',
    correctHiragana: 'はい、びょういんではたらいています。',
    correctEnglish: 'Yes, she works at a hospital.',
    distractors: [
      { romaji: 'Hai, byōin o hataraite imasu.', hiragana: 'はい、びょういんをはたらいています。', english: 'Incorrect particle: "o" instead of "de"' },
      { romaji: 'Hai, hataraite byōin de imasu.', hiragana: 'はい、はたらいてびょういんでいます。', english: 'Incorrect word order' },
    ],
  },

  // 15. Is he a company employee? -> Yes, he works at a company.
  {
    id: 'exch-15',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Company Employee Inquiry',
    englishMeaning: 'Is he a company employee?',
    promptSpeaker: 'Colleague',
    promptRomaji: 'Kare wa kaishain desu ka?',
    promptHiragana: 'かれはかいしゃいんですか？',
    correctRomaji: 'Hai, kaisha de hataraite imasu.',
    correctHiragana: 'はい、かいしゃではたらいています。',
    correctEnglish: 'Yes, he works at a company.',
    distractors: [
      { romaji: 'Hai, kaisha o hataraite imasu.', hiragana: 'はい、かいしゃをはたらいています。', english: 'Incorrect particle: "o" instead of "de"' },
      { romaji: 'Hai, hataraite kaisha de imasu.', hiragana: 'はい、はたらいてかいしゃでいます。', english: 'Mismatched word order' },
    ],
  },

  // 16. Are you a care worker? -> Yes, I work at a hospital.
  {
    id: 'exch-16',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Care Worker Inquiry',
    englishMeaning: 'Are you a care worker?',
    promptSpeaker: 'Visitor',
    promptRomaji: 'Anata wa kaigoshi desu ka?',
    promptHiragana: 'あなたはかいごしですか？',
    correctRomaji: 'Hai, byōin de hataraite imasu.',
    correctHiragana: 'はい、びょういんではたらいています。',
    correctEnglish: 'Yes, I work at a hospital.',
    distractors: [
      { romaji: 'Hai, byōin o hataraite imasu.', hiragana: 'はい、びょういんをはたらいています。', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Hai, kaigoshi de byōin desu.', hiragana: 'はい、かいごしでびょういんです。', english: 'Garbled clause order' },
    ],
  },

  // 17. Are you a civil servant? -> Yes, I am a civil servant.
  {
    id: 'exch-17',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Civil Servant Inquiry',
    englishMeaning: 'Are you a civil servant?',
    promptSpeaker: 'Friend',
    promptRomaji: 'Anata wa kōmuin desu ka?',
    promptHiragana: 'あなたはこうむいんですか？',
    correctRomaji: 'Hai, watashi wa kōmuin desu.',
    correctHiragana: 'はい、わたしはこうむいんです。',
    correctEnglish: 'Yes, I am a civil servant.',
    distractors: [
      { romaji: 'Hai, watashi no kōmuin desu.', hiragana: 'はい、わたしのこうむいんです。', english: 'Incorrect particle: "no" instead of "wa"' },
      { romaji: 'Hai, kōmuin wa watashi desu.', hiragana: 'はい、こうむいんはわたしです。', english: 'Reversed topic' },
    ],
  },

  // 18. Are you self-employed? -> Yes, I am a business owner.
  {
    id: 'exch-18',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Self-Employed Inquiry',
    englishMeaning: 'Are you self-employed?',
    promptSpeaker: 'Acquaintance',
    promptRomaji: 'Anata wa jieigyō desu ka?',
    promptHiragana: 'あなたはじえいぎょうですか？',
    correctRomaji: 'Hai, watashi wa jigyōnushi desu.',
    correctHiragana: 'はい、わたしはじぎょうぬしです。',
    correctEnglish: 'Yes, I am a business owner.',
    distractors: [
      { romaji: 'Hai, watashi no jigyōnushi desu.', hiragana: 'はい、わたしのじぎょうぬしです。', english: 'Incorrect particle: "no" instead of "wa"' },
      { romaji: 'Hai, jigyōnushi wa watashi desu.', hiragana: 'はい、じぎょうぬしはわたしです。', english: 'Reversed predicate order' },
    ],
  },

  // 19. Are you a homemaker? -> Yes, I am a homemaker.
  {
    id: 'exch-19',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Homemaker Status',
    englishMeaning: 'Are you a homemaker?',
    promptSpeaker: 'Neighbor',
    promptRomaji: 'Anata wa shufu desu ka?',
    promptHiragana: 'あなたはしゅふですか？',
    correctRomaji: 'Hai, watashi wa shufu desu.',
    correctHiragana: 'はい、わたしはしゅふです。',
    correctEnglish: 'Yes, I am a homemaker.',
    distractors: [
      { romaji: 'Hai, watashi no shufu desu.', hiragana: 'はい、わたしのしゅふです。', english: 'Incorrect particle: "no" instead of "wa"' },
      { romaji: 'Hai, shufu wa watashi desu.', hiragana: 'はい、しゅふはわたしです。', english: 'Reversed topic and predicate' },
    ],
  },

  // 20. Are you a farmer? -> Yes, I am a farmer.
  {
    id: 'exch-20',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Farmer Inquiry',
    englishMeaning: 'Are you a farmer?',
    promptSpeaker: 'Visitor',
    promptRomaji: 'Anata wa nōka desu ka?',
    promptHiragana: 'あなたはのうかですか？',
    correctRomaji: 'Hai, watashi wa nōka desu.',
    correctHiragana: 'はい、わたしはのうかです。',
    correctEnglish: 'Yes, I am a farmer.',
    distractors: [
      { romaji: 'Hai, watashi no nōka desu.', hiragana: 'はい、わたしののうかです。', english: 'Incorrect particle: "no" instead of "wa"' },
      { romaji: 'Hai, nōka wa watashi desu.', hiragana: 'はい、のうかはわたしです。', english: 'Reversed word order' },
    ],
  },

  // 21. Do you work a part-time job? -> Yes, I work part-time at a school.
  {
    id: 'exch-21',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Part-Time Work Inquiry',
    englishMeaning: 'Do you work part-time?',
    promptSpeaker: 'Friend',
    promptRomaji: 'Anata wa arubaito desu ka?',
    promptHiragana: 'あなたはあるばいとですか？',
    correctRomaji: 'Hai, gakkō de hataraite imasu.',
    correctHiragana: 'はい、がっこうではたらいています。',
    correctEnglish: 'Yes, I work at a school.',
    distractors: [
      { romaji: 'Hai, gakkō o hataraite imasu.', hiragana: 'はい、がっこうをはたらいています。', english: 'Incorrect particle: "o" instead of "de"' },
      { romaji: 'Hai, hataraite gakkō de imasu.', hiragana: 'はい、はたらいてがっこうでいます。', english: 'Incorrect word order' },
    ],
  },

  // 22. Does she work part-time? -> Yes, she works part-time.
  {
    id: 'exch-22',
    category: 'occupations',
    categoryLabel: 'Occupations',
    situationTitle: 'Part-Time Status',
    englishMeaning: 'Does she work part-time?',
    promptSpeaker: 'Colleague',
    promptRomaji: 'Kanojo wa pāto taimu desu ka?',
    promptHiragana: 'かのじょはぱーとたいむですか？',
    correctRomaji: 'Hai, kanojo wa pāto taimu desu.',
    correctHiragana: 'はい、かのじょはぱーとたいむです。',
    correctEnglish: 'Yes, she is part-time.',
    distractors: [
      { romaji: 'Hai, kanojo no pāto taimu desu.', hiragana: 'はい、かのじょのぱーとたいむです。', english: 'Incorrect particle: "no" instead of "wa"' },
      { romaji: 'Hai, pāto taimu wa kanojo desu.', hiragana: 'はい、ぱーとたいむはかのじょです。', english: 'Reversed topic and predicate' },
    ],
  },

  // 23. Is that person your friend? -> Yes, they are my friend.
  {
    id: 'exch-23',
    category: 'people',
    categoryLabel: 'People & Pronouns',
    situationTitle: 'Friend Inquiry',
    englishMeaning: 'Is that person your friend?',
    promptSpeaker: 'Classmate',
    promptRomaji: 'Ano hito wa anata no tomodachi desu ka?',
    promptHiragana: 'あのひとはあなたのともだちですか？',
    correctRomaji: 'Hai, watashi no tomodachi desu.',
    correctHiragana: 'はい、わたしのともだちです。',
    correctEnglish: 'Yes, that is my friend.',
    distractors: [
      { romaji: 'Hai, tomodachi no watashi desu.', hiragana: 'はい、ともだちのわたしです。', english: 'Inverted possessive order' },
      { romaji: 'Hai, watashi wa tomodachi ga desu.', hiragana: 'はい、わたしはともだちがです。', english: 'Erroneous particle "ga" insertion' },
    ],
  },

  // 24. Is that child your child? -> Yes, that is my child.
  {
    id: 'exch-24',
    category: 'people',
    categoryLabel: 'Age & Gender',
    situationTitle: 'Child Inquiry',
    englishMeaning: 'Is that child your child?',
    promptSpeaker: 'Teacher',
    promptRomaji: 'Ano kodomo wa anata no kodomo desu ka?',
    promptHiragana: 'あのこどもはあなたのこどもですか？',
    correctRomaji: 'Hai, watashi no kodomo desu.',
    correctHiragana: 'はい、わたしのこどもです。',
    correctEnglish: 'Yes, that is my child.',
    distractors: [
      { romaji: 'Hai, kodomo no watashi desu.', hiragana: 'はい、こどものわたしです。', english: 'Inverted modifier order' },
      { romaji: 'Hai, watashi wa kodomo de desu.', hiragana: 'はい、わたしはこどもでです。', english: 'Extraneous particle "de"' },
    ],
  },

  // 25. Is that person a man or a woman? -> That person is a woman.
  {
    id: 'exch-25',
    category: 'people',
    categoryLabel: 'Age & Gender',
    situationTitle: 'Man or Woman Inquiry',
    englishMeaning: 'Is that person a man or a woman?',
    promptSpeaker: 'Colleague',
    promptRomaji: 'Ano hito wa otoko no hito desu ka, onna no hito desu ka?',
    promptHiragana: 'あのひとはおとこのひとですか、おんなのひとですか？',
    correctRomaji: 'Ano hito wa onna no hito desu.',
    correctHiragana: 'あのひとはおんなのひとです。',
    correctEnglish: 'That person is a woman.',
    distractors: [
      { romaji: 'Ano hito no onna no hito desu.', hiragana: 'あのひとのおんなのひとです。', english: 'Incorrect particle: "no" instead of "wa"' },
      { romaji: 'Onna no hito wa ano hito desu ka.', hiragana: 'おんなのひとはあのひとですか。', english: 'Echoing question format' },
    ],
  },

  // 26. Are they young people? -> Yes, they are young people.
  {
    id: 'exch-26',
    category: 'people',
    categoryLabel: 'Age & Gender',
    situationTitle: 'Young People Inquiry',
    englishMeaning: 'Are they young people?',
    promptSpeaker: 'Observer',
    promptRomaji: 'Ano hito wa wakamono desu ka?',
    promptHiragana: 'あのひとはわかものですかつ？',
    correctRomaji: 'Hai, wakamono desu.',
    correctHiragana: 'はい、わかものです。',
    correctEnglish: 'Yes, they are young people.',
    distractors: [
      { romaji: 'Hai, wakamono no desu.', hiragana: 'はい、わかものです。', english: 'Extraneous possessive "no"' },
      { romaji: 'Hai, wakamono de arimasu.', hiragana: 'はい、わかものであります。', english: 'Inanimate copula error' },
    ],
  },

  // 27. Are you adults? -> Yes, we are adults.
  {
    id: 'exch-27',
    category: 'people',
    categoryLabel: 'Age & Gender',
    situationTitle: 'Adult Status Inquiry',
    englishMeaning: 'Are you adults?',
    promptSpeaker: 'Guide',
    promptRomaji: 'Anata-tachi wa otona desu ka?',
    promptHiragana: 'あなたたちはおとなですか？',
    correctRomaji: 'Hai, watashitachi wa otona desu.',
    correctHiragana: 'はい、わたしたちはおとなです。',
    correctEnglish: 'Yes, we are adults.',
    distractors: [
      { romaji: 'Hai, watashitachi no otona desu.', hiragana: 'はい、わたしたちのおとなです。', english: 'Incorrect particle: "no" instead of "wa"' },
      { romaji: 'Hai, otona wa watashitachi desu.', hiragana: 'はい、おとなはわたしたちです。', english: 'Reversed topic and predicate' },
    ],
  },

  // 28. Excuse me for leaving before you. -> Goodbye, see you later.
  {
    id: 'exch-28',
    category: 'courtesy',
    categoryLabel: 'Workplace Courtesy',
    situationTitle: 'Leaving the Workplace',
    englishMeaning: 'Excuse me for leaving ahead of you.',
    promptSpeaker: 'Colleague',
    promptRomaji: 'Osaki ni shitsurei shimasu.',
    promptHiragana: 'おさきにしつれいします。',
    correctRomaji: 'Sayōnara, jā mata.',
    correctHiragana: 'さようなら、じゃあまた。',
    correctEnglish: 'Goodbye, see you later.',
    distractors: [
      { romaji: 'Jā mata, osaki ni shimasu.', hiragana: 'じゃあまた、おさきにします。', english: 'Incomplete reversed phrase' },
      { romaji: 'Sayōnara shitsurei desu.', hiragana: 'さようならしつれいdesu。', english: 'Improper combined greeting' },
    ],
  },

  // 29. Good morning. Let us exchange greetings. -> Good morning. Nice to meet you.
  {
    id: 'exch-29',
    category: 'courtesy',
    categoryLabel: 'Introductions & Greetings',
    situationTitle: 'Morning Greetings',
    englishMeaning: 'Good morning. Greeting.',
    promptSpeaker: 'Coworker',
    promptRomaji: 'Ohayō gozaimasu. Aisatsu o shimasu.',
    promptHiragana: 'おはようございます。あいさつをします。',
    correctRomaji: 'Ohayō gozaimasu. Dōzo yoroshiku.',
    correctHiragana: 'おはようございます。どうぞよろしく。',
    correctEnglish: 'Good morning. Pleased to meet you.',
    distractors: [
      { romaji: 'Ohayō gozaimasu. Aisatsu o kudasai.', hiragana: 'おはようございます。あいさつをください。', english: 'Incorrect verb request: "kudasai"' },
      { romaji: 'Dōzo yoroshiku ohayō no gozaimasu.', hiragana: 'どうぞよろしくおはようのございます。', english: 'Garbled phrasing order' },
    ],
  },

  // 30. Thank you very much. -> You are welcome / No problem.
  {
    id: 'exch-30',
    category: 'courtesy',
    categoryLabel: 'Courtesy',
    situationTitle: 'Expressing Gratitude',
    englishMeaning: 'Thank you very much.',
    promptSpeaker: 'Partner',
    promptRomaji: 'Arigatō gozaimasu.',
    promptHiragana: 'ありがとうございます。',
    correctRomaji: 'Iie, dōzo.',
    correctHiragana: 'いいえ、どうぞ。',
    correctEnglish: 'Not at all, you are welcome.',
    distractors: [
      { romaji: 'Hai, arigatō gozaimasu.', hiragana: 'はい、ありがとうございます。', english: 'Echoing thank you back' },
      { romaji: 'Iie, arigatō ja arimasen.', hiragana: 'いいえ、ありがとうじゃありません。', english: 'Nonsensical negative ending' },
    ],
  },

  // ========================================================
  // MAJOR COUNTRIES & ORIGIN (Conversational Phrases)
  // ========================================================

  // 31. Where are you from? -> I came from France.
  {
    id: 'exch-31',
    category: 'countries-origin',
    categoryLabel: 'Country & Origin',
    situationTitle: 'Origin: France',
    englishMeaning: 'Where are you from?',
    promptSpeaker: 'Host',
    promptRomaji: 'Dochira kara kimashita ka?',
    promptHiragana: 'どちらからきましたか？',
    correctRomaji: 'Furansu kara kimashita.',
    correctHiragana: 'ふらんすからきました。',
    correctEnglish: 'I am from France.',
    distractors: [
      { romaji: 'Furansu ni kimashita.', hiragana: 'ふらんすにきました。', english: 'Particle error: "ni" instead of "kara"' },
      { romaji: 'Kimashita Furansu kara.', hiragana: 'きましたふらんすから。', english: 'Incorrect word order' },
    ],
  },

  // 32. Where are you from? -> I came from America.
  {
    id: 'exch-32',
    category: 'countries-origin',
    categoryLabel: 'Country & Origin',
    situationTitle: 'Origin: America',
    englishMeaning: 'Where are you from?',
    promptSpeaker: 'Interviewer',
    promptRomaji: 'Dochira kara kimashita ka?',
    promptHiragana: 'どちらからきましたか？',
    correctRomaji: 'Amerika kara kimashita.',
    correctHiragana: 'あめりかからきました。',
    correctEnglish: 'I am from America.',
    distractors: [
      { romaji: 'Amerika o kimashita.', hiragana: 'あめりかをきました。', english: 'Particle error: "o" instead of "kara"' },
      { romaji: 'Kara kimashita Amerika.', hiragana: 'からきましたあめりか。', english: 'Incorrect word order' },
    ],
  },

  // 33. Did you come from Japan? -> Yes, I came from Japan.
  {
    id: 'exch-33',
    category: 'countries-origin',
    categoryLabel: 'Country & Origin',
    situationTitle: 'Origin: Japan',
    englishMeaning: 'Did you come from Japan?',
    promptSpeaker: 'Friend',
    promptRomaji: 'Anata wa Nihon kara kimashita ka?',
    promptHiragana: 'あなたはにほんからきましたか？',
    correctRomaji: 'Hai, Nihon kara kimashita.',
    correctHiragana: 'はい、にほんからきました。',
    correctEnglish: 'Yes, I came from Japan.',
    distractors: [
      { romaji: 'Hai, Nihon de kimashita.', hiragana: 'はい、にほんできました。', english: 'Particle error: "de" instead of "kara"' },
      { romaji: 'Hai, kimashita Nihon kara.', hiragana: 'はい、きましたにほんから。', english: 'Incorrect word order' },
    ],
  },

  // 34. Where are you from? -> I came from the UK.
  {
    id: 'exch-34',
    category: 'countries-origin',
    categoryLabel: 'Country & Origin',
    situationTitle: 'Origin: United Kingdom',
    englishMeaning: 'Where are you from?',
    promptSpeaker: 'Colleague',
    promptRomaji: 'Dochira kara kimashita ka?',
    promptHiragana: 'どちらからきましたか？',
    correctRomaji: 'Igirisu kara kimashita.',
    correctHiragana: 'いぎりすからきました。',
    correctEnglish: 'I am from the UK.',
    distractors: [
      { romaji: 'Igirisu wa kimashita.', hiragana: 'いぎりすはきました。', english: 'Particle error: "wa" instead of "kara"' },
      { romaji: 'Kara Igirisu kimashita.', hiragana: 'からいぎりすきました。', english: 'Incorrect word order' },
    ],
  },

  // 35. Did that person come from China? -> Yes, they came from China.
  {
    id: 'exch-35',
    category: 'countries-origin',
    categoryLabel: 'Country & Origin',
    situationTitle: 'Origin: China',
    englishMeaning: 'Did that person come from China?',
    promptSpeaker: 'Observer',
    promptRomaji: 'Ano hito wa Chūgoku kara kimashita ka?',
    promptHiragana: 'あのひとはちゅうごくからきましたか？',
    correctRomaji: 'Hai, Chūgoku kara kimashita.',
    correctHiragana: 'はい、ちゅうごくからきました。',
    correctEnglish: 'Yes, they came from China.',
    distractors: [
      { romaji: 'Hai, Chūgoku ni kimashita.', hiragana: 'はい、ちゅうごくにきました。', english: 'Particle error: "ni" instead of "kara"' },
      { romaji: 'Hai, kimashita Chūgoku kara.', hiragana: 'はい、きましたちゅうごくから。', english: 'Incorrect word order' },
    ],
  },

  // 36. Did she come from Korea? -> Yes, she came from Korea.
  {
    id: 'exch-36',
    category: 'countries-origin',
    categoryLabel: 'Country & Origin',
    situationTitle: 'Origin: Korea',
    englishMeaning: 'Did she come from Korea?',
    promptSpeaker: 'Classmate',
    promptRomaji: 'Kanojo wa Kankoku kara kimashita ka?',
    promptHiragana: 'かのじょはかんこくからきましたか？',
    correctRomaji: 'Hai, Kankoku kara kimashita.',
    correctHiragana: 'はい、かんこくからきました。',
    correctEnglish: 'Yes, she came from Korea.',
    distractors: [
      { romaji: 'Hai, Kankoku o kimashita.', hiragana: 'はい、かんこくをきました。', english: 'Particle error: "o" instead of "kara"' },
      { romaji: 'Hai, kara kimashita Kankoku.', hiragana: 'はい、からきましたかんこく。', english: 'Incorrect word order' },
    ],
  },

  // ========================================================
  // MAJOR LANGUAGES SPOKEN (Conversational Phrases)
  // ========================================================

  // 37. What language do you speak? -> I speak Japanese.
  {
    id: 'exch-37',
    category: 'languages',
    categoryLabel: 'Languages Spoken',
    situationTitle: 'Language: Japanese',
    englishMeaning: 'What language do you speak?',
    promptSpeaker: 'Interviewer',
    promptRomaji: 'Nani-go o hanashimasu ka?',
    promptHiragana: 'なにごをはなしますか？',
    correctRomaji: 'Nihongo o hanashimasu.',
    correctHiragana: 'にほんごをはなします。',
    correctEnglish: 'I speak Japanese.',
    distractors: [
      { romaji: 'Nihongo de hanashimasu ka.', hiragana: 'にほんごではなしますか。', english: 'Question marker on answer' },
      { romaji: 'Hanashimasu Nihongo o.', hiragana: 'はなしますにほんごを。', english: 'Incorrect word order' },
    ],
  },

  // 38. What language do you speak? -> I speak English.
  {
    id: 'exch-38',
    category: 'languages',
    categoryLabel: 'Languages Spoken',
    situationTitle: 'Language: English',
    englishMeaning: 'What language do you speak?',
    promptSpeaker: 'Tourist',
    promptRomaji: 'Nani-go o hanashimasu ka?',
    promptHiragana: 'なにごをはなしますか？',
    correctRomaji: 'Eigo o hanashimasu.',
    correctHiragana: 'えいごをはなします。',
    correctEnglish: 'I speak English.',
    distractors: [
      { romaji: 'Eigo ni hanashimasu.', hiragana: 'えいごにはなします。', english: 'Particle error: "ni" instead of "o"' },
      { romaji: 'O hanashimasu Eigo.', hiragana: 'をはなしますえいご。', english: 'Incorrect word order' },
    ],
  },

  // 39. Do you speak French? -> Yes, I speak French.
  {
    id: 'exch-39',
    category: 'languages',
    categoryLabel: 'Languages Spoken',
    situationTitle: 'Language: French',
    englishMeaning: 'Do you speak French?',
    promptSpeaker: 'Coworker',
    promptRomaji: 'Anata wa Furansugo o hanashimasu ka?',
    promptHiragana: 'あなたはふらんすごをはなしますか？',
    correctRomaji: 'Hai, Furansugo o hanashimasu.',
    correctHiragana: 'はい、ふらんすごをはなします。',
    correctEnglish: 'Yes, I speak French.',
    distractors: [
      { romaji: 'Hai, Furansugo wa hanashimasu ka.', hiragana: 'はい、ふらんすごははなしますか。', english: 'Question marker on response' },
      { romaji: 'Hai, hanashimasu Furansugo o.', hiragana: 'はい、はなしますふらんすごを。', english: 'Incorrect word order' },
    ],
  },

  // 40. Does he speak Japanese? -> Yes, he speaks Japanese.
  {
    id: 'exch-40',
    category: 'languages',
    categoryLabel: 'Languages Spoken',
    situationTitle: 'Third Person Language',
    englishMeaning: 'Does he speak Japanese?',
    promptSpeaker: 'Manager',
    promptRomaji: 'Kare wa Nihongo o hanashimasu ka?',
    promptHiragana: 'かれはにほんごをはなしますか？',
    correctRomaji: 'Hai, Nihongo o hanashimasu.',
    correctHiragana: 'はい、にほんごをはなします。',
    correctEnglish: 'Yes, he speaks Japanese.',
    distractors: [
      { romaji: 'Hai, Nihongo de hanashimasu.', hiragana: 'はい、にほんごではなします。', english: 'Particle error: "de" instead of "o"' },
      { romaji: 'Hai, o hanashimasu Nihongo.', hiragana: 'はい、をはなしますにほんご。', english: 'Incorrect word order' },
    ],
  },

  // ========================================================
  // AGE & NUMBERS (Conversational Phrases)
  // ========================================================

  // 41. How old are you? -> I am 20 years old.
  {
    id: 'exch-41',
    category: 'age-numbers',
    categoryLabel: 'Age & Numbers',
    situationTitle: 'Age Inquiry: 20',
    englishMeaning: 'How old are you?',
    promptSpeaker: 'Doctor',
    promptRomaji: 'Anata wa nan-sai desu ka?',
    promptHiragana: 'あなたはなんさいですか？',
    correctRomaji: 'Hatachi desu.',
    correctHiragana: 'はたちです。',
    correctEnglish: 'I am 20 years old.',
    distractors: [
      { romaji: 'Hatachi no desu.', hiragana: 'はたちのです。', english: 'Extraneous possessive particle' },
      { romaji: 'Desu hatachi wa.', hiragana: 'です、はたちは。', english: 'Inverted word order' },
    ],
  },

  // 42. How old is he? -> He is 19 years old.
  {
    id: 'exch-42',
    category: 'age-numbers',
    categoryLabel: 'Age & Numbers',
    situationTitle: 'Age Inquiry: 19',
    englishMeaning: 'How old is he?',
    promptSpeaker: 'Teacher',
    promptRomaji: 'Kare wa nan-sai desu ka?',
    promptHiragana: 'かれはなんさいですか？',
    correctRomaji: 'Jūkyūsai desu.',
    correctHiragana: 'じゅうきゅうさいです。',
    correctEnglish: 'He is 19 years old.',
    distractors: [
      { romaji: 'Jūkyūsai wa desu.', hiragana: 'じゅうきゅうさいはです。', english: 'Misplaced topic particle' },
      { romaji: 'Desu jūkyūsai.', hiragana: 'ですじゅうきゅうさい。', english: 'Inverted word order' },
    ],
  },

  // 43. How old is she? -> She is 22 years old.
  {
    id: 'exch-43',
    category: 'age-numbers',
    categoryLabel: 'Age & Numbers',
    situationTitle: 'Age Inquiry: 22',
    englishMeaning: 'How old is she?',
    promptSpeaker: 'Registrar',
    promptRomaji: 'Kanojo wa nan-sai desu ka?',
    promptHiragana: 'かのじょはなんさいですか？',
    correctRomaji: 'Nijūnisai desu.',
    correctHiragana: 'にじゅうにさいです。',
    correctEnglish: 'She is 22 years old.',
    distractors: [
      { romaji: 'Nijūnisai o desu.', hiragana: 'にじゅうにさいをです。', english: 'Extraneous object particle' },
      { romaji: 'Desu nijūnisai wa.', hiragana: 'ですにじゅうにさいは。', english: 'Inverted word order' },
    ],
  },

  // 44. How old is your friend? -> They are 25 years old.
  {
    id: 'exch-44',
    category: 'age-numbers',
    categoryLabel: 'Age & Numbers',
    situationTitle: 'Age Inquiry: 25',
    englishMeaning: 'How old is your friend?',
    promptSpeaker: 'Acquaintance',
    promptRomaji: 'Tomodachi wa nan-sai desu ka?',
    promptHiragana: 'ともだちはなんさいですか？',
    correctRomaji: 'Nijūgosai desu.',
    correctHiragana: 'にじゅうごさいです。',
    correctEnglish: 'They are 25 years old.',
    distractors: [
      { romaji: 'Nijūgosai de arimasu ka.', hiragana: 'にじゅうごさいでありますか。', english: 'Question marker on answer' },
      { romaji: 'Desu nijūgosai.', hiragana: 'ですにじゅうごさい。', english: 'Inverted word order' },
    ],
  },

  // 45. How old is the teacher? -> They are 30 years old.
  {
    id: 'exch-45',
    category: 'age-numbers',
    categoryLabel: 'Age & Numbers',
    situationTitle: 'Age Inquiry: 30',
    englishMeaning: 'How old is the teacher?',
    promptSpeaker: 'Student',
    promptRomaji: 'Sensei wa nan-sai desu ka?',
    promptHiragana: 'せんせいはなんさいですか？',
    correctRomaji: 'Sanjissai desu.',
    correctHiragana: 'さんじゅっさいです。',
    correctEnglish: 'They are 30 years old.',
    distractors: [
      { romaji: 'Sanjissai no desu.', hiragana: 'さんじゅっさいのです。', english: 'Extraneous possessive particle' },
      { romaji: 'Desu sanjissai wa.', hiragana: 'ですさんじゅっさいは。', english: 'Inverted word order' },
    ],
  },

  // 46. How old is that company employee? -> They are 40 years old.
  {
    id: 'exch-46',
    category: 'age-numbers',
    categoryLabel: 'Age & Numbers',
    situationTitle: 'Age Inquiry: 40',
    englishMeaning: 'How old is that company employee?',
    promptSpeaker: 'Client',
    promptRomaji: 'Ano kaishain wa nan-sai desu ka?',
    promptHiragana: 'あのかいしゃいんはなんさいですか？',
    correctRomaji: 'Yonjissai desu.',
    correctHiragana: 'よんじゅっさいです。',
    correctEnglish: 'They are 40 years old.',
    distractors: [
      { romaji: 'Yonjissai wa desu.', hiragana: 'よんじゅっさいはです。', english: 'Misplaced topic particle' },
      { romaji: 'Desu yonjissai.', hiragana: 'ですよんじゅっさい。', english: 'Inverted word order' },
    ],
  },

  // 47. How old is that elderly person? -> They are 65 years old.
  {
    id: 'exch-47',
    category: 'age-numbers',
    categoryLabel: 'Age & Numbers',
    situationTitle: 'Age Inquiry: 65',
    englishMeaning: 'How old is that elderly person?',
    promptSpeaker: 'Nurse',
    promptRomaji: 'Ano otoshiyori wa nan-sai desu ka?',
    promptHiragana: 'あのおとしよりはなんさいですか？',
    correctRomaji: 'Rokujūgosai desu.',
    correctHiragana: 'ろくじゅうごさいです。',
    correctEnglish: 'They are 65 years old.',
    distractors: [
      { romaji: 'Rokujūgosai o desu.', hiragana: 'ろくじゅうごさいをです。', english: 'Extraneous object particle' },
      { romaji: 'Desu rokujūgosai wa.', hiragana: 'ですろくじゅうごさいは。', english: 'Inverted word order' },
    ],
  },

  // 48. Eric, where are you from? -> I'm from France.
  {
    id: 'exch-48',
    category: 'countries-origin',
    categoryLabel: 'Country & Origin',
    situationTitle: 'Origin Inquiry: Eric (France)',
    englishMeaning: 'Eric, where are you from?',
    promptSpeaker: 'Colleague',
    promptRomaji: 'Erikku-san, dochira kara desu ka?',
    promptHiragana: 'エリックさん、どちらからですか？',
    correctRomaji: 'Furansu kara kimashita.',
    correctHiragana: 'フランスから来ました。',
    correctEnglish: "I'm from France.",
    distractors: [
      { romaji: 'Furansu ni kimashita.', hiragana: 'フランスにきました。', english: 'Particle error: "ni" instead of "kara"' },
      { romaji: 'Kimashita Furansu kara.', hiragana: 'きましたフランスから。', english: 'Incorrect word order' },
    ],
    questionDistractors: [
      { romaji: 'Erikku-san, dochira ni desu ka?', hiragana: 'エリックさん、どちらにですか？', english: 'Particle error: "ni" instead of "kara"' },
      { romaji: 'Kara desu ka Erikku-san, dochira?', hiragana: 'からですかエリックさん、どちら？', english: 'Inverted word order' },
    ],
  },

  // 49. Eric, how old are you? -> I am 35 years old.
  {
    id: 'exch-49',
    category: 'age-numbers',
    categoryLabel: 'Age & Numbers',
    situationTitle: 'Age Inquiry: Eric (35)',
    englishMeaning: 'Eric, how old are you?',
    promptSpeaker: 'Friend',
    promptRomaji: 'Erikku-san, nan-sai desu ka?',
    promptHiragana: 'エリックさん、なんさいですか？',
    correctRomaji: 'Watashi wa sanjūgo-sai desu.',
    correctHiragana: 'わたしはさんじゅうごさいです。',
    correctEnglish: 'I am 35 years old.',
    distractors: [
      { romaji: 'Watashi wa sanjūgo-sai no desu.', hiragana: 'わたしはさんじゅうごさいのです。', english: 'Extraneous possessive particle' },
      { romaji: 'Desu watashi wa sanjūgo-sai.', hiragana: 'ですわたしはさんじゅうごさい。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Erikku-san, nan-sai no desu ka?', hiragana: 'エリックさん、なんさいのですか？', english: 'Extraneous possessive particle' },
      { romaji: 'Desu ka Erikku-san, nan-sai?', hiragana: 'ですかエリックさん、なんさい？', english: 'Inverted word order' },
    ],
  },

  // 50. How have things been lately? -> I'm doing well.
  {
    id: 'exch-50',
    category: 'daily-inquiry',
    categoryLabel: 'Daily Inquiry & Feelings',
    situationTitle: 'Catching Up: Lately',
    englishMeaning: 'How have things been lately?',
    promptSpeaker: 'Colleague',
    promptRomaji: 'Saikin dō desu ka?',
    promptHiragana: 'さいきんどうですか？',
    correctRomaji: 'Genki desu.',
    correctHiragana: 'げんきです。',
    correctEnglish: "I'm doing well.",
    distractors: [
      { romaji: 'Genki o desu.', hiragana: 'げんきをです。', english: 'Extraneous object particle' },
      { romaji: 'Desu genki wa.', hiragana: 'ですげんきは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Saikin dō no desu ka?', hiragana: 'さいきんどうのですか？', english: 'Extraneous particle error' },
      { romaji: 'Desu ka saikin dō?', hiragana: 'ですかさいきんどう？', english: 'Inverted word order' },
    ],
  },

  // 51. How is your Japanese? -> It's interesting.
  {
    id: 'exch-51',
    category: 'daily-inquiry',
    categoryLabel: 'Daily Inquiry & Studies',
    situationTitle: 'Language Progress',
    englishMeaning: 'How is your Japanese?',
    promptSpeaker: 'Teacher',
    promptRomaji: 'Nihongo wa dō desu ka?',
    promptHiragana: 'にほんごはどうですか？',
    correctRomaji: 'Omoshiroi desu.',
    correctHiragana: 'おもしろいです。',
    correctEnglish: "It's interesting.",
    distractors: [
      { romaji: 'Omoshiroi o desu.', hiragana: 'おもしろいをです。', english: 'Extraneous particle error' },
      { romaji: 'Desu omoshiroi wa.', hiragana: 'ですおもしろいは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Nihongo no dō desu ka?', hiragana: 'にほんごのどうですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka Nihongo wa dō?', hiragana: 'ですか日本語はどう？', english: 'Inverted word order' },
    ],
  },

  // 52. How are your studies? -> It's difficult.
  {
    id: 'exch-52',
    category: 'daily-inquiry',
    categoryLabel: 'Daily Inquiry & Studies',
    situationTitle: 'Study Check',
    englishMeaning: 'How are your studies?',
    promptSpeaker: 'Friend',
    promptRomaji: 'Benkyō wa dō desu ka?',
    promptHiragana: 'べんきょうはどうですか？',
    correctRomaji: 'Muzukashii desu.',
    correctHiragana: 'むずかしいです。',
    correctEnglish: "It's difficult.",
    distractors: [
      { romaji: 'Muzukashii o desu.', hiragana: 'むずかしいをです。', english: 'Extraneous particle error' },
      { romaji: 'Desu muzukashii wa.', hiragana: 'ですむずかしいは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Benkyō ni dō desu ka?', hiragana: 'べんきょうにどうですか？', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Desu ka Benkyō wa dō?', hiragana: 'ですかべんきょうはどう？', english: 'Inverted word order' },
    ],
  },

  // 53. How is your family? -> Everyone is doing well.
  {
    id: 'exch-53',
    category: 'daily-inquiry',
    categoryLabel: 'Daily Inquiry & Family',
    situationTitle: 'Family Well-being',
    englishMeaning: 'How is your family?',
    promptSpeaker: 'Neighbor',
    promptRomaji: 'Kazoku wa dō desu ka?',
    promptHiragana: 'かぞくはどうですか？',
    correctRomaji: 'Minna genki desu.',
    correctHiragana: 'みんなげんきです。',
    correctEnglish: 'Everyone is doing well.',
    distractors: [
      { romaji: 'Minna o genki desu.', hiragana: 'みんなをげんきです。', english: 'Extraneous particle error' },
      { romaji: 'Genki desu minna wa.', hiragana: 'げんきですみんなは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Kazoku no dō desu ka?', hiragana: 'かぞくのどうですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka Kazoku wa dō?', hiragana: 'ですかかぞくはどう？', english: 'Inverted word order' },
    ],
  },

  // 54. What day of the week is it today? -> Today is Monday.
  {
    id: 'exch-54',
    category: 'time-days',
    categoryLabel: 'Days of the Week',
    situationTitle: 'Calendar Check: Today',
    englishMeaning: 'What day of the week is it today?',
    promptSpeaker: 'Coworker',
    promptRomaji: "Kyō wa nan'yōbi desu ka?",
    promptHiragana: 'きょうはなんようびですか？',
    correctRomaji: 'Kyō wa getsuyōbi desu.',
    correctHiragana: 'きょうはげつようびです。',
    correctEnglish: 'Today is Monday.',
    distractors: [
      { romaji: 'Kyō ni getsuyōbi desu.', hiragana: 'きょうにげつようびです。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Getsuyōbi desu kyō wa.', hiragana: 'げつようびですきょうは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: "Kyō no nan'yōbi desu ka?", hiragana: 'きょうのなんようびですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: "Desu ka kyō wa nan'yōbi?", hiragana: 'ですかきょうはなんようび？', english: 'Inverted word order' },
    ],
  },

  // 55. What day is tomorrow? -> Tomorrow is Tuesday.
  {
    id: 'exch-55',
    category: 'time-days',
    categoryLabel: 'Days of the Week',
    situationTitle: 'Calendar Check: Tomorrow',
    englishMeaning: 'What day is tomorrow?',
    promptSpeaker: 'Classmate',
    promptRomaji: "Ashita wa nan'yōbi desu ka?",
    promptHiragana: 'あしたはなんようびですか？',
    correctRomaji: 'Ashita wa kayōbi desu.',
    correctHiragana: 'あしたはかようびです。',
    correctEnglish: 'Tomorrow is Tuesday.',
    distractors: [
      { romaji: 'Ashita ni kayōbi desu.', hiragana: 'あしたにかようびです。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Kayōbi desu ashita wa.', hiragana: 'かようびですあしたは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: "Ashita no nan'yōbi desu ka?", hiragana: 'あしたのなんようびですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: "Desu ka ashita wa nan'yōbi?", hiragana: 'ですかあしたはなんようび？', english: 'Inverted word order' },
    ],
  },

  // 56. What time is it now? -> It is 3:30 PM.
  {
    id: 'exch-56',
    category: 'time-days',
    categoryLabel: 'Hours & Minutes',
    situationTitle: 'Asking Time: Afternoon',
    englishMeaning: 'What time is it now?',
    promptSpeaker: 'Traveler',
    promptRomaji: 'Ima, nanji desu ka?',
    promptHiragana: 'いま、なんじですか？',
    correctRomaji: 'Gogo sanji han desu.',
    correctHiragana: 'ごごさんじはんです。',
    correctEnglish: 'It is 3:30 PM.',
    distractors: [
      { romaji: 'Sanji han gogo desu.', hiragana: 'さんじはんごごです。', english: 'Incorrect word order (time before PM)' },
      { romaji: 'Gogo sanji han o desu.', hiragana: 'ごごさんじはんをです。', english: 'Extraneous object particle' },
    ],
    questionDistractors: [
      { romaji: 'Ima, nanji no desu ka?', hiragana: 'いま、なんじのですか？', english: 'Extraneous particle error' },
      { romaji: 'Desu ka ima, nanji?', hiragana: 'ですか今、なんじ？', english: 'Inverted word order' },
    ],
  },

  // 57. What time is it now? -> It is 8 AM.
  {
    id: 'exch-57',
    category: 'time-days',
    categoryLabel: 'Hours & Minutes',
    situationTitle: 'Asking Time: Morning',
    englishMeaning: 'What time is it now?',
    promptSpeaker: 'Hotel clerk',
    promptRomaji: 'Ima, nanji desu ka?',
    promptHiragana: 'いま、なんじですか？',
    correctRomaji: 'Gozen hachiji desu.',
    correctHiragana: 'ごぜんはちじです。',
    correctEnglish: 'It is 8 AM.',
    distractors: [
      { romaji: 'Hachiji gozen desu.', hiragana: 'はちじごぜんです。', english: 'Incorrect word order (time before AM)' },
      { romaji: 'Gozen hachiji o desu.', hiragana: 'ごぜんはちじをです。', english: 'Extraneous object particle' },
    ],
    questionDistractors: [
      { romaji: 'Ima, nanji ni desu ka?', hiragana: 'いま、なんじにですか？', english: 'Particle error: "ni" in equation sentence' },
      { romaji: 'Nanji desu ka ima?', hiragana: 'なんじですか今？', english: 'Inverted word order' },
    ],
  },

  // 58. What is this? -> This is a ballpoint pen.
  {
    id: 'exch-58',
    category: 'demonstratives',
    categoryLabel: 'Demonstratives & Identification',
    situationTitle: 'Object Identification: This',
    englishMeaning: 'What is this?',
    promptSpeaker: 'Student',
    promptRomaji: 'Kore wa nan desu ka?',
    promptHiragana: 'これはなんですか？',
    correctRomaji: 'Kore wa bōrupen desu.',
    correctHiragana: 'これはボールペンです。',
    correctEnglish: 'This is a ballpoint pen.',
    distractors: [
      { romaji: 'Kore ni bōrupen desu.', hiragana: 'これにボールペンです。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Bōrupen desu kore wa.', hiragana: 'ボールペンですこれは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Kore no nan desu ka?', hiragana: 'これのなんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka kore wa nan?', hiragana: 'ですかこれは何？', english: 'Inverted word order' },
    ],
  },

  // 59. What is that over there? -> That over there is a wallet.
  {
    id: 'exch-59',
    category: 'demonstratives',
    categoryLabel: 'Demonstratives & Identification',
    situationTitle: 'Object Identification: That Over There',
    englishMeaning: 'What is that over there?',
    promptSpeaker: 'Shopper',
    promptRomaji: 'Are wa nan desu ka?',
    promptHiragana: 'あれはなんですか？',
    correctRomaji: 'Are wa saifu desu.',
    correctHiragana: 'あれはさいふです。',
    correctEnglish: 'That over there is a wallet.',
    distractors: [
      { romaji: 'Are ni saifu desu.', hiragana: 'あれにさいふです。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Saifu desu are wa.', hiragana: 'さいふですあれは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Are no nan desu ka?', hiragana: 'あれのなんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka are wa nan?', hiragana: 'ですかあれは何？', english: 'Inverted word order' },
    ],
  },

  // 60. What is that? -> That is a wallet.
  {
    id: 'exch-60',
    category: 'demonstratives',
    categoryLabel: 'Demonstratives & Identification',
    situationTitle: 'Object Identification: That',
    englishMeaning: 'What is that?',
    promptSpeaker: 'Customer',
    promptRomaji: 'Sore wa nan desu ka?',
    promptHiragana: 'それはなんですか？',
    correctRomaji: 'Sore wa saifu desu.',
    correctHiragana: 'それはさいふです。',
    correctEnglish: 'That is a wallet.',
    distractors: [
      { romaji: 'Sore ni saifu desu.', hiragana: 'それにさいふです。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Saifu desu sore wa.', hiragana: 'さいふですそれは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Sore no nan desu ka?', hiragana: 'それのなんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka sore wa nan?', hiragana: 'ですかそれは何？', english: 'Inverted word order' },
    ],
  },

  // 61. Please listen. -> Yes, I will listen.
  {
    id: 'exch-61',
    category: 'classroom',
    categoryLabel: 'Classroom Phrases',
    situationTitle: 'Teacher Request: Listen',
    englishMeaning: 'Please listen.',
    promptSpeaker: 'Teacher',
    semanticPattern: 'classroom-request',
    subjectEntity: 'teacher',
    promptRomaji: 'Kiite kudasai.',
    promptHiragana: 'きいてください。',
    correctRomaji: 'Hai, kikimasu.',
    correctHiragana: 'はい、ききます。',
    correctEnglish: 'Yes, I will listen.',
    distractors: [
      { romaji: 'Hai, kiite kudasai.', hiragana: 'はい、きいてください。', english: 'Echoing request instead of responding' },
      { romaji: 'Kikimasu hai.', hiragana: 'ききますはい。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Kiite no kudasai.', hiragana: 'きいてのください。', english: 'Extraneous particle error' },
      { romaji: 'Kudasai kiite.', hiragana: 'くださいきいて。', english: 'Inverted phrasing' },
    ],
  },

  // 62. Please write. -> Yes, I will write.
  {
    id: 'exch-62',
    category: 'classroom',
    categoryLabel: 'Classroom Phrases',
    situationTitle: 'Teacher Request: Write',
    englishMeaning: 'Please write.',
    promptSpeaker: 'Teacher',
    semanticPattern: 'classroom-request',
    subjectEntity: 'teacher',
    promptRomaji: 'Kaite kudasai.',
    promptHiragana: 'かいてください。',
    correctRomaji: 'Hai, kakimasu.',
    correctHiragana: 'はい、かきます。',
    correctEnglish: 'Yes, I will write.',
    distractors: [
      { romaji: 'Hai, kaite kudasai.', hiragana: 'はい、かいてください。', english: 'Echoing request instead of responding' },
      { romaji: 'Kakimasu hai.', hiragana: 'かきますはい。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Kaite no kudasai.', hiragana: 'かいてのください。', english: 'Extraneous particle error' },
      { romaji: 'Kudasai kaite.', hiragana: 'くださいかいて。', english: 'Inverted phrasing' },
    ],
  },

  // 63. Please read. -> Yes, I will read.
  {
    id: 'exch-63',
    category: 'classroom',
    categoryLabel: 'Classroom Phrases',
    situationTitle: 'Teacher Request: Read',
    englishMeaning: 'Please read.',
    promptSpeaker: 'Teacher',
    semanticPattern: 'classroom-request',
    subjectEntity: 'teacher',
    promptRomaji: 'Yonde kudasai.',
    promptHiragana: 'よんでください。',
    correctRomaji: 'Hai, yomimasu.',
    correctHiragana: 'はい、よみます。',
    correctEnglish: 'Yes, I will read.',
    distractors: [
      { romaji: 'Hai, yonde kudasai.', hiragana: 'はい、よんでください。', english: 'Echoing request instead of responding' },
      { romaji: 'Yomimasu hai.', hiragana: 'よみますはい。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Yonde no kudasai.', hiragana: 'よんでのください。', english: 'Extraneous particle error' },
      { romaji: 'Kudasai yonde.', hiragana: 'くださいよんで。', english: 'Inverted phrasing' },
    ],
  },

  // 64. Please open to page 3. -> Yes, I will open it.
  {
    id: 'exch-64',
    category: 'classroom',
    categoryLabel: 'Classroom Phrases',
    situationTitle: 'Teacher Request: Page 3',
    englishMeaning: 'Please open to page 3.',
    promptSpeaker: 'Teacher',
    semanticPattern: 'classroom-request',
    subjectEntity: 'teacher',
    promptRomaji: 'San-pēji o hiraite kudasai.',
    promptHiragana: 'さんぺーじをひらいてください。',
    correctRomaji: 'Hai, hirakimasu.',
    correctHiragana: 'はい、ひらきます。',
    correctEnglish: 'Yes, I will open it.',
    distractors: [
      { romaji: 'Hai, san-pēji o kudasai.', hiragana: 'はい、さんぺーじをください。', english: 'Omitted verb "hiraite"' },
      { romaji: 'San-pēji ni hirakimasu hai.', hiragana: 'さんぺーじにひらきますはい。', english: 'Incorrect particle and order' },
    ],
    questionDistractors: [
      { romaji: 'San-pēji ni hiraite kudasai.', hiragana: 'さんぺーじにひらいてください。', english: 'Particle error: "ni" instead of "o"' },
      { romaji: 'Kudasai hiraite san-pēji o.', hiragana: 'くださいひらいてさんぺーじを。', english: 'Inverted phrasing order' },
    ],
  },

  // 65. Please say it. -> Yes, I will say it.
  {
    id: 'exch-65',
    category: 'classroom',
    categoryLabel: 'Classroom Phrases',
    situationTitle: 'Teacher Request: Say It',
    englishMeaning: 'Please say it.',
    promptSpeaker: 'Teacher',
    semanticPattern: 'classroom-request',
    subjectEntity: 'teacher',
    promptRomaji: 'Itte kudasai.',
    promptHiragana: 'いってください。',
    correctRomaji: 'Hai, iimasu.',
    correctHiragana: 'はい、いいます。',
    correctEnglish: 'Yes, I will say it.',
    distractors: [
      { romaji: 'Hai, itte kudasai.', hiragana: 'はい、いってください。', english: 'Echoing request instead of responding' },
      { romaji: 'Iimasu hai.', hiragana: 'いいますはい。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Itte no kudasai.', hiragana: 'いってのください。', english: 'Extraneous particle error' },
      { romaji: 'Kudasai itte.', hiragana: 'くださいいって。', english: 'Inverted phrasing' },
    ],
  },

  // 66. Please look. -> Yes, I will look.
  {
    id: 'exch-66',
    category: 'classroom',
    categoryLabel: 'Classroom Phrases',
    situationTitle: 'Teacher Request: Look',
    englishMeaning: 'Please look.',
    promptSpeaker: 'Teacher',
    semanticPattern: 'classroom-request',
    subjectEntity: 'teacher',
    promptRomaji: 'Mite kudasai.',
    promptHiragana: 'みてください。',
    correctRomaji: 'Hai, mimasu.',
    correctHiragana: 'はい、みます。',
    correctEnglish: 'Yes, I will look.',
    distractors: [
      { romaji: 'Hai, mite kudasai.', hiragana: 'はい、みてください。', english: 'Echoing request instead of responding' },
      { romaji: 'Mimasu hai.', hiragana: 'みますはい。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Mite no kudasai.', hiragana: 'みてのください。', english: 'Extraneous particle error' },
      { romaji: 'Kudasai mite.', hiragana: 'くださいみて。', english: 'Inverted phrasing' },
    ],
  },

  // 67. Please talk in pairs. -> Yes, we will talk.
  {
    id: 'exch-67',
    category: 'classroom',
    categoryLabel: 'Classroom Phrases',
    situationTitle: 'Pair Work Request',
    englishMeaning: 'Please talk in pairs.',
    promptSpeaker: 'Teacher',
    semanticPattern: 'classroom-request',
    subjectEntity: 'teacher',
    promptRomaji: 'Pea de hanashite kudasai.',
    promptHiragana: 'ぺあではなしてください。',
    correctRomaji: 'Hai, hanashimasu.',
    correctHiragana: 'はい、はなします。',
    correctEnglish: 'Yes, we will talk.',
    distractors: [
      { romaji: 'Hai, pea o hanashite kudasai.', hiragana: 'はい、ぺあをはなしてください。', english: 'Incorrect particle: "o" instead of "de"' },
      { romaji: 'Hanashimasu hai pea de.', hiragana: 'はなしますはいぺあで。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Pea o hanashite kudasai.', hiragana: 'ぺあをはなしてください。', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Kudasai pea de hanashite.', hiragana: 'くださいぺあではなして。', english: 'Inverted phrasing' },
    ],
  },

  // 68. Please wait 10 minutes. -> Yes, I will wait.
  {
    id: 'exch-68',
    category: 'classroom',
    categoryLabel: 'Classroom & Courtesy',
    situationTitle: 'Waiting Request: 10 Minutes',
    englishMeaning: 'Please wait 10 minutes.',
    promptSpeaker: 'Colleague',
    semanticPattern: 'classroom-request',
    subjectEntity: 'colleague',
    promptRomaji: 'Juppun matte kudasai.',
    promptHiragana: 'じゅっぷんまってください。',
    correctRomaji: 'Hai, machimasu.',
    correctHiragana: 'はい、まちます。',
    correctEnglish: 'Yes, I will wait.',
    distractors: [
      { romaji: 'Hai, juppun o matte kudasai.', hiragana: 'はい、じゅっぷんをまってください。', english: 'Extraneous particle error' },
      { romaji: 'Machimasu hai juppun.', hiragana: 'まちますはいじゅっぷん。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Juppun no matte kudasai.', hiragana: 'じゅっぷんのまってください。', english: 'Extraneous particle error' },
      { romaji: 'Kudasai juppun matte.', hiragana: 'くださいじゅっぷんまって。', english: 'Inverted phrasing' },
    ],
  },

  // 69. Where does your father work? -> He works at a company.
  {
    id: 'exch-69',
    category: 'places-work',
    categoryLabel: 'Family & Work',
    situationTitle: 'Father Workplace Inquiry',
    englishMeaning: 'Where does your father work?',
    promptSpeaker: 'Friend',
    semanticPattern: 'workplace-location',
    subjectEntity: 'father',
    promptRomaji: 'Otōsan wa doko de hataraite imasu ka?',
    promptHiragana: 'おとうさんはどこではたらいていますか？',
    correctRomaji: 'Kaisha de hataraite imasu.',
    correctHiragana: 'かいしゃではたらいています。',
    correctEnglish: 'He works at a company.',
    distractors: [
      { romaji: 'Kaisha o hataraite imasu.', hiragana: 'かいしゃをはたらいています。', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Hataraite kaisha de imasu.', hiragana: 'はたらいてかいしゃでいます。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Otōsan no doko de hataraite imasu ka?', hiragana: 'おとうさんのどこではたらいていますか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka otōsan wa doko de hataraite?', hiragana: 'ですかおとうさんはどこではたらいて？', english: 'Inverted sentence structure' },
    ],
  },

  // 70. Where does your mother work? -> She works at a hospital.
  {
    id: 'exch-70',
    category: 'places-work',
    categoryLabel: 'Family & Work',
    situationTitle: 'Mother Workplace Inquiry',
    englishMeaning: 'Where does your mother work?',
    promptSpeaker: 'Acquaintance',
    semanticPattern: 'workplace-location',
    subjectEntity: 'mother',
    promptRomaji: 'Okāsan wa doko de hataraite imasu ka?',
    promptHiragana: 'おかあさんはどこではたらいていますか？',
    correctRomaji: 'Byōin de hataraite imasu.',
    correctHiragana: 'びょういんではたらいています。',
    correctEnglish: 'She works at a hospital.',
    distractors: [
      { romaji: 'Byōin o hataraite imasu.', hiragana: 'びょういんをはたらいています。', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Hataraite byōin de imasu.', hiragana: 'はたらいてびょういんでいます。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Okāsan no doko de hataraite imasu ka?', hiragana: 'おかあさんのどこではたらいていますか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka okāsan wa doko de hataraite?', hiragana: 'ですかおかあさんはどこではたらいて？', english: 'Inverted sentence structure' },
    ],
  },

  // 71. How old is your father? -> He is 50 years old.
  {
    id: 'exch-71',
    category: 'age-numbers',
    categoryLabel: 'Family & Age',
    situationTitle: 'Father Age Inquiry',
    englishMeaning: 'How old is your father?',
    promptSpeaker: 'Doctor',
    semanticPattern: 'age-inquiry',
    subjectEntity: 'father',
    promptRomaji: 'Otōsan wa nan-sai desu ka?',
    promptHiragana: 'おとうさんはなんさいですか？',
    correctRomaji: 'Gojissai desu.',
    correctHiragana: 'ごじゅっさいです。',
    correctEnglish: 'He is 50 years old.',
    distractors: [
      { romaji: 'Gojissai o desu.', hiragana: 'ごじゅっさいをです。', english: 'Extraneous object particle' },
      { romaji: 'Desu gojissai wa.', hiragana: 'ですごじゅっさいは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Otōsan no nan-sai desu ka?', hiragana: 'おとうさんのなんさいですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka otōsan wa nan-sai?', hiragana: 'ですかおとうさんはなんさい？', english: 'Inverted word order' },
    ],
  },

  // 72. How old is your mother? -> She is 45 years old.
  {
    id: 'exch-72',
    category: 'age-numbers',
    categoryLabel: 'Family & Age',
    situationTitle: 'Mother Age Inquiry',
    englishMeaning: 'How old is your mother?',
    promptSpeaker: 'Nurse',
    semanticPattern: 'age-inquiry',
    subjectEntity: 'mother',
    promptRomaji: 'Okāsan wa nan-sai desu ka?',
    promptHiragana: 'おかあさんはなんさいですか？',
    correctRomaji: 'Yonjūgo-sai desu.',
    correctHiragana: 'よんじゅうごさいです。',
    correctEnglish: 'She is 45 years old.',
    distractors: [
      { romaji: 'Yonjūgo-sai no desu.', hiragana: 'よんじゅうごさいのです。', english: 'Extraneous possessive particle' },
      { romaji: 'Desu yonjūgo-sai wa.', hiragana: 'ですよんじゅうごさいは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Okāsan no nan-sai desu ka?', hiragana: 'おかあさんのなんさいですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka okāsan wa nan-sai?', hiragana: 'ですかおかあさんはなんさい？', english: 'Inverted word order' },
    ],
  },

  // 73. Is your mother a homemaker? -> Yes, she is a homemaker.
  {
    id: 'exch-73',
    category: 'occupations',
    categoryLabel: 'Family & Occupations',
    situationTitle: 'Mother Homemaker Status',
    englishMeaning: 'Is your mother a homemaker?',
    promptSpeaker: 'Neighbor',
    semanticPattern: 'occupation-status',
    subjectEntity: 'mother',
    promptRomaji: 'Okāsan wa shufu desu ka?',
    promptHiragana: 'おかあさんはしゅふですか？',
    correctRomaji: 'Hai, shufu desu.',
    correctHiragana: 'はい、しゅふです。',
    correctEnglish: 'Yes, she is a homemaker.',
    distractors: [
      { romaji: 'Hai, shufu o desu.', hiragana: 'はい、しゅふをです。', english: 'Extraneous object particle' },
      { romaji: 'Hai, shufu wa desu.', hiragana: 'はい、しゅふはです。', english: 'Misplaced particle' },
    ],
    questionDistractors: [
      { romaji: 'Okāsan no shufu desu ka?', hiragana: 'おかあさんのしゅふですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka okāsan wa shufu?', hiragana: 'ですかおかあさんはしゅふ？', english: 'Inverted word order' },
    ],
  },

  // 74. Is that man a doctor? -> Yes, he works at a hospital.
  {
    id: 'exch-74',
    category: 'occupations',
    categoryLabel: 'People & Occupations',
    situationTitle: 'Male Doctor Inquiry',
    englishMeaning: 'Is that man a doctor?',
    promptSpeaker: 'Visitor',
    semanticPattern: 'occupation-status',
    subjectEntity: 'man',
    promptRomaji: 'Ano otoko no hito wa isha desu ka?',
    promptHiragana: 'あのおとこのひとはいしゃですか？',
    correctRomaji: 'Hai, byōin de hataraite imasu.',
    correctHiragana: 'はい、びょういんではたらいています。',
    correctEnglish: 'Yes, he works at a hospital.',
    distractors: [
      { romaji: 'Hai, byōin o hataraite imasu.', hiragana: 'はい、びょういんをはたらいています。', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Hai, hataraite byōin de imasu.', hiragana: 'はい、はたらいてびょういんでいます。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Ano otoko no hito no isha desu ka?', hiragana: 'あのおとこのひとのいしゃですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka ano otoko no hito wa isha?', hiragana: 'ですかあのおとこのひとはいしゃ？', english: 'Inverted word order' },
    ],
  },

  // 75. Is that woman a teacher? -> Yes, she works at a school.
  {
    id: 'exch-75',
    category: 'occupations',
    categoryLabel: 'People & Occupations',
    situationTitle: 'Female Teacher Inquiry',
    englishMeaning: 'Is that woman a teacher?',
    promptSpeaker: 'Parent',
    semanticPattern: 'occupation-status',
    subjectEntity: 'woman',
    promptRomaji: 'Ano onna no hito wa sensei desu ka?',
    promptHiragana: 'あのおんなのひとはせんせいですか？',
    correctRomaji: 'Hai, gakkō de hataraite imasu.',
    correctHiragana: 'はい、がっこうではたらいています。',
    correctEnglish: 'Yes, she works at a school.',
    distractors: [
      { romaji: 'Hai, gakkō o hataraite imasu.', hiragana: 'はい、がっこうをはたらいています。', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Hai, hataraite gakkō de imasu.', hiragana: 'はい、はたらいてがっこうでいます。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Ano onna no hito no sensei desu ka?', hiragana: 'あのおんなのひとのせんせいですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka ano onna no hito wa sensei?', hiragana: 'ですかあのおんなのひとはせんせい？', english: 'Inverted word order' },
    ],
  },

  // 76. Is that man a lawyer? -> Yes, he is a lawyer.
  {
    id: 'exch-76',
    category: 'occupations',
    categoryLabel: 'People & Occupations',
    situationTitle: 'Lawyer Status Inquiry',
    englishMeaning: 'Is that man a lawyer?',
    promptSpeaker: 'Client',
    semanticPattern: 'occupation-status',
    subjectEntity: 'man',
    promptRomaji: 'Ano otoko no hito wa bengoshi desu ka?',
    promptHiragana: 'あのおとこのひとはべんごしですか？',
    correctRomaji: 'Hai, bengoshi desu.',
    correctHiragana: 'はい、べんごしです。',
    correctEnglish: 'Yes, he is a lawyer.',
    distractors: [
      { romaji: 'Hai, bengoshi o desu.', hiragana: 'はい、べんごしをです。', english: 'Extraneous object particle' },
      { romaji: 'Bengoshi wa ano otoko no hito desu.', hiragana: 'べんごしはあのおとこのひとです。', english: 'Inverted topic/predicate' },
    ],
    questionDistractors: [
      { romaji: 'Ano otoko no hito no bengoshi desu ka?', hiragana: 'あのおとこのひとのべんごしですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka ano otoko no hito wa bengoshi?', hiragana: 'ですかあのおとこのひとはべんごし？', english: 'Inverted word order' },
    ],
  },

  // 77. Is that woman a nurse? -> Yes, she works at a hospital.
  {
    id: 'exch-77',
    category: 'occupations',
    categoryLabel: 'People & Occupations',
    situationTitle: 'Nurse Status Inquiry',
    englishMeaning: 'Is that woman a nurse?',
    promptSpeaker: 'Patient',
    semanticPattern: 'occupation-status',
    subjectEntity: 'woman',
    promptRomaji: 'Ano onna no hito wa kangoshi desu ka?',
    promptHiragana: 'あのおんなのひとはかんごしですか？',
    correctRomaji: 'Hai, byōin de hataraite imasu.',
    correctHiragana: 'はい、びょういんではたらいています。',
    correctEnglish: 'Yes, she works at a hospital.',
    distractors: [
      { romaji: 'Hai, byōin ni hataraite imasu.', hiragana: 'はい、びょういんにはたらいています。', english: 'Particle error: "ni" instead of "de"' },
      { romaji: 'Hai, kangoshi de byōin desu.', hiragana: 'はい、かんごしでびょういんです。', english: 'Garbled phrasing' },
    ],
    questionDistractors: [
      { romaji: 'Ano onna no hito no kangoshi desu ka?', hiragana: 'あのおんなのひとのかんごしですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka ano onna no hito wa kangoshi?', hiragana: 'ですかあのおんなのひとはかんごし？', english: 'Inverted word order' },
    ],
  },

  // 78. How old is that elderly person? -> They are 70 years old.
  {
    id: 'exch-78',
    category: 'age-numbers',
    categoryLabel: 'Age & People',
    situationTitle: 'Elderly Age Inquiry: 70',
    englishMeaning: 'How old is that elderly person?',
    promptSpeaker: 'Caregiver',
    semanticPattern: 'age-inquiry',
    subjectEntity: 'elderly',
    promptRomaji: 'Ano otoshiyori wa nan-sai desu ka?',
    promptHiragana: 'あのおとしよりはなんさいですか？',
    correctRomaji: 'Nanajissai desu.',
    correctHiragana: 'ななじゅっさいです。',
    correctEnglish: 'They are 70 years old.',
    distractors: [
      { romaji: 'Nanajissai o desu.', hiragana: 'ななじゅっさいをです。', english: 'Extraneous object particle' },
      { romaji: 'Desu nanajissai wa.', hiragana: 'ですななじゅっさいは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Ano otoshiyori no nan-sai desu ka?', hiragana: 'あのおとしよりのなんさいですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka ano otoshiyori wa nan-sai?', hiragana: 'ですかあのおとしよりはなんさい？', english: 'Inverted word order' },
    ],
  },

  // 79. What is this? -> That is a watch.
  {
    id: 'exch-79',
    category: 'demonstratives',
    categoryLabel: 'Demonstratives & Identification',
    situationTitle: 'Object Identification: Watch',
    englishMeaning: 'What is this?',
    promptSpeaker: 'Shopper',
    semanticPattern: 'demonstrative-object',
    subjectEntity: 'object',
    promptRomaji: 'Kore wa nan desu ka?',
    promptHiragana: 'これはなんですか？',
    correctRomaji: 'Sore wa tokei desu.',
    correctHiragana: 'それはとけいです。',
    correctEnglish: 'That is a watch.',
    distractors: [
      { romaji: 'Sore ni tokei desu.', hiragana: 'それにとけいです。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Tokei desu sore wa.', hiragana: 'とけいですそれは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Kore no nan desu ka?', hiragana: 'これのなんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka kore wa nan?', hiragana: 'ですかこれは何？', english: 'Inverted word order' },
    ],
  },

  // 80. What is that? -> This is a book.
  {
    id: 'exch-80',
    category: 'demonstratives',
    categoryLabel: 'Demonstratives & Identification',
    situationTitle: 'Object Identification: Book',
    englishMeaning: 'What is that?',
    promptSpeaker: 'Friend',
    semanticPattern: 'demonstrative-object',
    subjectEntity: 'object',
    promptRomaji: 'Sore wa nan desu ka?',
    promptHiragana: 'それはなんですか？',
    correctRomaji: 'Kore wa hon desu.',
    correctHiragana: 'これはほんです。',
    correctEnglish: 'This is a book.',
    distractors: [
      { romaji: 'Kore ni hon desu.', hiragana: 'これにほんです。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Hon desu kore wa.', hiragana: 'ほんですこれは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Sore no nan desu ka?', hiragana: 'それのなんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka sore wa nan?', hiragana: 'ですかそれは何？', english: 'Inverted word order' },
    ],
  },

  // 81. What is that over there? -> That over there is an umbrella.
  {
    id: 'exch-81',
    category: 'demonstratives',
    categoryLabel: 'Demonstratives & Identification',
    situationTitle: 'Object Identification: Umbrella',
    englishMeaning: 'What is that over there?',
    promptSpeaker: 'Customer',
    semanticPattern: 'demonstrative-object',
    subjectEntity: 'object',
    promptRomaji: 'Are wa nan desu ka?',
    promptHiragana: 'あれはなんですか？',
    correctRomaji: 'Are wa kasa desu.',
    correctHiragana: 'あれはかさです。',
    correctEnglish: 'That over there is an umbrella.',
    distractors: [
      { romaji: 'Are ni kasa desu.', hiragana: 'あれにかさです。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Kasa desu are wa.', hiragana: 'かさですあれは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Are no nan desu ka?', hiragana: 'あれのなんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka are wa nan?', hiragana: 'ですかあれは何？', english: 'Inverted word order' },
    ],
  },

  // 82. What is this? -> That is a dictionary.
  {
    id: 'exch-82',
    category: 'demonstratives',
    categoryLabel: 'Demonstratives & Identification',
    situationTitle: 'Object Identification: Dictionary',
    englishMeaning: 'What is this?',
    promptSpeaker: 'Student',
    semanticPattern: 'demonstrative-object',
    subjectEntity: 'object',
    promptRomaji: 'Kore wa nan desu ka?',
    promptHiragana: 'これはなんですか？',
    correctRomaji: 'Sore wa jisho desu.',
    correctHiragana: 'それはじしょです。',
    correctEnglish: 'That is a dictionary.',
    distractors: [
      { romaji: 'Sore ni jisho desu.', hiragana: 'それにはじしょです。', english: 'Particle error' },
      { romaji: 'Jisho desu sore wa.', hiragana: 'じしょですそれは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Kore no nan desu ka?', hiragana: 'これのなんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka kore wa nan?', hiragana: 'ですかこれは何？', english: 'Inverted word order' },
    ],
  },

  // 83. What is that over there? -> That over there is a computer.
  {
    id: 'exch-83',
    category: 'demonstratives',
    categoryLabel: 'Demonstratives & Identification',
    situationTitle: 'Object Identification: Computer',
    englishMeaning: 'What is that over there?',
    promptSpeaker: 'Coworker',
    semanticPattern: 'demonstrative-object',
    subjectEntity: 'object',
    promptRomaji: 'Are wa nan desu ka?',
    promptHiragana: 'あれはなんですか？',
    correctRomaji: 'Are wa konpyūtā desu.',
    correctHiragana: 'あれはこんぴゅーたーです。',
    correctEnglish: 'That over there is a computer.',
    distractors: [
      { romaji: 'Are ni konpyūtā desu.', hiragana: 'あれにこんぴゅーたーです。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Konpyūtā desu are wa.', hiragana: 'こんぴゅーたーですあれは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Are no nan desu ka?', hiragana: 'あれのなんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka are wa nan?', hiragana: 'ですかあれは何？', english: 'Inverted word order' },
    ],
  },

  // 84. What time is it now? -> It is 9 o'clock.
  {
    id: 'exch-84',
    category: 'time-days',
    categoryLabel: 'Hours & Minutes',
    situationTitle: 'Asking Time: 9 o\'clock',
    englishMeaning: 'What time is it now?',
    promptSpeaker: 'Passenger',
    semanticPattern: 'time-clock',
    subjectEntity: 'clock',
    promptRomaji: 'Ima, nanji desu ka?',
    promptHiragana: 'いま、なんじですか？',
    correctRomaji: 'Kuji desu.',
    correctHiragana: 'くじです。',
    correctEnglish: 'It is 9 o\'clock.',
    distractors: [
      { romaji: 'Kyūji desu.', hiragana: 'きゅうじです。', english: 'Irregular error: "kuji" is correct for 9 o\'clock' },
      { romaji: 'Kuji o desu.', hiragana: 'くじをです。', english: 'Extraneous object particle' },
    ],
    questionDistractors: [
      { romaji: 'Ima, nanji no desu ka?', hiragana: 'いま、なんじのですか？', english: 'Extraneous particle error' },
      { romaji: 'Desu ka ima, nanji?', hiragana: 'ですか今、なんじ？', english: 'Inverted word order' },
    ],
  },

  // 85. What time is it now? -> It is 4 o'clock.
  {
    id: 'exch-85',
    category: 'time-days',
    categoryLabel: 'Hours & Minutes',
    situationTitle: 'Asking Time: 4 o\'clock',
    englishMeaning: 'What time is it now?',
    promptSpeaker: 'Client',
    semanticPattern: 'time-clock',
    subjectEntity: 'clock',
    promptRomaji: 'Ima, nanji desu ka?',
    promptHiragana: 'いま、なんじですか？',
    correctRomaji: 'Yoji desu.',
    correctHiragana: 'よじです。',
    correctEnglish: 'It is 4 o\'clock.',
    distractors: [
      { romaji: 'Yonji desu.', hiragana: 'よんじです。', english: 'Irregular error: "yoji" is correct for 4 o\'clock' },
      { romaji: 'Yoji o desu.', hiragana: 'よじをです。', english: 'Extraneous object particle' },
    ],
    questionDistractors: [
      { romaji: 'Ima, nanji no desu ka?', hiragana: 'いま、なんじのですか？', english: 'Extraneous particle error' },
      { romaji: 'Desu ka ima, nanji?', hiragana: 'ですか今、なんじ？', english: 'Inverted word order' },
    ],
  },

  // 86. What time is it now? -> It is 7 o'clock.
  {
    id: 'exch-86',
    category: 'time-days',
    categoryLabel: 'Hours & Minutes',
    situationTitle: 'Asking Time: 7 o\'clock',
    englishMeaning: 'What time is it now?',
    promptSpeaker: 'Colleague',
    semanticPattern: 'time-clock',
    subjectEntity: 'clock',
    promptRomaji: 'Ima, nanji desu ka?',
    promptHiragana: 'いま、なんじですか？',
    correctRomaji: 'Shichiji desu.',
    correctHiragana: 'しちじです。',
    correctEnglish: 'It is 7 o\'clock.',
    distractors: [
      { romaji: 'Nanaji desu.', hiragana: 'ななじです。', english: 'Irregular error: "shichiji" is correct for 7 o\'clock' },
      { romaji: 'Shichiji o desu.', hiragana: 'しちじをです。', english: 'Extraneous object particle' },
    ],
    questionDistractors: [
      { romaji: 'Ima, nanji no desu ka?', hiragana: 'いま、なんじのですか？', english: 'Extraneous particle error' },
      { romaji: 'Desu ka ima, nanji?', hiragana: 'ですか今、なんじ？', english: 'Inverted word order' },
    ],
  },

  // 87. What day is tomorrow? -> Tomorrow is Friday.
  {
    id: 'exch-87',
    category: 'time-days',
    categoryLabel: 'Days of the Week',
    situationTitle: 'Calendar Check: Friday',
    englishMeaning: 'What day is tomorrow?',
    promptSpeaker: 'Coworker',
    semanticPattern: 'day-calendar',
    subjectEntity: 'calendar',
    promptRomaji: "Ashita wa nan'yōbi desu ka?",
    promptHiragana: 'あしたはなんようびですか？',
    correctRomaji: "Ashita wa kin'yōbi desu.",
    correctHiragana: 'あしたはきんようびです。',
    correctEnglish: 'Tomorrow is Friday.',
    distractors: [
      { romaji: "Ashita ni kin'yōbi desu.", hiragana: 'あしたにきんようびです。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: "Kin'yōbi desu ashita wa.", hiragana: 'きんようびですあしたは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: "Ashita no nan'yōbi desu ka?", hiragana: 'あしたのなんようびですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: "Desu ka ashita wa nan'yōbi?", hiragana: 'ですかあしたはなんようび？', english: 'Inverted word order' },
    ],
  },

  // 88. What day was the day before yesterday? -> The day before yesterday was Sunday.
  {
    id: 'exch-88',
    category: 'time-days',
    categoryLabel: 'Days and Dates',
    situationTitle: 'Calendar Check: Day Before Yesterday',
    englishMeaning: 'What day was the day before yesterday?',
    promptSpeaker: 'Friend',
    semanticPattern: 'day-calendar',
    subjectEntity: 'calendar',
    promptRomaji: "Ototoi wa nan'yōbi deshita ka?",
    promptHiragana: 'おとといはなんようびでしたか？',
    correctRomaji: 'Ototoi wa nichiyōbi deshita.',
    correctHiragana: 'おとといはにちようびでした。',
    correctEnglish: 'The day before yesterday was Sunday.',
    distractors: [
      { romaji: 'Ototoi ni nichiyōbi deshita.', hiragana: 'おとといににちようびでした。', english: 'Particle error: "ni" instead of "wa"' },
      { romaji: 'Nichiyōbi deshita ototoi wa.', hiragana: 'にちようびでしたおとといは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: "Ototoi no nan'yōbi deshita ka?", hiragana: 'おとといのなんようびでしたか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: "Deshita ka ototoi wa nan'yōbi?", hiragana: 'でしたかおとといはなんようび？', english: 'Inverted word order' },
    ],
  },

  // 89. How have things been lately? -> So-so / Not bad.
  {
    id: 'exch-89',
    category: 'daily-inquiry',
    categoryLabel: 'Daily Inquiry & Feelings',
    situationTitle: 'Catching Up: So-so',
    englishMeaning: 'How have things been lately?',
    promptSpeaker: 'Classmate',
    semanticPattern: 'daily-inquiry',
    subjectEntity: 'self',
    promptRomaji: 'Saikin dō desu ka?',
    promptHiragana: 'さいきんどうですか？',
    correctRomaji: 'Māmā desu.',
    correctHiragana: 'まあまあです。',
    correctEnglish: 'So-so / Not bad.',
    distractors: [
      { romaji: 'Māmā o desu.', hiragana: 'まあまあをです。', english: 'Extraneous object particle' },
      { romaji: 'Desu māmā wa.', hiragana: 'ですまあまあは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Saikin no dō desu ka?', hiragana: 'さいきんのどうですか？', english: 'Extraneous particle error' },
      { romaji: 'Desu ka saikin dō?', hiragana: 'ですかさいきんどう？', english: 'Inverted word order' },
    ],
  },

  // 90. How are your studies? -> It's interesting.
  {
    id: 'exch-90',
    category: 'daily-inquiry',
    categoryLabel: 'Daily Inquiry & Studies',
    situationTitle: 'Study Check: Interesting',
    englishMeaning: 'How are your studies?',
    promptSpeaker: 'Tutor',
    semanticPattern: 'daily-inquiry',
    subjectEntity: 'student',
    promptRomaji: 'Benkyō wa dō desu ka?',
    promptHiragana: 'べんきょうはどうですか？',
    correctRomaji: 'Omoshiroi desu.',
    correctHiragana: 'おもしろいです。',
    correctEnglish: "It's interesting.",
    distractors: [
      { romaji: 'Omoshiroi o desu.', hiragana: 'おもしろいをです。', english: 'Extraneous object particle' },
      { romaji: 'Desu omoshiroi wa.', hiragana: 'ですおもしろいは。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Benkyō no dō desu ka?', hiragana: 'べんきょうのどうですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Desu ka benkyō wa dō?', hiragana: 'ですかべんきょうはどう？', english: 'Inverted word order' },
    ],
  },

  // =========================================================================
  // SPRITE-DEDICATED CONVERSATIONAL EXCHANGES (All 16 visual manga panels)
  // =========================================================================

  // 1. Sprite 05: Waiter taking an order at a restaurant (Waiter & customer)
  {
    id: 'exch-sprite-05a',
    category: 'daily-inquiry',
    categoryLabel: 'Restaurant & Dining',
    situationTitle: 'Ordering at a Restaurant',
    englishMeaning: 'May I take your order?',
    promptSpeaker: 'Waiter',
    semanticPattern: 'restaurant-order',
    subjectEntity: 'waiter',
    spriteId: '05',
    promptRomaji: 'Gochūmon wa okimari desu ka?',
    promptHiragana: 'ごちゅうもんは おきまりですか？',
    correctRomaji: 'Hai, kōhī to chokorēto o kudasai.',
    correctHiragana: 'はい、こーひーと ちょこれーとを ください。',
    correctEnglish: 'Yes, coffee and chocolate please.',
    distractors: [
      { romaji: 'Hai, kōhī to chokorēto de kudasai.', hiragana: 'はい、こーひーと ちょこれーとで ください。', english: 'Particle error: "de" instead of "o"' },
      { romaji: 'Hai, kudasai kōhī to chokorēto o.', hiragana: 'はい、ください こーひーと ちょこれーとを。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Gochūmon no okimari desu ka?', hiragana: 'ごちゅうもんの おきまりですか？', english: 'Particle error' },
      { romaji: 'Desu ka gochūmon wa okimari?', hiragana: 'ですか ごちゅうもんは おきまり？', english: 'Inverted word order' },
    ],
  },
  {
    id: 'exch-sprite-05b',
    category: 'daily-inquiry',
    categoryLabel: 'Restaurant & Dining',
    situationTitle: 'Asking for Water at Restaurant',
    englishMeaning: 'Could I have some water, please?',
    promptSpeaker: 'Customer',
    semanticPattern: 'restaurant-water',
    subjectEntity: 'customer',
    spriteId: '05',
    promptRomaji: 'Sumimasen, o-mizu o kudasai.',
    promptHiragana: 'すみません、おみずを ください。',
    correctRomaji: 'Hai, kashikomarimashita. Shōshō o-machi kudasai.',
    correctHiragana: 'はい、かしこまりました。しょうしょう おまち ください。',
    correctEnglish: 'Certainly. Please wait just a moment.',
    distractors: [
      { romaji: 'Hai, kashikomarimashita o-machi shōshō.', hiragana: 'はい、かしこまりました おまち しょうしょう。', english: 'Incorrect syntax order' },
      { romaji: 'Iie, o-mizu wa kudasai.', hiragana: 'いいえ、おみずは ください。', english: 'Contradictory negative response' },
    ],
  },

  // 2. Sprite 06: Construction workers discussing work on building site
  {
    id: 'exch-sprite-06a',
    category: 'places-work',
    categoryLabel: 'Work Site & Safety',
    situationTitle: 'Construction Site Safety',
    englishMeaning: 'Is it safety first on the site today?',
    promptSpeaker: 'Construction Worker',
    semanticPattern: 'site-safety',
    subjectEntity: 'construction worker',
    spriteId: '06',
    promptRomaji: 'Kyō no shigoto wa anzen dai-ichi desu ka?',
    promptHiragana: 'きょうの しごとは あんぜんだいいち ですか？',
    correctRomaji: 'Hai, ki o tsukete kudasai.',
    correctHiragana: 'はい、きを つけて ください。',
    correctEnglish: 'Yes, please be careful.',
    distractors: [
      { romaji: 'Hai, ki ni tsukete kudasai.', hiragana: 'はい、きに つけて ください。', english: 'Particle error: "ni" instead of "o"' },
      { romaji: 'Hai, kudasai ki o tsukete.', hiragana: 'はい、ください きを つけて。', english: 'Inverted word order' },
    ],
    questionDistractors: [
      { romaji: 'Kyō no shigoto no anzen dai-ichi desu ka?', hiragana: 'きょうの しごとの あんぜんだいいち ですか？', english: 'Particle error' },
      { romaji: 'Desu ka kyō no shigoto wa anzen?', hiragana: 'ですか きょうの しごとは あんぜん？', english: 'Inverted question order' },
    ],
  },
  {
    id: 'exch-sprite-06b',
    category: 'places-work',
    categoryLabel: 'Work Site Instruction',
    situationTitle: 'Waiting on Construction Site',
    englishMeaning: 'Please wait here for ten minutes.',
    promptSpeaker: 'Foreman',
    semanticPattern: 'site-wait',
    subjectEntity: 'construction worker',
    spriteId: '06',
    promptRomaji: 'Koko de jū-pun matte kudasai.',
    promptHiragana: 'ここで じゅっぷん まって ください。',
    correctRomaji: 'Hai, wakarimashita. Koko de machimasu.',
    correctHiragana: 'はい、わかりました。ここで まちます。',
    correctEnglish: 'Yes, understood. I will wait here.',
    distractors: [
      { romaji: 'Hai, wakarimashita koko o machimasu.', hiragana: 'はい、わかりました ここを まちます。', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Hai, machimasu wakarimashita koko de.', hiragana: 'はい、まちます わかりました ここで。', english: 'Garbled syntax' },
    ],
  },

  // 3. Sprite 09: Two people greeting each other outside train station
  {
    id: 'exch-sprite-09a',
    category: 'introductions',
    categoryLabel: 'Meeting Outside Station',
    situationTitle: 'Reunion at Station',
    englishMeaning: 'Long time no see! Have you been well?',
    promptSpeaker: 'Friend',
    semanticPattern: 'station-greeting',
    subjectEntity: 'friend',
    spriteId: '09',
    promptRomaji: 'Hisashiburi desu ne! O-genki deshita ka?',
    promptHiragana: 'ひさしぶりですね！おげんきでしたか？',
    correctRomaji: 'Hai, hisashiburi! Totemo genki desu.',
    correctHiragana: 'はい、ひさしぶり！とても げんきです。',
    correctEnglish: 'Yes, long time! I have been very well.',
    distractors: [
      { romaji: 'Hai, genki totemo hisashiburi desu.', hiragana: 'はい、げんき とても ひさしぶりです。', english: 'Incorrect modifier placement' },
      { romaji: 'Iie, o-genki deshita.', hiragana: 'いいえ、おげんきでした。', english: 'Mismatched polite honorific to self' },
    ],
  },
  {
    id: 'exch-sprite-09b',
    category: 'daily-inquiry',
    categoryLabel: 'Meeting Outside Station',
    situationTitle: 'Where are you heading from the station?',
    englishMeaning: 'Where are you going from here?',
    promptSpeaker: 'Acquaintance',
    semanticPattern: 'station-destination',
    subjectEntity: 'young woman',
    spriteId: '09',
    promptRomaji: 'Kore kara doko e ikimasu ka?',
    promptHiragana: 'これから どこへ いきますか？',
    correctRomaji: 'Toshokan e ikimasu. Hon o yomimasu.',
    correctHiragana: 'としょかんへ いきます。ほんを よみます。',
    correctEnglish: 'I am going to the library. I will read books.',
    distractors: [
      { romaji: 'Toshokan o ikimasu hon e yomimasu.', hiragana: 'としょかんを いきます ほんへ よみます。', english: 'Inverted particles "o" and "e"' },
      { romaji: 'Ikimasu toshokan e yomimasu hon o.', hiragana: 'いきます としょかんへ よみます ほんを。', english: 'Inverted sentence structure' },
    ],
  },

  // 4. Sprite 10: Chef serving a meal to a customer (Male chef & customer)
  {
    id: 'exch-sprite-10a',
    category: 'daily-inquiry',
    categoryLabel: 'Chef & Dining',
    situationTitle: 'Chef Serving Meal',
    englishMeaning: 'Thank you for waiting! Here is your hot meal.',
    promptSpeaker: 'Chef',
    semanticPattern: 'chef-serving',
    subjectEntity: 'chef',
    spriteId: '10',
    promptRomaji: 'O-machidō-sama desu! Go-chūmon no gohan desu.',
    promptHiragana: 'おまちどうさまです！ごちゅうもんの ごはんです。',
    correctRomaji: 'Arigatō gozaimasu! Itadakimasu.',
    correctHiragana: 'ありがとうございます！いただきます。',
    correctEnglish: 'Thank you very much! Let\'s eat.',
    distractors: [
      { romaji: 'Arigatō gozaimasu itadakimasen.', hiragana: 'ありがとうございます いただきません。', english: 'Negative verb refusal' },
      { romaji: 'Gohan no o-machidō-sama arigatō.', hiragana: 'ごはんの おまちどうさま ありがとう。', english: 'Mismatched phrasing' },
    ],
  },
  {
    id: 'exch-sprite-10b',
    category: 'daily-inquiry',
    categoryLabel: 'Chef & Dining',
    situationTitle: 'Chef Asking About Taste',
    englishMeaning: 'How does it taste? Is it delicious?',
    promptSpeaker: 'Chef',
    semanticPattern: 'chef-taste',
    subjectEntity: 'chef',
    spriteId: '10',
    promptRomaji: 'O-aji wa dō desu ka? Oishii desu ka?',
    promptHiragana: 'おあじは どうですか？おいしいですか？',
    correctRomaji: 'Hai, totemo oishii desu! Gochisōsama deshita.',
    correctHiragana: 'はい、とても おいしいです！ごちそうさまでした。',
    correctEnglish: 'Yes, it is very delicious! Thank you for the meal.',
    distractors: [
      { romaji: 'Hai, oishii totemo desu gochisōsama.', hiragana: 'はい、おいしい とても です ごちそうさま。', english: 'Adverb placement error' },
      { romaji: 'Iie, totemo oishii desu.', hiragana: 'いいえ、とても おいしいです。', english: 'Contradictory negative opener' },
    ],
  },

  // 5. Sprite 11: Woman in kimono talking outdoors (Kyoto / Traditional setting)
  {
    id: 'exch-sprite-11a',
    category: 'courtesy',
    categoryLabel: 'Traditional Kyoto Setting',
    situationTitle: 'First Time in Kyoto',
    englishMeaning: 'Is this your first time in Kyoto?',
    promptSpeaker: 'Woman in Kimono',
    semanticPattern: 'kyoto-visit',
    subjectEntity: 'woman in kimono',
    spriteId: '11',
    promptRomaji: 'Kyōto wa hajimete desu ka?',
    promptHiragana: 'きょうとは はじめてですか？',
    correctRomaji: 'Hai, hajimete desu. Totemo kirei desu ne.',
    correctHiragana: 'はい、はじめてです。とても きれいですね。',
    correctEnglish: 'Yes, it is my first time. It is very beautiful.',
    distractors: [
      { romaji: 'Hai, kirei hajimete desu totemo.', hiragana: 'はい、きれい はじめてです とても。', english: 'Scrambled syntax' },
      { romaji: 'Hai, Kyōto ni hajimete desu.', hiragana: 'はい、きょうとに はじめてです。', english: 'Particle error' },
    ],
  },
  {
    id: 'exch-sprite-11b',
    category: 'courtesy',
    categoryLabel: 'Traditional Tea Hospitality',
    situationTitle: 'Offering Green Tea',
    englishMeaning: 'Please, have some Japanese green tea.',
    promptSpeaker: 'Woman in Kimono',
    semanticPattern: 'kyoto-tea',
    subjectEntity: 'woman in kimono',
    spriteId: '11',
    promptRomaji: 'Dōzo, o-cha o meshiagatte kudasai.',
    promptHiragana: 'どうぞ、おちゃを めしあがって ください。',
    correctRomaji: 'Dōmo arigatō gozaimasu. Itadakimasu.',
    correctHiragana: 'どうも ありがとうございます。いただきます。',
    correctEnglish: 'Thank you very much. I will partake.',
    distractors: [
      { romaji: 'Dōmo arigatō gozaimasu o-cha wa kudasai.', hiragana: 'どうも ありがとうございます おちゃは ください。', english: 'Redundant request phrasing' },
      { romaji: 'Itadakimasu dōzo arigatō.', hiragana: 'いただきます どうぞ ありがとう。', english: 'Improper response combination' },
    ],
  },

  // 6. Sprite 12: Police officer speaking with young man at koban
  {
    id: 'exch-sprite-12a',
    category: 'places-work',
    categoryLabel: 'Directions at Koban',
    situationTitle: 'Asking Police for Station Directions',
    englishMeaning: 'Excuse me, where is the train station?',
    promptSpeaker: 'Young Man',
    semanticPattern: 'police-station-directions',
    subjectEntity: 'police officer',
    spriteId: '12',
    promptRomaji: 'Sumimasen, eki wa doko desu ka?',
    promptHiragana: 'すみません、えきは どこですか？',
    correctRomaji: 'Kono michi o massugu itte kudasai. Migi ni arimasu.',
    correctHiragana: 'このみちを まっすぐ いって ください。みぎに あります。',
    correctEnglish: 'Please go straight down this street. It is on the right.',
    distractors: [
      { romaji: 'Kono michi ni massugu itte kudasai.', hiragana: 'このみちに まっすぐ いって ください。', english: 'Particle error: "ni" instead of "o"' },
      { romaji: 'Eki wa doko kudasai itte massugu.', hiragana: 'えきは どこ ください いって まっすぐ。', english: 'Garbled word order' },
    ],
  },
  {
    id: 'exch-sprite-12b',
    category: 'places-work',
    categoryLabel: 'Directions at Koban',
    situationTitle: 'Asking for Police Box Location',
    englishMeaning: 'Is the police box over there?',
    promptSpeaker: 'Citizen',
    semanticPattern: 'police-box-location',
    subjectEntity: 'police officer',
    spriteId: '12',
    promptRomaji: 'Kōban wa asoko desu ka?',
    promptHiragana: 'こうばんは あそこですか？',
    correctRomaji: 'Hai, koko ga kōban desu yo. Dō shimashita ka?',
    correctHiragana: 'はい、ここが こうばんですよ。どうしましたか？',
    correctEnglish: 'Yes, this is the police box. What is the matter?',
    distractors: [
      { romaji: 'Hai, kōban ga koko desu ka?', hiragana: 'はい、こうばんが ここですか？', english: 'Inappropriate question inflection' },
      { romaji: 'Iie, koko wa kōban desu.', hiragana: 'いいえ、ここは こうばんです。', english: 'Contradictory reply' },
    ],
  },

  // 7. Sprite 15: Two men talking at gym after workout
  {
    id: 'exch-sprite-15a',
    category: 'daily-inquiry',
    categoryLabel: 'Gym & Fitness',
    situationTitle: 'After Workout at the Gym',
    englishMeaning: 'How was today\'s workout? Good exercise?',
    promptSpeaker: 'Gym Partner',
    semanticPattern: 'gym-workout-review',
    subjectEntity: 'gym partner',
    spriteId: '15',
    promptRomaji: 'Kyō no torēningu wa dō deshita ka?',
    promptHiragana: 'きょうの とれーにんぐは どうでしたか？',
    correctRomaji: 'Tsukaremashita ga, totemo ii undō ni narimashita.',
    correctHiragana: 'つかれましたが、とても いいうんどうに なりました。',
    correctEnglish: 'I am tired, but it was very good exercise.',
    distractors: [
      { romaji: 'Tsukaremashita totemo ga undō desu.', hiragana: 'つかれました とてもが うんどうです。', english: 'Particle placement error' },
      { romaji: 'Iie, torēningu wa dō deshita.', hiragana: 'いいえ、とれーにんぐは どうでした。', english: 'Inappropriate question echo' },
    ],
  },
  {
    id: 'exch-sprite-15b',
    category: 'daily-inquiry',
    categoryLabel: 'Gym & Fitness',
    situationTitle: 'Finishing Exercise at the Gym',
    englishMeaning: 'Shall we do one more set?',
    promptSpeaker: 'Gym Partner',
    semanticPattern: 'gym-finish-session',
    subjectEntity: 'gym partner',
    spriteId: '15',
    promptRomaji: 'Mō ichido yarimasu ka?',
    promptHiragana: 'もういちど やりますか？',
    correctRomaji: 'Iie, kyō wa koko made ni shimashō. O-tsukaresama!',
    correctHiragana: 'いいえ、きょうは ここまでに しましょう。おつかれさま！',
    correctEnglish: 'No, let\'s stop here for today. Great workout!',
    distractors: [
      { romaji: 'Iie, shimashō koko made kyō wa.', hiragana: 'いいえ、しましょう ここまで きょうは。', english: 'Inverted clause order' },
      { romaji: 'Hai, mō ichido yari de imasu.', hiragana: 'はい、もういちど やりで います。', english: 'Ungrammatical verb conjugation' },
    ],
  },

  // ==========================================
  // BATCH 5 CONVERSATIONAL EXCHANGES:
  // Family, Age, Residence, Where You Live, Objects & Possession
  // ==========================================

  // 1. Asking Age (Polite)
  {
    id: 'exch-oikutsu-age',
    category: 'age-numbers',
    categoryLabel: 'Age & Numbers',
    situationTitle: 'Asking Age (Polite Form)',
    englishMeaning: 'How old are you? (polite)',
    promptSpeaker: 'Colleague',
    semanticPattern: 'asking-age-polite',
    subjectEntity: 'colleague',
    spriteId: '04',
    promptRomaji: 'Oikutsu desu ka?',
    promptHiragana: 'おいくつですか？',
    correctRomaji: 'Sanjūgo-sai desu.',
    correctHiragana: 'さんじゅうごさいです。',
    correctEnglish: 'I am 35 years old.',
    distractors: [
      { romaji: 'Desu sanjūgo-sai.', hiragana: 'です さんじゅうごさい。', english: 'Copula inverted before number' },
      { romaji: 'Sanjūgo-sai no desu.', hiragana: 'さんじゅうごさいの です。', english: 'Erroneous possessive "no"' },
    ],
    questionDistractors: [
      { romaji: 'Oikutsu no desu ka?', hiragana: 'おいくつのですか？', english: 'Erroneous particle "no"' },
      { romaji: 'Desu ka oikutsu?', hiragana: 'ですか おいくつ？', english: 'Inverted question order' },
    ],
  },

  // 2. Asking Where Someone Lives (Bangkok)
  {
    id: 'exch-where-live-bangkok',
    category: 'places-work',
    categoryLabel: 'Places & Living',
    situationTitle: 'Asking Where Someone Lives',
    englishMeaning: 'Where do you live?',
    promptSpeaker: 'Acquaintance',
    semanticPattern: 'where-do-you-live',
    subjectEntity: 'acquaintance',
    spriteId: '09',
    promptRomaji: 'Doko ni sunde imasu ka?',
    promptHiragana: 'どこに すんでいますか？',
    correctRomaji: 'Bankoku ni sunde imasu.',
    correctHiragana: 'ばんこくに すんでいます。',
    correctEnglish: 'I live in Bangkok.',
    distractors: [
      { romaji: 'Bankoku de sunde imasu.', hiragana: 'ばんこくで すんでいます。', english: 'Incorrect particle "de" for residence' },
      { romaji: 'Bankoku ni imasu sunde.', hiragana: 'ばんこくに います すんで。', english: 'Split auxiliary verb order' },
    ],
    questionDistractors: [
      { romaji: 'Doko de sunde imasu ka?', hiragana: 'どこで すんでいますか？', english: 'Particle error: "de" instead of "ni"' },
      { romaji: 'Sunde imasu ka doko ni?', hiragana: 'すんでいますか どこに？', english: 'Inverted question clause' },
    ],
  },

  // 3. Asking Where Family Lives (Tokyo)
  {
    id: 'exch-where-live-family-tokyo',
    category: 'places-work',
    categoryLabel: 'Places & Living',
    situationTitle: 'Asking Where Family Lives',
    englishMeaning: 'Where do you and your family live?',
    promptSpeaker: 'Friend',
    semanticPattern: 'where-do-you-live-family',
    subjectEntity: 'family',
    spriteId: '14',
    promptRomaji: 'Doko ni sunde imasu ka?',
    promptHiragana: 'どこに すんでいますか？',
    correctRomaji: 'Watashitachi wa Tōkyō ni sunde imasu.',
    correctHiragana: 'わたしたちは とうきょうに すんでいます。',
    correctEnglish: 'We live in Tokyo.',
    distractors: [
      { romaji: 'Watashitachi wa Tōkyō no sunde imasu.', hiragana: 'わたしたちは とうきょうの すんでいます。', english: 'Incorrect particle "no" instead of "ni"' },
      { romaji: 'Tōkyō ni watashitachi sunde imasu wa.', hiragana: 'とうきょうに わたしたち すんでいます は。', english: 'Topic marker misplaced at end' },
    ],
    questionDistractors: [
      { romaji: 'Doko wa sunde imasu ka?', hiragana: 'どこは すんでいますか？', english: 'Particle error: "wa" instead of "ni"' },
      { romaji: 'Sunde imasu ka doko ni?', hiragana: 'すんでいますか どこに？', english: 'Inverted clause order' },
    ],
  },

  // 4. Living in Osaka
  {
    id: 'exch-where-live-osaka',
    category: 'places-work',
    categoryLabel: 'Places & Living',
    situationTitle: 'Residence in Osaka',
    englishMeaning: 'Where do you live?',
    promptSpeaker: 'Colleague',
    semanticPattern: 'where-do-you-live-osaka',
    subjectEntity: 'colleague',
    spriteId: '01',
    promptRomaji: 'Doko ni sunde imasu ka?',
    promptHiragana: 'どこに すんでいますか？',
    correctRomaji: 'Watashitachi wa Ōsaka ni sunde imasu.',
    correctHiragana: 'わたしたちは おおさかに すんでいます。',
    correctEnglish: 'We live in Osaka.',
    distractors: [
      { romaji: 'Watashitachi wa Ōsaka de sunde imasu.', hiragana: 'わたしたちは おおさかで すんでいます。', english: 'Incorrect particle "de" for residence' },
      { romaji: 'Ōsaka ni sunde imasu watashitachi no.', hiragana: 'おおさかに すんでいます わたしたちの。', english: 'Trailing dangling particle' },
    ],
    questionDistractors: [
      { romaji: 'Doko ga sunde imasu ka?', hiragana: 'どこが すんでいますか？', english: 'Particle error: "ga" instead of "ni"' },
      { romaji: 'Sunde imasu ka doko de?', hiragana: 'すんでいますか どこで？', english: 'Inverted question order' },
    ],
  },

  // 5. Who is this person? -> Father, mother and me
  {
    id: 'exch-kono-hito-dare',
    category: 'people',
    categoryLabel: 'People & Family',
    situationTitle: 'Identifying People in Photo',
    englishMeaning: 'Who is this person?',
    promptSpeaker: 'Friend looking at photo',
    semanticPattern: 'who-is-this-person',
    subjectEntity: 'friend',
    spriteId: '14',
    promptRomaji: 'Kono hito wa dare desu ka?',
    promptHiragana: 'このひとは だれですか？',
    correctRomaji: 'Chichi to haha to watashi desu.',
    correctHiragana: 'ちちと ははと わたしです。',
    correctEnglish: 'My father, my mother and me.',
    distractors: [
      { romaji: 'Chichi wa haha wa watashi desu.', hiragana: 'ちちは ははは わたしです。', english: 'Repeated topic particle "wa" instead of listing "to"' },
      { romaji: 'Haha to chichi desu to watashi.', hiragana: 'ははと ちちです と わたし。', english: 'Copula inserted mid-list' },
    ],
    questionDistractors: [
      { romaji: 'Kono hito no dare desu ka?', hiragana: 'このひとの だれですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Dare desu ka kono hito wa?', hiragana: 'だれですか このひとは？', english: 'Inverted inquiry order' },
    ],
  },

  // 6. Who is that person? (Polite) -> That is Rei. That is Maria.
  {
    id: 'exch-ano-kata-donata',
    category: 'people',
    categoryLabel: 'People & Polite Inquiry',
    situationTitle: 'Polite Inquiry About Someone',
    englishMeaning: 'Who is that person? (polite)',
    promptSpeaker: 'Office Colleague',
    semanticPattern: 'who-is-that-person-polite',
    subjectEntity: 'colleague',
    spriteId: '03',
    promptRomaji: 'Ano kata wa donata desu ka?',
    promptHiragana: 'あのかたは どなたですか？',
    correctRomaji: 'Rei-san desu. Maria-san desu.',
    correctHiragana: 'れいさんです。まりあさんです。',
    correctEnglish: 'That is Rei. That is Maria.',
    distractors: [
      { romaji: 'Rei-san no Maria-san desu.', hiragana: 'れいさんの まりあさんです。', english: 'Erroneous possessive particle linking names' },
      { romaji: 'Desu Rei-san, desu Maria-san.', hiragana: 'です れいさん、です まりあさん。', english: 'Copula preceding names' },
    ],
    questionDistractors: [
      { romaji: 'Ano kata no donata desu ka?', hiragana: 'あのかたの どなたですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Donata desu ka ano kata wa?', hiragana: 'どなたですか あのかたは？', english: 'Inverted question order' },
    ],
  },

  // 7. What do you do for work? -> Bank employee
  {
    id: 'exch-oshigoto-wa',
    category: 'occupations',
    categoryLabel: 'Work & Occupations',
    situationTitle: 'Polite Inquiry on Work',
    englishMeaning: 'What do you do for work?',
    promptSpeaker: 'New Acquaintance',
    semanticPattern: 'asking-work-polite',
    subjectEntity: 'acquaintance',
    spriteId: '03',
    promptRomaji: 'O-shigoto wa?',
    promptHiragana: 'おしごとは？',
    correctRomaji: 'Ginkōin desu.',
    correctHiragana: 'ぎんこういんです。',
    correctEnglish: 'I am a bank employee.',
    distractors: [
      { romaji: 'Ginkōin wa arimasen.', hiragana: 'ぎんこういんは ありません。', english: 'Inanimate negative copula' },
      { romaji: 'O-shigoto no ginkōin desu.', hiragana: 'おしごとの ぎんこういんです。', english: 'Repetition of prompt noun' },
    ],
    questionDistractors: [
      { romaji: 'O-shigoto ga?', hiragana: 'おしごとが？', english: 'Subject marker "ga" instead of topic "wa"' },
      { romaji: 'O-shigoto no?', hiragana: 'おしごとの？', english: 'Possessive marker "no"' },
    ],
  },

  // 8. Family Members Count (Three)
  {
    id: 'exch-family-count-three',
    category: 'people',
    categoryLabel: 'Family & Household',
    situationTitle: 'Stating Family Members',
    englishMeaning: 'How many people are in your family?',
    promptSpeaker: 'Colleague',
    semanticPattern: 'family-members-count',
    subjectEntity: 'colleague',
    spriteId: '14',
    promptRomaji: 'Go-kazoku wa nan-nin desu ka?',
    promptHiragana: 'ごかぞくは なんにんですか？',
    correctRomaji: 'Watashi no kazoku wa san-nin desu.',
    correctHiragana: 'わたしのかぞくは さんにんです。',
    correctEnglish: 'There are three people in my family.',
    distractors: [
      { romaji: 'Watashi no kazoku wa san-nin no desu.', hiragana: 'わたしのかぞくは さんにんの です。', english: 'Extraneous particle "no"' },
      { romaji: 'San-nin desu watashi no kazoku wa.', hiragana: 'さんにんです わたしのかぞくは。', english: 'Inverted predicate' },
    ],
    questionDistractors: [
      { romaji: 'Go-kazoku no nan-nin desu ka?', hiragana: 'ごかぞくの なんにんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Nan-nin desu ka go-kazoku wa?', hiragana: 'なんにんですか ごかぞくは？', english: 'Inverted inquiry order' },
    ],
  },

  // 9. Family Members Description (Four)
  {
    id: 'exch-family-members-four',
    category: 'people',
    categoryLabel: 'Family & Household',
    situationTitle: 'Describing Family of Four',
    englishMeaning: 'Who is in your family?',
    promptSpeaker: 'Friend',
    semanticPattern: 'family-members-listing',
    subjectEntity: 'friend',
    spriteId: '14',
    promptRomaji: 'Kazoku wa nan-nin desu ka?',
    promptHiragana: 'かぞくは なんにんですか？',
    correctRomaji: 'Watashi no kazoku wa yo-nin desu. Tsuma to haha to watashi to kodomo desu.',
    correctHiragana: 'わたしのかぞくは よにんです。つまとははとわたしとこどもです。',
    correctEnglish: 'There are four people in my family: my wife, my mother, me and my child.',
    distractors: [
      { romaji: 'Kazoku wa yon-nin desu. Tsuma ya haha ya.', hiragana: 'かぞくは よんにんです。つまや ははや。', english: 'Incorrect pronunciation "yon-nin" instead of "yo-nin"' },
      { romaji: 'Tsuma to haha to watashi to kodomo wa yo-nin desu.', hiragana: 'つまとははとわたしとこどもは よにんです。', english: 'Unnatural syntax order' },
    ],
    questionDistractors: [
      { romaji: 'Kazoku no nan-nin desu ka?', hiragana: 'かぞくの なんにんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Nan-nin desu ka kazoku wa?', hiragana: 'なんにんですか かぞくは？', english: 'Inverted inquiry order' },
    ],
  },

  // 10. Asking What an Object Is
  {
    id: 'exch-kore-wa-nan-desu-ka',
    category: 'demonstratives',
    categoryLabel: 'Objects & Demonstratives',
    situationTitle: 'Asking What an Object Is',
    englishMeaning: 'Um, what is this?',
    promptSpeaker: 'Customer',
    semanticPattern: 'asking-what-object-is',
    subjectEntity: 'customer',
    spriteId: '16',
    promptRomaji: 'Ano, kore wa nan desu ka?',
    promptHiragana: 'あの、これは なんですか？',
    correctRomaji: 'Sore wa Nihon no wain desu.',
    correctHiragana: 'それは にほんの わいんです。',
    correctEnglish: 'That is Japanese wine.',
    distractors: [
      { romaji: 'Kore wa Nihon no wain desu.', hiragana: 'これは にほんの わいんです。', english: 'Wrong perspective: respondent must use "sore" for object near speaker' },
      { romaji: 'Sore wa wain no Nihon desu.', hiragana: 'それは わいんの にほんです。', english: 'Inverted modifier order' },
    ],
    questionDistractors: [
      { romaji: 'Ano, kore no nan desu ka?', hiragana: 'あの、これの なんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Nan desu ka kore wa, ano?', hiragana: 'なんですか これは、あの？', english: 'Disordered sentence components' },
    ],
  },

  // 11. Asking If Umbrella Belongs to Mira
  {
    id: 'exch-kono-kasa-mira-san',
    category: 'demonstratives',
    categoryLabel: 'Possession & Belongings',
    situationTitle: 'Asking If Umbrella Belongs to Mira',
    englishMeaning: 'Is this umbrella Mira\'s?',
    promptSpeaker: 'Friend holding umbrella',
    semanticPattern: 'umbrella-ownership-check',
    subjectEntity: 'friend',
    spriteId: '01',
    promptRomaji: 'Kono kasa wa Mira-san no desu ka?',
    promptHiragana: 'このかさは みらさんのですか？',
    correctRomaji: 'Ie, chigaimasu. Dare no desu ka?',
    correctHiragana: 'いえ、ちがいます。だれの ですか？',
    correctEnglish: 'No, it isn\'t. Whose is it?',
    distractors: [
      { romaji: 'Hai, chigaimasu. Dare no desu.', hiragana: 'はい、ちがいます。だれの です。', english: 'Contradictory affirmation with "chigaimasu"' },
      { romaji: 'Ie, arimasen. Mira-san desu.', hiragana: 'いえ、ありません。みらさんです。', english: 'Wrong negation verb for identity' },
    ],
    questionDistractors: [
      { romaji: 'Kono kasa no Mira-san desu ka?', hiragana: 'このかさの みらさんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Mira-san no desu ka kono kasa wa?', hiragana: 'みらさんのですか このかさは？', english: 'Inverted sentence order' },
    ],
  },

  // 12. Claiming Lost Umbrella
  {
    id: 'exch-dare-no-desu-ka-mine',
    category: 'demonstratives',
    categoryLabel: 'Lost Property & Possession',
    situationTitle: 'Claiming Lost Umbrella',
    englishMeaning: 'Whose is it?',
    promptSpeaker: 'Person holding umbrella',
    semanticPattern: 'whose-object-claimed',
    subjectEntity: 'finder',
    spriteId: '09',
    promptRomaji: 'Dare no desu ka?',
    promptHiragana: 'だれの ですか？',
    correctRomaji: 'A, watashi no desu. Arigatō gozaimasu.',
    correctHiragana: 'あ、わたしのです。ありがとうございます。',
    correctEnglish: 'Ah, it is mine. Thank you very much.',
    distractors: [
      { romaji: 'A, watashi wa desu. Arigatō.', hiragana: 'あ、わたしは です。ありがとう。', english: 'Missing possessive particle "no"' },
      { romaji: 'Watashi no kasa arigatō desu.', hiragana: 'わたしの かさ ありがとうです。', english: 'Ungrammatical polite formulation' },
    ],
    questionDistractors: [
      { romaji: 'Dare wa desu ka?', hiragana: 'だれは ですか？', english: 'Particle error: "wa" instead of possessive "no"' },
      { romaji: 'Desu ka dare no?', hiragana: 'ですか だれの？', english: 'Inverted phrase order' },
    ],
  },

  // 13. Asking Facility Location in Building
  {
    id: 'exch-toilet-kaidan',
    category: 'places-work',
    categoryLabel: 'Facilities & Directions',
    situationTitle: 'Asking Restroom Location in Building',
    englishMeaning: 'Excuse me, where is the restroom?',
    promptSpeaker: 'Visitor',
    semanticPattern: 'facility-location-restroom',
    subjectEntity: 'visitor',
    spriteId: '03',
    promptRomaji: 'Sumimasen, toire wa doko desu ka?',
    promptHiragana: 'すみません、といれは どこですか？',
    correctRomaji: 'Asoko desu. Kaidan no tonari desu.',
    correctHiragana: 'あそこです。かいだんの となりです。',
    correctEnglish: 'It is over there. Next to the stairs.',
    distractors: [
      { romaji: 'Kaidan desu toire no tonari.', hiragana: 'かいだんです といれの となり。', english: 'Inverted spatial relationship' },
      { romaji: 'Doko desu toire wa asoko.', hiragana: 'どこです といれは あそこ。', english: 'Garbled question repetition' },
    ],
    questionDistractors: [
      { romaji: 'Sumimasen, toire no doko desu ka?', hiragana: 'すみません、といれの どこですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Doko desu ka toire wa, sumimasen?', hiragana: 'どこですか といれは、すみません？', english: 'Inverted inquiry order' },
    ],
  },

  // ==========================================
  // BATCH 6 CONVERSATIONAL EXCHANGES:
  // Food & Drink Preferences, Offers, Frequency & Dining Out
  // ==========================================

  // 1. Asking about meat preference vs fish
  {
    id: 'exch-meat-preference',
    category: 'dining-preferences',
    categoryLabel: 'Food Preferences',
    situationTitle: 'Asking About Food Preferences (Meat vs Fish)',
    englishMeaning: 'Do you like meat?',
    promptSpeaker: 'Dinner Companion',
    semanticPattern: 'food-preference-meat',
    subjectEntity: 'companion',
    spriteId: '05',
    promptRomaji: 'Niku ga suki desu ka?',
    promptHiragana: 'にくが すきですか？',
    correctRomaji: 'Hai, niku ga suki desu. Sakana wa suki ja nai desu.',
    correctHiragana: 'はい、にくが すきです。さかなは すきじゃないです。',
    correctEnglish: 'Yes, I like meat. As for fish, I don\'t like it.',
    distractors: [
      { romaji: 'Hai, niku wa suki ja nai desu.', hiragana: 'はい、にくは すきじゃないです。', english: 'Contradictory affirmation with negative predicate' },
      { romaji: 'Niku ga suki desu sakana wa desu.', hiragana: 'にくが すきです さかなは です。', english: 'Incomplete disjointed clause' },
    ],
    questionDistractors: [
      { romaji: 'Niku no suki desu ka?', hiragana: 'にくの すきですか？', english: 'Particle error: "no" instead of "ga"' },
      { romaji: 'Suki desu ka niku ga?', hiragana: 'すきですか にくが？', english: 'Inverted question order' },
    ],
  },

  // 2. Asking what food someone likes
  {
    id: 'exch-what-food-like',
    category: 'dining-preferences',
    categoryLabel: 'Food Preferences',
    situationTitle: 'Asking What Food Someone Likes',
    englishMeaning: 'What food do you like?',
    promptSpeaker: 'Colleague',
    semanticPattern: 'food-preference-general',
    subjectEntity: 'colleague',
    spriteId: '10',
    promptRomaji: 'Tabemono wa nani ga suki desu ka?',
    promptHiragana: 'たべものは なにが すきですか？',
    correctRomaji: 'Niku ga suki desu. Sakana mo suki desu.',
    correctHiragana: 'にくが すきです。さかなも すきです。',
    correctEnglish: 'I like meat. I also like fish.',
    distractors: [
      { romaji: 'Niku ga suki desu sakana mo arimasen.', hiragana: 'にくが すきです さかなも ありません。', english: 'Wrong existence verb for preference' },
      { romaji: 'Tabemono wa nani desu niku.', hiragana: 'たべものは なにです にく。', english: 'Garbled question echo' },
    ],
    questionDistractors: [
      { romaji: 'Tabemono ga nani wa suki desu ka?', hiragana: 'たべものが なには すきですか？', english: 'Swapped particles "ga" and "wa"' },
      { romaji: 'Nani ga suki desu ka tabemono wa?', hiragana: 'なにが すきですか たべものは？', english: 'Inverted clause order' },
    ],
  },

  // 3. Offering coffee (Accepting)
  {
    id: 'exch-coffee-offer-yes',
    category: 'food-drinks',
    categoryLabel: 'Drinks & Offers',
    situationTitle: 'Offering Coffee (Accepting)',
    englishMeaning: 'Would you like some coffee?',
    promptSpeaker: 'Office Colleague',
    semanticPattern: 'drink-offer-coffee-accept',
    subjectEntity: 'colleague',
    spriteId: '03',
    promptRomaji: 'Kōhī o nomimasu ka?',
    promptHiragana: 'こーひーを のみますか？',
    correctRomaji: 'Hai, onegaishimasu.',
    correctHiragana: 'はい、おねがいします。',
    correctEnglish: 'Yes, please.',
    distractors: [
      { romaji: 'Hai, kōhī o nomimasen.', hiragana: 'はい、こーひーを のみません。', english: 'Contradictory positive affirmation with negative verb' },
      { romaji: 'Ie, onegaishimasu.', hiragana: 'いえ、おねがいします。', english: 'Contradictory negative with "onegaishimasu"' },
    ],
    questionDistractors: [
      { romaji: 'Kōhī ni nomimasu ka?', hiragana: 'こーひーに のみますか？', english: 'Particle error: "ni" instead of object marker "o"' },
      { romaji: 'Nomimasu ka kōhī o?', hiragana: 'のみますか こーひーを？', english: 'Inverted clause order' },
    ],
  },

  // 4. Offering coffee (Politely Declining)
  {
    id: 'exch-coffee-offer-no',
    category: 'food-drinks',
    categoryLabel: 'Drinks & Offers',
    situationTitle: 'Offering Coffee (Politely Declining)',
    englishMeaning: 'Would you like some coffee?',
    promptSpeaker: 'Host',
    semanticPattern: 'drink-offer-coffee-decline',
    subjectEntity: 'host',
    spriteId: '03',
    promptRomaji: 'Kōhī o nomimasu ka?',
    promptHiragana: 'こーひーを のみますか？',
    correctRomaji: 'Ie, kekkō desu.',
    correctHiragana: 'いえ、けっこうです。',
    correctEnglish: 'No, thank you.',
    distractors: [
      { romaji: 'Hai, kekkō desu.', hiragana: 'はい、けっこうです。', english: 'Contradictory positive "hai" when declining' },
      { romaji: 'Ie, nomimashō.', hiragana: 'いえ、のみましょう。', english: 'Contradictory invitation ending after declining' },
    ],
    questionDistractors: [
      { romaji: 'Kōhī de nomimasu ka?', hiragana: 'こーひーで のみますか？', english: 'Particle error: "de" instead of "o"' },
      { romaji: 'Nomimasu ka kōhī wa?', hiragana: 'のみますか こーひーは？', english: 'Inverted inquiry order' },
    ],
  },

  // 5. Asking about breakfast habit (Yes)
  {
    id: 'exch-breakfast-habit-yes',
    category: 'food-drinks',
    categoryLabel: 'Daily Meals & Habits',
    situationTitle: 'Asking About Breakfast Habits',
    englishMeaning: 'Do you always eat breakfast?',
    promptSpeaker: 'Friend',
    semanticPattern: 'breakfast-habit-inquiry',
    subjectEntity: 'friend',
    spriteId: '01',
    promptRomaji: 'Itsumo asagohan o tabemasu ka?',
    promptHiragana: 'いつも あさごはんを たべますか？',
    correctRomaji: 'Hai, tabemasu. Pan to kudamono o yoku tabemasu.',
    correctHiragana: 'はい、たべます。ぱんと くだものを よくたべます。',
    correctEnglish: 'Yes, I do. I often eat bread and fruit.',
    distractors: [
      { romaji: 'Hai, asagohan wa tabemasen.', hiragana: 'はい、あさごはんは たべません。', english: 'Affirmative "hai" paired with negative verb' },
      { romaji: 'Iie, pan to kudamono o itsumo tabemasu.', hiragana: 'いいえ、ぱんと くだものを いつも たべます。', english: 'Negative "iie" contradicting affirmative habit' },
    ],
    questionDistractors: [
      { romaji: 'Itsumo asagohan ni tabemasu ka?', hiragana: 'いつも あさごはんに たべますか？', english: 'Particle error: "ni" instead of "o"' },
      { romaji: 'Asagohan o tabemasu ka itsumo?', hiragana: 'あさごはんを たべますか いつも？', english: 'Adverb displaced to end of sentence' },
    ],
  },

  // 6. Asking about breakfast habit (No)
  {
    id: 'exch-breakfast-habit-no',
    category: 'food-drinks',
    categoryLabel: 'Daily Meals & Habits',
    situationTitle: 'Skipping Breakfast',
    englishMeaning: 'Do you always eat breakfast?',
    promptSpeaker: 'Colleague',
    semanticPattern: 'breakfast-habit-skip',
    subjectEntity: 'colleague',
    spriteId: '04',
    promptRomaji: 'Itsumo asagohan o tabemasu ka?',
    promptHiragana: 'いつも あさごはんを たべますか？',
    correctRomaji: 'Iie, asagohan wa tabemasen.',
    correctHiragana: 'いいえ、あさごはんは たべません。',
    correctEnglish: 'No, I don\'t eat breakfast.',
    distractors: [
      { romaji: 'Iie, asagohan o yoku tabemasu.', hiragana: 'いいえ、あさごはんを よくたべます。', english: 'Contradiction: "iie" with affirmative "tabemasu"' },
      { romaji: 'Hai, asagohan wa tabemasen.', hiragana: 'はい、あさごはんは たべません。', english: 'Ungrammatical response pairing' },
    ],
    questionDistractors: [
      { romaji: 'Itsumo asagohan de tabemasu ka?', hiragana: 'いつも あさごはんで たべますか？', english: 'Particle error: "de" instead of "o"' },
      { romaji: 'Tabemasu ka asagohan o itsumo?', hiragana: 'たべますか あさごはんを いつも？', english: 'Inverted inquiry order' },
    ],
  },

  // 7. Frequency of eating (What do you often eat?)
  {
    id: 'exch-frequency-eat',
    category: 'food-drinks',
    categoryLabel: 'Eating Frequency',
    situationTitle: 'Describing Frequency of Foods Eaten',
    englishMeaning: 'What do you often eat?',
    promptSpeaker: 'Acquaintance',
    semanticPattern: 'food-frequency-inquiry',
    subjectEntity: 'acquaintance',
    spriteId: '14',
    promptRomaji: 'Nani o yoku tabemasu ka?',
    promptHiragana: 'なにを よくたべますか？',
    correctRomaji: 'Watashi wa pan to kudamono o yoku tabemasu. Tamago wa amari tabemasen.',
    correctHiragana: 'わたしは ぱんと くだものを よくたべます。たまごは あまりたべません。',
    correctEnglish: 'I often eat bread and fruit. I don\'t eat eggs very often.',
    distractors: [
      { romaji: 'Tamago wa amari tabemasu.', hiragana: 'たまごは あまりたべます。', english: 'Grammar error: "amari" must take a negative verb' },
      { romaji: 'Pan to kudamono o zenzen tabemasu.', hiragana: 'ぱんと くだものを ぜんぜんたべます。', english: 'Grammar error: "zenzen" must take a negative verb' },
    ],
    questionDistractors: [
      { romaji: 'Nani ga yoku tabemasu ka?', hiragana: 'なにが よくたべますか？', english: 'Particle error: "ga" instead of object marker "o"' },
      { romaji: 'Yoku tabemasu ka nani o?', hiragana: 'よくたべますか なにを？', english: 'Inverted inquiry structure' },
    ],
  },

  // 8. Where shall we eat today?
  {
    id: 'exch-where-eat-today',
    category: 'dining-preferences',
    categoryLabel: 'Dining Out',
    situationTitle: 'Choosing a Restaurant Together',
    englishMeaning: 'Where shall we eat today?',
    promptSpeaker: 'Coworker at lunchtime',
    semanticPattern: 'where-eat-today-invitation',
    subjectEntity: 'coworker',
    spriteId: '09',
    promptRomaji: 'Kyō wa doko de tabemasu ka?',
    promptHiragana: 'きょうは どこで たべますか？',
    correctRomaji: 'Ano mise de tabemashō. Rāmen ga oishii desu yo.',
    correctHiragana: 'あのみせで たべましょう。らーめんが おいしいですよ。',
    correctEnglish: 'Let\'s eat at that restaurant over there. Their ramen is delicious!',
    distractors: [
      { romaji: 'Ano mise ni tabemashō. Rāmen ga karai.', hiragana: 'あのみせに たべましょう。らーめんが からい。', english: 'Particle error: "ni" instead of action location "de"' },
      { romaji: 'Kyō wa doko de tabemashō ano mise.', hiragana: 'きょうは どこで たべましょう あのみせ。', english: 'Repetition of question stem' },
    ],
    questionDistractors: [
      { romaji: 'Kyō wa doko ni tabemasu ka?', hiragana: 'きょうは どこに たべますか？', english: 'Particle error: "ni" instead of location of action "de"' },
      { romaji: 'Doko de tabemasu ka kyō wa?', hiragana: 'どこで たべますか きょうは？', english: 'Inverted topic placement' },
    ],
  },

  // 9. Favourite food - Curry is number one
  {
    id: 'exch-curry-number-one',
    category: 'dining-preferences',
    categoryLabel: 'Food Preferences',
    situationTitle: 'Stating Favourite Food (Curry)',
    englishMeaning: 'What is your favourite dish?',
    promptSpeaker: 'Friend',
    semanticPattern: 'favourite-food-curry',
    subjectEntity: 'friend',
    spriteId: '10',
    promptRomaji: 'Suki na ryōri wa nan desu ka?',
    promptHiragana: 'すきなりょうりは なんですか？',
    correctRomaji: 'Karē desu. Karē ga ichiban suki desu.',
    correctHiragana: 'かれーです。かれーが いちばんすきです。',
    correctEnglish: 'Curry. I like curry the most.',
    distractors: [
      { romaji: 'Karē desu. Karē o ichiban suki desu.', hiragana: 'かれーです。かれーを いちばんすきです。', english: 'Particle error: "o" instead of "ga" with suki' },
      { romaji: 'Ichiban suki wa karē ga desu.', hiragana: 'いちばんすきは かれーが です。', english: 'Garbled syntax structure' },
    ],
    questionDistractors: [
      { romaji: 'Suki na ryōri no nan desu ka?', hiragana: 'すきなりょうりの なんですか？', english: 'Particle error: "no" instead of "wa"' },
      { romaji: 'Nan desu ka suki na ryōri wa?', hiragana: 'なんですか すきなりょうりは？', english: 'Inverted inquiry order' },
    ],
  },

  // 10. Agreeing to invitation: Let's do that
  {
    id: 'exch-agree-lets-eat-there',
    category: 'dining-preferences',
    categoryLabel: 'Invitations & Agreement',
    situationTitle: 'Agreeing to a Restaurant Proposal',
    englishMeaning: 'Let\'s eat at that restaurant over there.',
    promptSpeaker: 'Colleague',
    semanticPattern: 'restaurant-suggestion-agreement',
    subjectEntity: 'colleague',
    spriteId: '16',
    promptRomaji: 'Ano mise de tabemashō.',
    promptHiragana: 'あのみせで たべましょう。',
    correctRomaji: 'Jā, sō shimashō.',
    correctHiragana: 'じゃあ、そうしましょう。',
    correctEnglish: 'Okay, let\'s do that.',
    distractors: [
      { romaji: 'Iie, sō shimashō.', hiragana: 'いいえ、そうしましょう。', english: 'Contradictory negative with suggestion agreement' },
      { romaji: 'Jā, ano mise o tabemashō.', hiragana: 'じゃあ、あのみせを たべましょう。', english: 'Ungrammatical object marker "o" on location' },
    ],
    questionDistractors: [
      { romaji: 'Ano mise o tabemashō ka?', hiragana: 'あのみせを たべましょうか？', english: 'Particle error: "o" instead of "de"' },
      { romaji: 'Tabemashō ano mise de?', hiragana: 'たべましょう あのみせで？', english: 'Inverted clause order' },
    ],
  },

  // 11. Asking if curry is spicy
  {
    id: 'exch-curry-spicy-inquiry',
    category: 'dining-preferences',
    categoryLabel: 'Taste & Adjectives',
    situationTitle: 'Asking If Food Is Spicy',
    englishMeaning: 'Is that curry spicy?',
    promptSpeaker: 'Friend looking at menu',
    semanticPattern: 'taste-spicy-curry',
    subjectEntity: 'friend',
    spriteId: '05',
    promptRomaji: 'Sono karē wa karai desu ka?',
    promptHiragana: 'そのかれーは からいですか？',
    correctRomaji: 'Hai, karai desu ga, totemo oishii desu yo.',
    correctHiragana: 'はい、からいですが、とても おいしいですよ。',
    correctEnglish: 'Yes, it is spicy, but very delicious!',
    distractors: [
      { romaji: 'Hai, karai desu ga, mazui desu yo.', hiragana: 'はい、からいですが、まずいですよ。', english: 'Unflattering contradiction' },
      { romaji: 'Iie, karai desu ga oishii desu.', hiragana: 'いいえ、からいですが おいしいです。', english: 'Contradictory negation "iie" with "karai desu ga"' },
    ],
    questionDistractors: [
      { romaji: 'Sono karē ga karai desu ka?', hiragana: 'そのかれーが からいですか？', english: 'Topic marker "wa" replaced inappropriately with "ga"' },
      { romaji: 'Karai desu ka sono karē wa?', hiragana: 'からいですか そのかれーは？', english: 'Inverted predicate' },
    ],
  },

  // 12. Not drinking tea at all (Frequency: zenzen vs yoku)
  {
    id: 'exch-drink-frequency-tea-coffee',
    category: 'food-drinks',
    categoryLabel: 'Drink Frequency',
    situationTitle: 'Describing Drink Habits (Tea vs Coffee)',
    englishMeaning: 'Do you often drink tea?',
    promptSpeaker: 'Colleague',
    semanticPattern: 'drink-frequency-tea-coffee',
    subjectEntity: 'colleague',
    spriteId: '03',
    promptRomaji: 'O-cha o yoku nomimasu ka?',
    promptHiragana: 'おちゃを よくのみますか？',
    correctRomaji: 'Iie, o-cha wa zenzen nomimasen. Kōhī o yoku nomimasu.',
    correctHiragana: 'いいえ、おちゃは ぜんぜんのみません。こーひーを よくのみます。',
    correctEnglish: 'No, I don\'t drink tea at all. I often drink coffee.',
    distractors: [
      { romaji: 'Iie, o-cha wa zenzen nomimasu.', hiragana: 'いいえ、おちゃは ぜんぜんのみます。', english: 'Grammar error: "zenzen" paired with affirmative verb' },
      { romaji: 'Hai, o-cha wa amari nomimasen.', hiragana: 'はい、おちゃは あまりのみません。', english: 'Affirmative "hai" conflicting with negative habit' },
    ],
    questionDistractors: [
      { romaji: 'O-cha ga yoku nomimasu ka?', hiragana: 'おちゃが よくのみますか？', english: 'Particle error: "ga" instead of object marker "o"' },
      { romaji: 'Yoku nomimasu ka o-cha o?', hiragana: 'よくのみますか おちゃを？', english: 'Inverted inquiry order' },
    ],
  },

  // ==========================================
  // BATCH 7: Daily Routines, Food, Places, Transit & Time
  // ==========================================

  // 1. Waking up at 7 AM
  {
    id: 'exch-b7-wake-up',
    category: 'daily-routine',
    categoryLabel: 'Daily Routine',
    situationTitle: 'Morning Routine & Wake-up Time',
    englishMeaning: 'What time do you wake up every morning?',
    promptSpeaker: 'Roommate',
    semanticPattern: 'routine-wake-up',
    subjectEntity: 'friend',
    spriteId: '01',
    promptRomaji: 'Maiasa, nanji ni okimasu ka?',
    promptHiragana: 'まいあさ、なんじにおきますか？',
    correctRomaji: 'Maiasa, shichiji ni okimasu.',
    correctHiragana: 'まいあさ、しちじにおきます。',
    correctEnglish: 'I wake up at 7 every morning.',
    distractors: [
      { romaji: 'Maiasa, shichiji de okimasu.', hiragana: 'まいあさ、しちじでおきます。', english: 'Particle error: "de" instead of "ni" for specific time' },
      { romaji: 'Maiasa, okimasu shichiji ni.', hiragana: 'まいあさ、おきますしちじに。', english: 'Incorrect verb placement' },
    ],
    questionDistractors: [
      { romaji: 'Maiasa, nanji o okimasu ka?', hiragana: 'まいあさ、なんじをおきますか？', english: 'Particle error: "o" instead of time marker "ni"' },
      { romaji: 'Nanji ni okimasu ka maiasa?', hiragana: 'なんじにおきますか まいあさ？', english: 'Inverted time modifier' },
    ],
  },

  // 2. Bedtime at 11 PM
  {
    id: 'exch-b7-bedtime',
    category: 'daily-routine',
    categoryLabel: 'Daily Routine',
    situationTitle: 'Night Routine & Bedtime',
    englishMeaning: 'What time do you go to bed at night?',
    promptSpeaker: 'Friend',
    semanticPattern: 'routine-bedtime',
    subjectEntity: 'friend',
    spriteId: '02',
    promptRomaji: 'Yoru, nanji ni nemasu ka?',
    promptHiragana: 'よる、なんじにねますか？',
    correctRomaji: 'Yoru, jūichiji ni nemasu.',
    correctHiragana: 'よる、じゅういちじにねます。',
    correctEnglish: 'I go to bed at 11 at night.',
    distractors: [
      { romaji: 'Yoru, jūichiji o nemasu.', hiragana: 'よる、じゅういちじをねます。', english: 'Particle error: "o" instead of time marker "ni"' },
      { romaji: 'Yoru, jūichiji ni nemashita.', hiragana: 'よる、じゅういちじにねました。', english: 'Tense mismatch: past "-mashita" instead of daily routine' },
    ],
    questionDistractors: [
      { romaji: 'Yoru, nanji o nemasu ka?', hiragana: 'よる、なんじをおきますか？', english: 'Particle error: "o" instead of "ni"' },
      { romaji: 'Nanji ni nemasu ka yoru?', hiragana: 'なんじにねますか よる？', english: 'Inverted modifier' },
    ],
  },

  // 3. Studying Japanese every day
  {
    id: 'exch-b7-study-nihongo',
    category: 'daily-routine',
    categoryLabel: 'Study Routine',
    situationTitle: 'Daily Japanese Study',
    englishMeaning: 'What do you study every day?',
    promptSpeaker: 'Language Partner',
    semanticPattern: 'routine-study',
    subjectEntity: 'colleague',
    spriteId: '04',
    promptRomaji: 'Mainichi, nani o benkyō shimasu ka?',
    promptHiragana: 'まいにち、なにをべんきょうしますか？',
    correctRomaji: 'Mainichi, nihongo o benkyō shimasu.',
    correctHiragana: 'まいにち、にほんごをべんきょうします。',
    correctEnglish: 'I study Japanese every day.',
    distractors: [
      { romaji: 'Mainichi, nihongo ni benkyō shimasu.', hiragana: 'まいにち、にほんごにべんきょうします。', english: 'Particle error: "ni" instead of direct object "o"' },
      { romaji: 'Mainichi, nihongo o benkyō shimashita.', hiragana: 'まいにち、にほんごをべんきょうしました。', english: 'Tense mismatch: past tense for daily habit' },
    ],
    questionDistractors: [
      { romaji: 'Mainichi, nani ga benkyō shimasu ka?', hiragana: 'まいにち、なにがべんきょうしますか？', english: 'Particle error: "ga" instead of object marker "o"' },
      { romaji: 'Benkyō shimasu ka mainichi?', hiragana: 'べんきょうしますか まいにち？', english: 'Inverted question order' },
    ],
  },

  // 4. Working yesterday (past affirmative -mashita)
  {
    id: 'exch-b7-work-yesterday',
    category: 'daily-routine',
    categoryLabel: 'Past Activity',
    situationTitle: 'Asking About Yesterday',
    englishMeaning: 'What did you do yesterday?',
    promptSpeaker: 'Coworker',
    semanticPattern: 'past-work',
    subjectEntity: 'colleague',
    spriteId: '06',
    promptRomaji: 'Kinō, nani o shimashita ka?',
    promptHiragana: 'きのう、なにをしましたか？',
    correctRomaji: 'Kinō, shigoto o shimashita.',
    correctHiragana: 'きのう、しごとをしました。',
    correctEnglish: 'I worked yesterday.',
    distractors: [
      { romaji: 'Kinō, shigoto o shimasu.', hiragana: 'きのう、しごとをします。', english: 'Tense mismatch: present tense "shimasu" for yesterday' },
      { romaji: 'Kinō, shigoto ni shimashita.', hiragana: 'きのう、しごとにしました。', english: 'Particle error: "ni" instead of object marker "o"' },
    ],
    questionDistractors: [
      { romaji: 'Kinō, nani o shimasu ka?', hiragana: 'きのう、なにをしますか？', english: 'Tense error: present tense question for "kinō"' },
      { romaji: 'Nani o shimashita ka kinō?', hiragana: 'なにをしましたか きのう？', english: 'Inverted time adverb' },
    ],
  },

  // 5. Tomorrow is a day off
  {
    id: 'exch-b7-day-off-tomorrow',
    category: 'time-schedules',
    categoryLabel: 'Work Schedule',
    situationTitle: 'Asking if Working Tomorrow',
    englishMeaning: 'Do you work tomorrow?',
    promptSpeaker: 'Coworker',
    semanticPattern: 'schedule-day-off',
    subjectEntity: 'colleague',
    spriteId: '08',
    promptRomaji: 'Ashita wa shigoto desu ka?',
    promptHiragana: 'あしたはしごとですか？',
    correctRomaji: 'Iie, ashita wa yasumi desu.',
    correctHiragana: 'いいえ、あしたはやすみです。',
    correctEnglish: 'No, tomorrow is a day off.',
    distractors: [
      { romaji: 'Hai, ashita wa yasumi desu.', hiragana: 'はい、あしたはやすみです。', english: 'Affirmative "hai" conflicting with day off negation' },
      { romaji: 'Iie, ashita wa shigoto desu.', hiragana: 'いいえ、あしたはしごとです。', english: 'Negative "iie" conflicting with work affirmation' },
    ],
    questionDistractors: [
      { romaji: 'Ashita o shigoto desu ka?', hiragana: 'あしたをしごとですか？', english: 'Particle error: "o" instead of topic marker "wa"' },
      { romaji: 'Shigoto desu ka ashita wa?', hiragana: 'しごとですか あしたは？', english: 'Inverted inquiry predicate' },
    ],
  },

  // 6. Breakfast inquiry (past tense)
  {
    id: 'exch-b7-breakfast',
    category: 'food-drinks',
    categoryLabel: 'Meals & Food',
    situationTitle: 'Morning Breakfast Inquiry',
    englishMeaning: 'Did you eat breakfast?',
    promptSpeaker: 'Host',
    semanticPattern: 'food-breakfast',
    subjectEntity: 'mother',
    spriteId: '09',
    promptRomaji: 'Asagohan o tabemashita ka?',
    promptHiragana: 'あさごはんをたべましたか？',
    correctRomaji: 'Hai, asagohan o tabemashita.',
    correctHiragana: 'はい、あさごはんをたべました。',
    correctEnglish: 'Yes, I ate breakfast.',
    distractors: [
      { romaji: 'Hai, asagohan o tabemasen deshita.', hiragana: 'はい、あさごはんをたべませんでした。', english: 'Conflicting "hai" with past negative "-masen deshita"' },
      { romaji: 'Iie, asagohan o tabemashita.', hiragana: 'いいえ、あさごはんをたべました。', english: 'Conflicting "iie" with past affirmative "-mashita"' },
    ],
    questionDistractors: [
      { romaji: 'Asagohan ni tabemashita ka?', hiragana: 'あさごはんにたべましたか？', english: 'Particle error: "ni" instead of object marker "o"' },
      { romaji: 'Tabemashita ka asagohan o?', hiragana: 'たべましたか あさごはんを？', english: 'Inverted verb and object' },
    ],
  },

  // 7. Coffee drink habit
  {
    id: 'exch-b7-coffee',
    category: 'food-drinks',
    categoryLabel: 'Beverages',
    situationTitle: 'Offering Coffee',
    englishMeaning: 'Do you drink coffee?',
    promptSpeaker: 'Cafe Host',
    semanticPattern: 'drink-coffee',
    subjectEntity: 'colleague',
    spriteId: '10',
    promptRomaji: 'Kōhī o nomimasu ka?',
    promptHiragana: 'こーひーをのみますか？',
    correctRomaji: 'Hai, kōhī o nomimasu.',
    correctHiragana: 'はい、こーひーをのみます。',
    correctEnglish: 'Yes, I drink coffee.',
    distractors: [
      { romaji: 'Hai, kōhī o nomimasen.', hiragana: 'はい、こーひーをのみません。', english: 'Conflicting "hai" with negative verb "nomimasen"' },
      { romaji: 'Iie, kōhī o nomimasu.', hiragana: 'いいえ、こーひーをのみます。', english: 'Conflicting "iie" with affirmative verb "nomimasu"' },
    ],
    questionDistractors: [
      { romaji: 'Kōhī ni nomimasu ka?', hiragana: 'こーひーにのみますか？', english: 'Particle error: "ni" instead of direct object "o"' },
      { romaji: 'Nomimasu ka kōhī o?', hiragana: 'のみますか こーひーを？', english: 'Inverted drink inquiry' },
    ],
  },

  // 8. Liking meat
  {
    id: 'exch-b7-meat-like',
    category: 'dining-preferences',
    categoryLabel: 'Preferences',
    situationTitle: 'Food Preference Inquiry',
    englishMeaning: 'Do you like meat?',
    promptSpeaker: 'Dining Friend',
    semanticPattern: 'pref-meat',
    subjectEntity: 'friend',
    spriteId: '11',
    promptRomaji: 'Niku ga suki desu ka?',
    promptHiragana: 'にくがすきですか？',
    correctRomaji: 'Hai, niku ga suki desu.',
    correctHiragana: 'はい、にくがすきです。',
    correctEnglish: 'Yes, I like meat.',
    distractors: [
      { romaji: 'Hai, niku ga suki ja nai desu.', hiragana: 'はい、にくがすきじゃないです。', english: 'Conflicting "hai" with negative "suki ja nai desu"' },
      { romaji: 'Iie, niku ga suki desu.', hiragana: 'いいえ、にくがすきです。', english: 'Conflicting "iie" with affirmative "suki desu"' },
    ],
    questionDistractors: [
      { romaji: 'Niku o suki desu ka?', hiragana: 'にくをすきですか？', english: 'Particle error: "o" instead of adjective subject marker "ga"' },
      { romaji: 'Suki desu ka niku ga?', hiragana: 'すきですか にくが？', english: 'Inverted predicate' },
    ],
  },

  // 9. Fish frequency (negative habit with amari)
  {
    id: 'exch-b7-fish-habit',
    category: 'dining-preferences',
    categoryLabel: 'Dietary Habits',
    situationTitle: 'Fish Consumption Frequency',
    englishMeaning: 'Do you often eat fish?',
    promptSpeaker: 'Chef',
    semanticPattern: 'habit-fish',
    subjectEntity: 'friend',
    spriteId: '12',
    promptRomaji: 'Sakana o yoku tabemasu ka?',
    promptHiragana: 'さかなをよくたべますか？',
    correctRomaji: 'Iie, sakana wa amari tabemasen.',
    correctHiragana: 'いいえ、さかなはあまりたべません。',
    correctEnglish: "No, I don't eat fish very often.",
    distractors: [
      { romaji: 'Iie, sakana wa amari tabemasu.', hiragana: 'いいえ、さかなはあまりたべます。', english: 'Grammar error: "amari" paired with affirmative verb' },
      { romaji: 'Hai, sakana wa amari tabemasen.', hiragana: 'はい、さかなはあまりたべません。', english: 'Conflicting "hai" with negative frequency "amari tabemasen"' },
    ],
    questionDistractors: [
      { romaji: 'Sakana ga yoku tabemasu ka?', hiragana: 'さかながよくたべますか？', english: 'Particle error: "ga" instead of object marker "o"' },
      { romaji: 'Yoku tabemasu ka sakana o?', hiragana: 'よくたべますか さかなを？', english: 'Inverted frequency phrase' },
    ],
  },

  // 10. Commenting on delicious food
  {
    id: 'exch-b7-dish-taste',
    category: 'dining-preferences',
    categoryLabel: 'Taste & Opinions',
    situationTitle: 'Evaluating a Dish',
    englishMeaning: 'How is this dish?',
    promptSpeaker: 'Friend at dinner',
    semanticPattern: 'taste-dish-opinion',
    subjectEntity: 'colleague',
    spriteId: '13',
    promptRomaji: 'Kono ryōri wa dō desu ka?',
    promptHiragana: 'このりょうりはどうですか？',
    correctRomaji: 'Kono ryōri wa oishii desu.',
    correctHiragana: 'このりょうりはおいしいです。',
    correctEnglish: 'This food is delicious.',
    distractors: [
      { romaji: 'Kono ryōri o oishii desu.', hiragana: 'このりょうりをおいしいです。', english: 'Particle error: "o" instead of topic marker "wa"' },
      { romaji: 'Oishii desu kono ryōri wa.', hiragana: 'おいしいですこのりょうりは。', english: 'Inverted sentence structure' },
    ],
    questionDistractors: [
      { romaji: 'Kono ryōri o dō desu ka?', hiragana: 'このりょうりをどうですか？', english: 'Particle error: "o" instead of "wa"' },
      { romaji: 'Dō desu ka kono ryōri wa?', hiragana: 'どうですか このりょうりは？', english: 'Inverted interrogative predicate' },
    ],
  },

  // 11. Bank location inquiry
  {
    id: 'exch-b7-bank-location',
    category: 'places-transit',
    categoryLabel: 'Directions & Places',
    situationTitle: 'Asking for the Bank',
    englishMeaning: 'Where is the bank?',
    promptSpeaker: 'Pedestrian',
    semanticPattern: 'location-bank',
    subjectEntity: 'man',
    spriteId: '14',
    promptRomaji: 'Sumimasen, ginkō wa doko desu ka?',
    promptHiragana: 'すみません、ぎんこうはどこですか？',
    correctRomaji: 'Ginkō wa asoko desu.',
    correctHiragana: 'ぎんこうはあそこです。',
    correctEnglish: 'The bank is over there.',
    distractors: [
      { romaji: 'Ginkō o asoko desu.', hiragana: 'ぎんこうをあそこです。', english: 'Particle error: "o" instead of topic marker "wa"' },
      { romaji: 'Asoko wa ginkō desu ka?', hiragana: 'あそこはぎんこうですか？', english: 'Echo question instead of answering location' },
    ],
    questionDistractors: [
      { romaji: 'Sumimasen, ginkō o doko desu ka?', hiragana: 'すみません、ぎんこうをどこですか？', english: 'Particle error: "o" instead of "wa"' },
      { romaji: 'Doko desu ka ginkō wa?', hiragana: 'どこですか ぎんこうは？', english: 'Inverted location inquiry' },
    ],
  },

  // 12. Destination: Going to the station
  {
    id: 'exch-b7-going-station',
    category: 'places-transit',
    categoryLabel: 'Directions & Places',
    situationTitle: 'Destination Inquiry',
    englishMeaning: 'Where are you going?',
    promptSpeaker: 'Acquaintance on the street',
    semanticPattern: 'transit-destination',
    subjectEntity: 'colleague',
    spriteId: '15',
    promptRomaji: 'Doko ni ikimasu ka?',
    promptHiragana: 'どこにいきますか？',
    correctRomaji: 'Eki ni ikimasu.',
    correctHiragana: 'えきにいきます。',
    correctEnglish: 'I am going to the station.',
    distractors: [
      { romaji: 'Eki o ikimasu.', hiragana: 'えきをいきます。', english: 'Particle error: "o" instead of destination marker "ni"' },
      { romaji: 'Ikimasu eki ni.', hiragana: 'いきますえきに。', english: 'Inverted verb and destination' },
    ],
    questionDistractors: [
      { romaji: 'Doko o ikimasu ka?', hiragana: 'どこをいきますか？', english: 'Particle error: "o" instead of destination marker "ni"' },
      { romaji: 'Ikimasu ka doko ni?', hiragana: 'いきますか どこに？', english: 'Inverted question order' },
    ],
  },

  // 13. Going by subway (means of transit: place + de)
  {
    id: 'exch-b7-go-subway',
    category: 'places-transit',
    categoryLabel: 'Transit & Travel',
    situationTitle: 'Method of Transportation',
    englishMeaning: 'Do you go by subway?',
    promptSpeaker: 'Traveler',
    semanticPattern: 'transit-subway',
    subjectEntity: 'friend',
    spriteId: '16',
    promptRomaji: 'Chikatetsu de ikimasu ka?',
    promptHiragana: 'ちかてつでいきますか？',
    correctRomaji: 'Hai, chikatetsu de ikimasu.',
    correctHiragana: 'はい、ちかてつでいきます。',
    correctEnglish: 'Yes, I go by subway.',
    distractors: [
      { romaji: 'Hai, chikatetsu ni ikimasu.', hiragana: 'はい、ちかてつにいきます。', english: 'Particle error: "ni" instead of means of transit "de"' },
      { romaji: 'Iie, chikatetsu de ikimasu.', hiragana: 'いいえ、ちかてつでいきます。', english: 'Conflicting "iie" with affirmative agreement' },
    ],
    questionDistractors: [
      { romaji: 'Chikatetsu o ikimasu ka?', hiragana: 'ちかてつをいきますか？', english: 'Particle error: "o" instead of transit "de"' },
      { romaji: 'Ikimasu ka chikatetsu de?', hiragana: 'いきますか ちかてつで？', english: 'Inverted transit inquiry' },
    ],
  },

  // 14. Watching a movie at the cinema (place + de + action)
  {
    id: 'exch-b7-cinema-movie',
    category: 'places-transit',
    categoryLabel: 'Activities & Places',
    situationTitle: 'Cinema Activities',
    englishMeaning: 'What do you do at the cinema?',
    promptSpeaker: 'Friend',
    semanticPattern: 'activity-cinema',
    subjectEntity: 'friend',
    spriteId: '01',
    promptRomaji: 'Eigakan de nani o shimasu ka?',
    promptHiragana: 'えいがかんでなにをしますか？',
    correctRomaji: 'Eigakan de eiga o mimasu.',
    correctHiragana: 'えいがかんでえいがをみます。',
    correctEnglish: 'I watch a movie at the cinema.',
    distractors: [
      { romaji: 'Eigakan ni eiga o mimasu.', hiragana: 'えいかんにえいがをみます。', english: 'Particle error: "ni" instead of action location "de"' },
      { romaji: 'Eigakan de eiga ni mimasu.', hiragana: 'えいがかんでえいがにみます。', english: 'Particle error: "ni" instead of direct object "o"' },
    ],
    questionDistractors: [
      { romaji: 'Eigakan ni nani o shimasu ka?', hiragana: 'えいかんに なにをしますか？', english: 'Particle error: "ni" instead of action location "de"' },
      { romaji: 'Nani o shimasu ka eigakan de?', hiragana: 'なにをしますか えいがかんで？', english: 'Inverted location clause' },
    ],
  },

  // 15. Hospital location inquiry
  {
    id: 'exch-b7-hospital-location',
    category: 'places-transit',
    categoryLabel: 'Directions & Places',
    situationTitle: 'Asking for the Hospital',
    englishMeaning: 'Where is the hospital?',
    promptSpeaker: 'Visitor',
    semanticPattern: 'location-hospital',
    subjectEntity: 'woman',
    spriteId: '02',
    promptRomaji: 'Sumimasen, byōin wa doko desu ka?',
    promptHiragana: 'すみません、びょういんはどこですか？',
    correctRomaji: 'Byōin wa eki no chikaku desu.',
    correctHiragana: 'びょういんはえきのちかくです。',
    correctEnglish: 'The hospital is near the station.',
    distractors: [
      { romaji: 'Byōin de eki no chikaku desu.', hiragana: 'びょういんでえきのちかくです。', english: 'Particle error: "de" instead of topic marker "wa"' },
      { romaji: 'Eki no chikaku wa byōin desu ka?', hiragana: 'えきのちかくはびょういんですか？', english: 'Echo question instead of answering' },
    ],
    questionDistractors: [
      { romaji: 'Sumimasen, byōin o doko desu ka?', hiragana: 'すみません、びょういんをどこですか？', english: 'Particle error: "o" instead of "wa"' },
      { romaji: 'Doko desu ka byōin wa?', hiragana: 'どこですか びょういんは？', english: 'Inverted inquiry' },
    ],
  },

  // 16. Asking if having time this week
  {
    id: 'exch-b7-time-this-week',
    category: 'time-schedules',
    categoryLabel: 'Time & Availability',
    situationTitle: 'Checking Availability',
    englishMeaning: 'Do you have time this week?',
    promptSpeaker: 'Colleague',
    semanticPattern: 'schedule-availability',
    subjectEntity: 'colleague',
    spriteId: '03',
    promptRomaji: 'Konshū, jikan ga arimasu ka?',
    promptHiragana: 'こんしゅう、じかんがありますか？',
    correctRomaji: 'Hai, jikan ga arimasu.',
    correctHiragana: 'はい、じかんがあります。',
    correctEnglish: 'Yes, I have time.',
    distractors: [
      { romaji: 'Hai, jikan ga arimasen.', hiragana: 'はい、じかんがありません。', english: 'Conflicting "hai" with negative existence "arimasen"' },
      { romaji: 'Iie, jikan ga arimasu.', hiragana: 'いいえ、じかんがあります。', english: 'Conflicting "iie" with affirmative existence "arimasu"' },
    ],
    questionDistractors: [
      { romaji: 'Konshū, jikan o arimasu ka?', hiragana: 'こんしゅう、じかんをありますか？', english: 'Particle error: "o" instead of existence marker "ga"' },
      { romaji: 'Jikan ga arimasu ka konshū?', hiragana: 'じかんがありますか こんしゅう？', english: 'Inverted time context' },
    ],
  },

  // 17. Not having money (negative existence: arimasen)
  {
    id: 'exch-b7-no-money',
    category: 'daily-routine',
    categoryLabel: 'Daily Conversation',
    situationTitle: 'Asking About Money',
    englishMeaning: 'Do you have money?',
    promptSpeaker: 'Friend at shop',
    semanticPattern: 'finance-money',
    subjectEntity: 'friend',
    spriteId: '04',
    promptRomaji: 'Okane ga arimasu ka?',
    promptHiragana: 'おかねがありますか？',
    correctRomaji: 'Iie, okane ga arimasen.',
    correctHiragana: 'いいえ、おかねがありません。',
    correctEnglish: "No, I don't have any money.",
    distractors: [
      { romaji: 'Iie, okane ga arimasu.', hiragana: 'いいえ、おかねがあります。', english: 'Conflicting "iie" with affirmative "arimasu"' },
      { romaji: 'Hai, okane ga arimasen.', hiragana: 'はい、おかねがありません。', english: 'Conflicting "hai" with negative "arimasen"' },
    ],
    questionDistractors: [
      { romaji: 'Okane o arimasu ka?', hiragana: 'おかねをありますか？', english: 'Particle error: "o" instead of "ga" for existence' },
      { romaji: 'Arimasu ka okane ga?', hiragana: 'ありますか おかねが？', english: 'Inverted question order' },
    ],
  },

  // 18. Hospital hours: kara ... made
  {
    id: 'exch-b7-hospital-hours',
    category: 'time-schedules',
    categoryLabel: 'Operating Hours',
    situationTitle: 'Asking Hospital Hours',
    englishMeaning: "What are the hospital's opening hours?",
    promptSpeaker: 'Patient',
    semanticPattern: 'hours-range',
    subjectEntity: 'colleague',
    spriteId: '05',
    promptRomaji: 'Byōin wa nanji kara nanji made desu ka?',
    promptHiragana: 'びょういんはなんじからなんじまでですか？',
    correctRomaji: 'Kuji kara goji made desu.',
    correctHiragana: 'くじからごじまでです。',
    correctEnglish: "It is from 9 o'clock until 5 o'clock.",
    distractors: [
      { romaji: 'Kuji made goji kara desu.', hiragana: 'くじまでごじからです。', english: 'Inverted time range: "until 9 from 5"' },
      { romaji: 'Kuji ni goji ni desu.', hiragana: 'くじにごじにです。', english: 'Missing span particles "kara" and "made"' },
    ],
    questionDistractors: [
      { romaji: 'Byōin o nanji kara nanji made desu ka?', hiragana: 'びょういんをなんじからなんじまでですか？', english: 'Particle error: "o" instead of topic marker "wa"' },
      { romaji: 'Nanji kara nanji made desu ka byōin wa?', hiragana: 'なんじからなんじまでですか びょういんは？', english: 'Inverted topic inquiry' },
    ],
  },

  // 19. Day off day of the week
  {
    id: 'exch-b7-day-off-day',
    category: 'time-schedules',
    categoryLabel: 'Days & Dates',
    situationTitle: 'Asking Which Day Off',
    englishMeaning: 'What day is your day off?',
    promptSpeaker: 'Coworker',
    semanticPattern: 'schedule-day-off-dow',
    subjectEntity: 'colleague',
    spriteId: '06',
    promptRomaji: "Yasumi wa nan'yōbi desu ka?",
    promptHiragana: 'やすみはなんようびですか？',
    correctRomaji: 'Yasumi wa nichiyōbi desu.',
    correctHiragana: 'やすみはにちようびです。',
    correctEnglish: 'My day off is Sunday.',
    distractors: [
      { romaji: 'Yasumi o nichiyōbi desu.', hiragana: 'やすみをにちようびです。', english: 'Particle error: "o" instead of topic marker "wa"' },
      { romaji: 'Nichiyōbi wa yasumi desu ka?', hiragana: 'にちようびはやすみですか？', english: 'Echo question instead of answering' },
    ],
    questionDistractors: [
      { romaji: "Yasumi o nan'yōbi desu ka?", hiragana: 'やすみをなんようびですか？', english: 'Particle error: "o" instead of "wa"' },
      { romaji: "Nan'yōbi desu ka yasumi wa?", hiragana: 'なんようびですか やすみは？', english: 'Inverted predicate' },
    ],
  },

  // 20. Joining someone to go (mo ikimasu)
  {
    id: 'exch-b7-going-too',
    category: 'daily-routine',
    categoryLabel: 'Invitations & Plans',
    situationTitle: 'Going Together to the Cinema',
    englishMeaning: 'I am going to the cinema tomorrow.',
    promptSpeaker: 'Friend planning outing',
    semanticPattern: 'plans-cinema-join',
    subjectEntity: 'friend',
    spriteId: '07',
    promptRomaji: 'Ashita, eigakan ni ikimasu.',
    promptHiragana: 'あした、えいがかんにいきます。',
    correctRomaji: 'Sō desu ka. Jā, watashi mo ikimasu.',
    correctHiragana: 'そうですか。じゃあ、わたしもいきます。',
    correctEnglish: "I see. In that case, I'll go too.",
    distractors: [
      { romaji: 'Sō desu ka. Jā, watashi wa ikimasen deshita.', hiragana: 'そうですか。じゃあ、わたしはいきませんでした。', english: "Tense error: past negative for tomorrow's plan" },
      { romaji: 'Sō desu ka. Jā, watashi mo ikimashita.', hiragana: 'そうですか。じゃあ、わたしもいきました。', english: 'Tense error: past tense "ikimashita" for tomorrow' },
    ],
    questionDistractors: [
      { romaji: 'Ashita, eigakan o ikimasu.', hiragana: 'あした、えいかんをいきます。', english: 'Particle error: "o" instead of destination "ni"' },
      { romaji: 'Eigakan ni ikimasu ashita.', hiragana: 'えいがかんにいきます あした。', english: 'Inverted time word placement' },
    ],
  },
];

export interface ExchangeOption {
  text: string;
  hiraganaAudio: string;
  isCorrect: boolean;
  englishMeaning: string;
}

export interface ExchangeQuizQuestion {
  questionNumber: number;
  item: ExchangeItem;
  direction: 'question-to-reply' | 'reply-to-question';
  directionBadge: string;
  directionInstruction: string;
  prompt: string;
  promptAudio: string;
  promptEnglish: string;
  secondaryPrompt: string;
  categoryLabel: string;
  situationTitle: string;
  options: ExchangeOption[];
  correctOptionIndex: number;
  adaptiveStatus?: 'unseen' | 'needs_practice' | 'proven' | 'review';
  spriteId?: string;
  meaningOptions?: string[];
  correctMeaning?: string;
}

/**
 * Get or dynamically generate plausible decoy question phrases for reverse practice.
 * 100% compliant with user's curriculum vocabulary and particle/grammar structure.
 */
export function getQuestionDistractors(
  item: ExchangeItem
): [{ romaji: string; hiragana: string; english: string }, { romaji: string; hiragana: string; english: string }] {
  if (item.questionDistractors && item.questionDistractors.length === 2) {
    return item.questionDistractors;
  }

  const romaji = item.promptRomaji;
  const hiragana = item.promptHiragana;

  // Decoy 1: Particle substitution using user curriculum rules
  let d1Romaji = romaji;
  let d1Hiragana = hiragana;
  let d1Desc = 'Particle error';

  if (romaji.includes(' wa ') && hiragana.includes('は')) {
    d1Romaji = romaji.replace(' wa ', ' no ');
    d1Hiragana = hiragana.replace('は', 'の');
    d1Desc = 'Particle error: "no" instead of "wa"';
  } else if (romaji.includes(' kara ') && hiragana.includes('から')) {
    d1Romaji = romaji.replace(' kara ', ' ni ');
    d1Hiragana = hiragana.replace('から', 'に');
    d1Desc = 'Particle error: "ni" instead of "kara"';
  } else if (romaji.includes(' de ') && hiragana.includes('で')) {
    d1Romaji = romaji.replace(' de ', ' o ');
    d1Hiragana = hiragana.replace('で', 'を');
    d1Desc = 'Particle error: "o" instead of "de"';
  } else if (romaji.includes(' o ') && hiragana.includes('を')) {
    d1Romaji = romaji.replace(' o ', ' ni ');
    d1Hiragana = hiragana.replace('を', 'に');
    d1Desc = 'Particle error: "ni" instead of "o"';
  } else if (romaji.includes('nan-sai') && hiragana.includes('なんさい')) {
    d1Romaji = romaji.replace('nan-sai', 'nan-sai no');
    d1Hiragana = hiragana.replace('なんさい', 'なんさいの');
    d1Desc = 'Extraneous possessive particle "no"';
  } else {
    d1Romaji = romaji.replace(' desu ka?', ' no desu ka?').replace(' ka?', ' no ka?');
    d1Hiragana = hiragana.replace('ですか？', 'のですか？').replace('か？', 'のか？');
    d1Desc = 'Extraneous particle error';
  }

  // Decoy 2: Inverted word order / syntax structure
  let d2Romaji = romaji;
  let d2Hiragana = hiragana;
  let d2Desc = 'Inverted word order';

  if (romaji.includes(' desu ka?')) {
    const core = romaji.replace(' desu ka?', '').replace('?', '').trim();
    d2Romaji = `Desu ka ${core}?`;
    const hCore = hiragana.replace('ですか？', '').replace('？', '').trim();
    d2Hiragana = `ですか${hCore}？`;
  } else if (romaji.includes(' ka?')) {
    const parts = romaji.replace('?', '').split(' ');
    if (parts.length >= 3) {
      d2Romaji = `${parts.slice(1).join(' ')} ${parts[0]}?`;
      d2Hiragana = `${hiragana.slice(2, -1)}${hiragana.slice(0, 2)}？`;
    } else {
      d2Romaji = `${romaji.replace(' ka?', '')} desu ka?`;
      d2Hiragana = `${hiragana.replace('か？', '')}ですか？`;
    }
  } else {
    d2Romaji = `Desu ka ${romaji.replace('?', '')}?`;
    d2Hiragana = `ですか${hiragana.replace('？', '')}？`;
  }

  return [
    { romaji: d1Romaji, hiragana: d1Hiragana, english: d1Desc },
    { romaji: d2Romaji, hiragana: d2Hiragana, english: d2Desc },
  ];
}
