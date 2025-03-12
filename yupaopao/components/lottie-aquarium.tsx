"use client"

import { useEffect, useRef } from "react"
import lottie from "lottie-web"

interface LottieAnimationProps {
  animationData: any
  className?: string
}

export default function LottieAquarium({ animationData, className = "w-64 h-64" }: LottieAnimationProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    })

    return () => anim.destroy()
  }, [animationData])

  return <div ref={container} className={className} />
}

