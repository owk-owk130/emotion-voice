export type VoiceModulationType =
  | '優しい'
  | '甘え'
  | '元気'
  | '落ち着き'
  | '厳しい'
  | 'ささやき'
  | '励まし'
  | 'イケメン'

export type VoiceIntensity = 'low' | 'medium' | 'high'

export interface VoiceModulation {
  type: VoiceModulationType
  intensity: VoiceIntensity
  pitch: string
  rate: string
  volume: string
  emphasis: 'none' | 'moderate' | 'strong'
}

export interface VoiceModulationParams {
  pitchRange: [number, number]
  rateRange: [number, number]
  volumeRange: [number, number]
}

export const VOICE_MODULATION_PARAMS: Record<VoiceModulationType, VoiceModulationParams> = {
  優しい: {
    pitchRange: [-8, -3], // より低めの声で優しさを表現
    rateRange: [160, 180], // 20%減速：200→160, 225→180
    volumeRange: [-2, -0.5], // 控えめな音量
  },
  甘え: {
    pitchRange: [5, 15],
    rateRange: [144, 160], // 20%減速：180→144, 200→160
    volumeRange: [0, 2],
  },
  元気: {
    pitchRange: [10, 20],
    rateRange: [176, 200], // 20%減速：220→176, 250→200
    volumeRange: [2, 4],
  },
  落ち着き: {
    pitchRange: [-10, -5],
    rateRange: [132, 148], // 20%減速：165→132, 185→148
    volumeRange: [-2, 0],
  },
  厳しい: {
    pitchRange: [-5, 5],
    rateRange: [156, 180], // 20%減速：195→156, 225→180
    volumeRange: [2, 5],
  },
  ささやき: {
    pitchRange: [0, 5],
    rateRange: [120, 136], // 20%減速：150→120, 170→136
    volumeRange: [-6, -3],
  },
  励まし: {
    pitchRange: [5, 10],
    rateRange: [156, 176], // 20%減速：195→156, 220→176
    volumeRange: [1, 3],
  },
  イケメン: {
    pitchRange: [-18, -12], // より低くてセクシーな声
    rateRange: [180, 204], // 20%減速：225→180, 255→204
    volumeRange: [-1.5, -0.5], // 控えめだけど存在感のある音量
  },
}
