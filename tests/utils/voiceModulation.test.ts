import { describe, expect, it } from 'vitest'
import { calculateVoiceModulation, createVoiceModulation } from '../../src/utils/voiceModulation'

describe('voiceModulation', () => {
  describe('calculateVoiceModulation', () => {
    it('should calculate correct parameters for 優しい voice with low intensity', () => {
      const result = calculateVoiceModulation('優しい', 'low')

      expect(result.pitch).toBe('-3.75%')
      expect(result.rate).toBe('87.5%')
      expect(result.volume).toBe('-0.75dB')
      expect(result.emphasis).toBe('none')
    })

    it('should calculate correct parameters for 元気 voice with high intensity', () => {
      const result = calculateVoiceModulation('元気', 'high')

      expect(result.pitch).toBe('+17.5%')
      expect(result.rate).toBe('125%')
      expect(result.volume).toBe('+3.5dB')
      expect(result.emphasis).toBe('strong')
    })

    it('should calculate correct parameters for ささやき voice with medium intensity', () => {
      const result = calculateVoiceModulation('ささやき', 'medium')

      expect(result.pitch).toBe('+2.5%')
      expect(result.rate).toBe('77.5%')
      expect(result.volume).toBe('-4.5dB')
      expect(result.emphasis).toBe('moderate')
    })
  })

  describe('createVoiceModulation', () => {
    it('should create complete VoiceModulation object', () => {
      const result = createVoiceModulation('励まし', 'high')

      expect(result).toEqual({
        type: '励まし',
        intensity: 'high',
        pitch: '+8.75%',
        rate: '107.5%',
        volume: '+2.5dB',
        emphasis: 'strong',
      })
    })
  })
})
