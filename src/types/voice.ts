export type VoiceModulationType =
  | '優しい'
  | '甘え'
  | '元気'
  | '落ち着き'
  | '厳しい'
  | 'ささやき'
  | '励まし'

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
    pitchRange: [-5, 0],
    rateRange: [85, 95],
    volumeRange: [-1, 0],
  },
  甘え: {
    pitchRange: [5, 15],
    rateRange: [90, 100],
    volumeRange: [0, 2],
  },
  元気: {
    pitchRange: [10, 20],
    rateRange: [110, 130],
    volumeRange: [2, 4],
  },
  落ち着き: {
    pitchRange: [-10, -5],
    rateRange: [80, 90],
    volumeRange: [-2, 0],
  },
  厳しい: {
    pitchRange: [-5, 5],
    rateRange: [100, 120],
    volumeRange: [2, 5],
  },
  ささやき: {
    pitchRange: [0, 5],
    rateRange: [70, 85],
    volumeRange: [-6, -3],
  },
  励まし: {
    pitchRange: [5, 10],
    rateRange: [100, 110],
    volumeRange: [1, 3],
  },
}
