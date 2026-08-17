import { useEffect, useRef } from 'react'
import { freshColumnStream, nextStreamChar, randomSymbol } from '../data/matrixCodePool'

export default function MatrixRain({ className = 'matrix-rain', opacity = 0.35 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animId
    let cols = 0
    let drops = []
    let speeds = []
    let streams = []
    const fontSize = 13
    const columnWidth = 15

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.floor(canvas.width / columnWidth)
      drops = Array.from({ length: cols }, () => Math.random() * -50)
      speeds = Array.from({ length: cols }, () => 0.4 + Math.random() * 0.9)
      streams = Array.from({ length: cols }, () => freshColumnStream())
    }

    const resetColumn = (i) => {
      drops[i] = Math.random() * -30
      speeds[i] = 0.4 + Math.random() * 0.9
      streams[i] = freshColumnStream()
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 8, 4, 0.09)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px "JetBrains Mono", Consolas, monospace`
      ctx.textBaseline = 'top'

      for (let i = 0; i < cols; i++) {
        const stream = streams[i]
        let char

        if (stream.symbolsOnly) {
          char = randomSymbol()
        } else {
          char = nextStreamChar(stream.text, stream.index)
          stream.index += 1
        }

        const x = i * columnWidth
        const y = drops[i] * fontSize

        // Brighter head on snippets that look like keywords
        const isKeyword = stream.text && !stream.symbolsOnly && /[a-zA-Z]{3,}/.test(char)
        ctx.fillStyle = isKeyword ? '#5cffb8' : '#00ff88'
        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.965) {
          resetColumn(i)
        }

        drops[i] += speeds[i]
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      style={{ opacity }}
    />
  )
}
