import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { VoiceModulationDisplay } from '../../src/components/VoiceModulationDisplay'
import type { GeminiAnalysisResult } from '../../src/types/api'
import type { VoiceModulation } from '../../src/types/voice'

describe('VoiceModulationDisplay', () => {
  const mockAnalysis: GeminiAnalysisResult = {
    type: '優しい',
    intensity: 'medium',
    reason: 'テスト用の推論理由です',
  }

  const mockModulation: VoiceModulation = {
    type: '優しい',
    intensity: 'medium',
    pitch: '-2.5%',
    rate: '90%',
    volume: '-0.5dB',
    emphasis: 'moderate',
  }

  const mockSSML =
    '<speak><prosody pitch="-2.5%" rate="90%" volume="-0.5dB">テストメッセージ</prosody></speak>'

  it('should show loading state', () => {
    render(
      <VoiceModulationDisplay analysis={null} modulation={null} ssml={null} isLoading={true} />,
    )

    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('should show empty state when no data', () => {
    render(
      <VoiceModulationDisplay analysis={null} modulation={null} ssml={null} isLoading={false} />,
    )

    expect(screen.getByText('テキストを入力して音声を生成してください')).toBeInTheDocument()
  })

  it('should display analysis results', () => {
    render(
      <VoiceModulationDisplay
        analysis={mockAnalysis}
        modulation={mockModulation}
        ssml={mockSSML}
        isLoading={false}
      />,
    )

    expect(screen.getByText('声の抑揚分析結果')).toBeInTheDocument()
    expect(screen.getByText('優しい')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('テスト用の推論理由です')).toBeInTheDocument()
  })

  it('should display voice parameters', () => {
    render(
      <VoiceModulationDisplay
        analysis={mockAnalysis}
        modulation={mockModulation}
        ssml={mockSSML}
        isLoading={false}
      />,
    )

    expect(screen.getByText('-2.5%')).toBeInTheDocument()
    expect(screen.getByText('90%')).toBeInTheDocument()
    expect(screen.getByText('-0.5dB')).toBeInTheDocument()
  })

  it('should show correct emoji for voice type', () => {
    render(
      <VoiceModulationDisplay
        analysis={mockAnalysis}
        modulation={mockModulation}
        ssml={mockSSML}
        isLoading={false}
      />,
    )

    expect(screen.getByText('😊')).toBeInTheDocument()
  })

  it('should apply correct intensity color classes', () => {
    const { rerender } = render(
      <VoiceModulationDisplay
        analysis={{ ...mockAnalysis, intensity: 'high' }}
        modulation={mockModulation}
        ssml={mockSSML}
        isLoading={false}
      />,
    )

    expect(document.querySelector('.bg-red-100')).toBeInTheDocument()

    rerender(
      <VoiceModulationDisplay
        analysis={{ ...mockAnalysis, intensity: 'low' }}
        modulation={mockModulation}
        ssml={mockSSML}
        isLoading={false}
      />,
    )

    expect(document.querySelector('.bg-green-100')).toBeInTheDocument()
  })
})
