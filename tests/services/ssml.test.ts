import { describe, expect, it } from 'vitest'
import { validateSSML } from '../../src/services/ssml'

describe('ssml', () => {
  describe('validateSSML', () => {
    it('should validate correct SSML', () => {
      const validSSML = `<speak>
  <prosody pitch="+10%" rate="110%" volume="+2dB">
    Hello world
  </prosody>
</speak>`

      expect(validateSSML(validSSML)).toBe(true)
    })

    it('should validate simple SSML', () => {
      const validSSML = '<speak>Hello world</speak>'

      expect(validateSSML(validSSML)).toBe(true)
    })

    it('should reject SSML without speak tag', () => {
      const invalidSSML = '<prosody pitch="+10%">Hello</prosody>'

      expect(validateSSML(invalidSSML)).toBe(false)
    })
  })
})
