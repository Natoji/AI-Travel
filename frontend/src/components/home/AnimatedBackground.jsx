import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1.5 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: 0.15 + Math.random() * 0.35,
    }))

    const clouds = [
      { x: -200, y: 60,  w: 160, h: 50, speed: 0.3,  opacity: 0.55 },
      { x: -500, y: 130, w: 220, h: 65, speed: 0.18, opacity: 0.4  },
      { x: -800, y: 40,  w: 130, h: 40, speed: 0.25, opacity: 0.35 },
      { x: -300, y: 200, w: 180, h: 55, speed: 0.22, opacity: 0.3  },
      { x: -600, y: 90,  w: 100, h: 35, speed: 0.35, opacity: 0.45 },
    ]

    const planes = [
      { x: -80, y: 80,  size: 22, speed: 1.2, opacity: 0.75, delay: 0    },
      { x: -80, y: 160, size: 14, speed: 0.7, opacity: 0.45, delay: 4000 },
      { x: -80, y: 50,  size: 16, speed: 0.9, opacity: 0.55, delay: 9000 },
    ]
    let startTime = null

    const gradients = [
      ['#cfe8fc', '#dbeeff', '#e8f5fe'],
      ['#b8dff9', '#cdeeff', '#daf2fc'],
      ['#d4edfd', '#c5e3f7', '#ddf0fd'],
      ['#bfe6fb', '#d0ecfd', '#e2f6fe'],
    ]
    let gIdx = 0, gProgress = 0

    function lerpColor(a, b, t) {
      const ah = a.replace('#',''), bh = b.replace('#','')
      const ar = parseInt(ah.slice(0,2),16), ag = parseInt(ah.slice(2,4),16), ab_ = parseInt(ah.slice(4,6),16)
      const br = parseInt(bh.slice(0,2),16), bg = parseInt(bh.slice(2,4),16), bb = parseInt(bh.slice(4,6),16)
      const r = Math.round(ar+(br-ar)*t).toString(16).padStart(2,'0')
      const g = Math.round(ag+(bg-ag)*t).toString(16).padStart(2,'0')
      const b2 = Math.round(ab_+(bb-ab_)*t).toString(16).padStart(2,'0')
      return '#'+r+g+b2
    }

    function drawCloud(x, y, w, h, opacity) {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = 'white'
      const circles = [
        { cx: x+w*0.2,  cy: y+h*0.6, r: h*0.45 },
        { cx: x+w*0.45, cy: y+h*0.4, r: h*0.55 },
        { cx: x+w*0.7,  cy: y+h*0.55,r: h*0.42 },
        { cx: x+w*0.85, cy: y+h*0.7, r: h*0.32 },
        { cx: x+w*0.1,  cy: y+h*0.75,r: h*0.28 },
      ]
      ctx.beginPath()
      circles.forEach(c => ctx.arc(c.cx, c.cy, c.r, 0, Math.PI*2))
      ctx.fill()
      ctx.restore()
    }

    function drawPlane(x, y, size, opacity) {
      ctx.save()

      // Vệt khói
      ctx.globalAlpha = opacity * 0.4
      const tailX = x + size * 0.3
      const tailY = y + size * 1.0
      const trailGrad = ctx.createLinearGradient(tailX - size*8, tailY, tailX, tailY)
      trailGrad.addColorStop(0, 'rgba(255,255,255,0)')
      trailGrad.addColorStop(1, 'rgba(255,255,255,0.7)')
      ctx.strokeStyle = trailGrad
      ctx.lineWidth = size * 0.2
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(tailX - size*8, tailY)
      ctx.lineTo(tailX, tailY)
      ctx.stroke()

      // Máy bay
      ctx.globalAlpha = opacity
      ctx.translate(x, y)
      ctx.rotate(Math.PI / 4)
      ctx.font = `${size * 2}px Arial, sans-serif`
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'left'
      ctx.fillStyle = 'black'
      ctx.fillText('\u2708\uFE0F', 0, 0)

      ctx.restore()
    }

    let waveOffset = 0

    function draw(timestamp) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const W = canvas.width, H = canvas.height

      gProgress += 0.0015
      if (gProgress >= 1) { gProgress = 0; gIdx = (gIdx+1) % gradients.length }
      const cur = gradients[gIdx], nxt = gradients[(gIdx+1) % gradients.length]
      const grad = ctx.createLinearGradient(0, 0, W*0.3, H)
      grad.addColorStop(0, lerpColor(cur[0], nxt[0], gProgress))
      grad.addColorStop(0.5, lerpColor(cur[1], nxt[1], gProgress))
      grad.addColorStop(1, lerpColor(cur[2], nxt[2], gProgress))
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      const sunGrad = ctx.createRadialGradient(W*0.85, H*0.08, 0, W*0.85, H*0.08, W*0.5)
      sunGrad.addColorStop(0, 'rgba(255,240,180,0.18)')
      sunGrad.addColorStop(0.5, 'rgba(255,220,100,0.06)')
      sunGrad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = sunGrad
      ctx.fillRect(0, 0, W, H)

      clouds.forEach(c => {
        c.x += c.speed
        if (c.x > W + 300) c.x = -300
        drawCloud(c.x, c.y, c.w, c.h, c.opacity)
      })

      planes.forEach(p => {
        if (elapsed < p.delay) return
        p.x += p.speed
        if (p.x > W + 120) p.x = -120
        drawPlane(p.x, p.y, p.size, p.opacity)
      })

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(56,130,200,' + p.opacity + ')'
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i+1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 90) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = 'rgba(56,130,200,' + (0.08*(1-dist/90)) + ')'
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      waveOffset += 0.010
      const waveConfigs = [
        { amp: 20, freq: 0.007, speed: 1.0, y: H*0.80, color: 'rgba(30,160,220,0.20)'  },
        { amp: 15, freq: 0.010, speed: 1.3, y: H*0.85, color: 'rgba(56,189,248,0.16)'  },
        { amp: 11, freq: 0.014, speed: 0.8, y: H*0.89, color: 'rgba(14,165,233,0.13)'  },
        { amp: 8,  freq: 0.019, speed: 1.7, y: H*0.93, color: 'rgba(99,210,240,0.10)'  },
        { amp: 5,  freq: 0.025, speed: 2.0, y: H*0.96, color: 'rgba(186,230,253,0.08)' },
      ]
      waveConfigs.forEach(w => {
        ctx.beginPath()
        ctx.moveTo(0, H)
        for (let x = 0; x <= W; x += 3) {
          const y = w.y
            + Math.sin(x*w.freq + waveOffset*w.speed) * w.amp
            + Math.sin(x*w.freq*1.6 + waveOffset*w.speed*0.6) * (w.amp*0.4)
          ctx.lineTo(x, y)
        }
        ctx.lineTo(W, H)
        ctx.closePath()
        ctx.fillStyle = w.color
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      zIndex: 0, pointerEvents: 'none',
    }} />
  )
}