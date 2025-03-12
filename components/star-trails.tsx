"use client"

import { useEffect, useRef } from "react"

export default function StarTrails() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let showWidth = window.innerWidth
    let showHeight = window.innerHeight

    const resizeCanvas = () => {
      showWidth = window.innerWidth
      showHeight = window.innerHeight
      canvas.width = showWidth
      canvas.height = showHeight
      ctx.fillStyle = "rgba(0,0,0,1)"
      ctx.fillRect(0, 0, showWidth, showHeight)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const longSide = Math.max(showWidth, showHeight)
    const helpCanvas = document.createElement("canvas")
    helpCanvas.width = longSide * 2.6
    helpCanvas.height = longSide * 2.6
    const helpCtx = helpCanvas.getContext("2d")

    if (!helpCtx) return

    const rand = (min: number, max: number) => min + Math.round(Math.random() * (max - min))
    const randomColor = () => {
      const r = rand(120, 255)
      const g = rand(120, 255)
      const b = rand(120, 255)
      const a = rand(30, 100) / 100
      return `rgba(${r},${g},${b},${a})`
    }

    const stars = Array.from({ length: 18000 }, () => ({
      x: rand(-helpCanvas.width, helpCanvas.width),
      y: rand(-helpCanvas.height, helpCanvas.height),
      size: 1.2,
      color: randomColor(),
    }))

    const drawStar = () => {
      stars.forEach((star) => {
        helpCtx.beginPath()
        helpCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2, true)
        helpCtx.fillStyle = star.color
        helpCtx.closePath()
        helpCtx.fill()
      })
    }

    drawStar()

    if (showWidth < showHeight) ctx.translate(showWidth, showHeight)
    else ctx.translate(showWidth, 0)

    let drawTimes = 0

    const loop = () => {
      ctx.drawImage(helpCanvas, -helpCanvas.width / 2, -helpCanvas.height / 2)
      drawTimes++

      if (drawTimes > 200 && drawTimes % 8 === 0) {
        ctx.fillStyle = "rgba(0,0,0,.04)"
        ctx.fillRect(-(longSide * 3), -(longSide * 3), longSide * 6, longSide * 6)
      }

      ctx.rotate((0.025 * Math.PI) / 180)
    }

    const animate = () => {
      requestAnimationFrame(animate)
      loop()
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
}

