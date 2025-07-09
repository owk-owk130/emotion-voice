import { VOICE_MODULATION_PARAMS, type VoiceIntensity, type VoiceModulation } from '../types/voice'

function interpolateValue(range: [number, number], intensity: VoiceIntensity): number {
  const [min, max] = range
  const factor = intensity === 'low' ? 0.25 : intensity === 'medium' ? 0.5 : 0.75
  return min + (max - min) * factor
}

export function calculateVoiceModulation(
  type: VoiceModulation['type'],
  intensity: VoiceIntensity,
): Omit<VoiceModulation, 'type' | 'intensity'> {
  const params = VOICE_MODULATION_PARAMS[type]

  const pitch = interpolateValue(params.pitchRange, intensity)
  const rate = interpolateValue(params.rateRange, intensity)
  const volume = interpolateValue(params.volumeRange, intensity)

  return {
    pitch: `${pitch > 0 ? '+' : ''}${pitch}%`,
    rate: `${rate}%`,
    volume: `${volume > 0 ? '+' : ''}${volume}dB`,
    emphasis: intensity === 'high' ? 'strong' : intensity === 'medium' ? 'moderate' : 'none',
  }
}

export function createVoiceModulation(
  type: VoiceModulation['type'],
  intensity: VoiceIntensity,
): VoiceModulation {
  return {
    type,
    intensity,
    ...calculateVoiceModulation(type, intensity),
  }
}
