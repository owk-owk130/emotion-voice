/**
 * ElevenLabsの利用可能な音声定義
 * 日本語対応の音声を中心に選定
 */

export interface VoiceOption {
  id: string
  name: string
  gender: 'male' | 'female' | 'neutral'
  language: string[]
  description: string
  preview?: string
}

export const AVAILABLE_VOICES: VoiceOption[] = [
  // {
  //   id: "Mv8AjrYZCBkdsmDHNwcB",
  //   name: "Ishibashi",
  //   gender: "male",
  //   language: ["ja-JP"],
  //   description: "Strong Japanese Male Voice"
  // },
  {
    id: 'GKDaBI8TKSBJVhsCLD6n',
    name: 'Asahi',
    gender: 'male',
    language: ['ja-JP'],
    description: 'Japanese male',
  },
  {
    id: 'j210dv0vWm7fCknyQpbA',
    name: 'Hinata',
    gender: 'male',
    language: ['ja-JP'],
    description: 'Young Japanese male calm voice. Suitable for narration, news, and audiobooks.',
  },
  // {
  //   id: "LIisRj2veIKEBdr6KZ5y",
  //   name: "Hadou",
  //   gender: "male",
  //   language: ["ja-JP"],
  //   description:
  //     "A young Japanese man with a soft voice. Audiobooks, documentaries, podcasts, YouTube videos, multilingual, and more."
  // },
  // {
  //   id: "ayBYi7YT78AKVGpJh7MT",
  //   name: "Kuro",
  //   gender: "male",
  //   language: ["ja-JP"],
  //   description:
  //     "Japanese, male in his 20s or 30s, calm tone suitable for narration."
  // },
  // {
  //   id: "b34JylakFZPlGS0BnwyY",
  //   name: "Kenzo",
  //   gender: "male",
  //   language: ["ja-JP"],
  //   description:
  //     "Calm, professional male Japanese voice. Perfect for corporate videos and E-Learning projects. "
  // },
  {
    id: 'bqpOyYNUu11tjjvRUbKn',
    name: 'Yamato',
    gender: 'male',
    language: ['ja-JP'],
    description:
      'A Japanese male voice. 20s - 30s. Perfect for Youtube, audiobooks, and any type of content',
  },
  // {
  //   id: "5enpi03fjGAwd9rnMfVT",
  //   name: "Noguchi",
  //   gender: "male",
  //   language: ["ja-JP"],
  //   description:
  //     "Calm voice of a young Japanese male. Perfect for audiobooks and YouTube videos."
  // }
]

// デフォルトの音声ID Asahi
export const DEFAULT_VOICE_ID = 'GKDaBI8TKSBJVhsCLD6n'
