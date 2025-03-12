"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Twitter, FileSpreadsheet, Users, Maximize2, Minimize2 } from "lucide-react"
import dynamic from "next/dynamic"

const LottieAnimation = dynamic(() => import("./lottie-animation"), { ssr: false })
const LottieAquarium = dynamic(() => import("@/components/lottie-aquarium"), { ssr: false })
const StarTrails = dynamic(() => import("@/components/star-trails"), { ssr: false })

// Custom JSON parser
function parseJSON(str: string) {
  try {
    return JSON.parse(str)
  } catch (e) {
    console.error("Initial JSON parse error:", e)
    console.log("Attempting to fix JSON...")

    str = str.replace(/\\\\/g, "__ESCAPED_BACKSLASH__")
    str = str.replace(/\\"/g, '"')
    str = str.replace(/,\s*([\]}])/g, "$1")
    str = str.replace(/__ESCAPED_BACKSLASH__/g, "\\")

    try {
      const parsed = JSON.parse(str)
      console.log("Successfully parsed JSON after fixes")
      return parsed
    } catch (e) {
      console.error("Failed to parse JSON even after attempting fixes:", e)
      console.log("Problematic JSON (first 200 characters):", str.substring(0, 200))
      throw e
    }
  }
}

export default function Home() {
  const [animationData, setAnimationData] = useState(null)
  const [aquariumAnimationData, setAquariumAnimationData] = useState(null)
  const [showTable, setShowTable] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const iframeContainerRef = useRef<HTMLDivElement>(null)
  const fullscreenContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchJsonData = async (url: string) => {
      const response = await fetch(url)
      const text = await response.text()
      return parseJSON(text)
    }

    const fetchWithRetry = async (url: string, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await fetchJsonData(url)
        } catch (e) {
          console.error(`Attempt ${i + 1} failed for ${url}:`, e)
          if (i === retries - 1) throw e
        }
      }
    }

    fetchWithRetry("/animation.json")
      .then((data) => setAnimationData(data))
      .catch((error) => {
        console.error("加载主动画失败:", error)
      })

    fetchWithRetry(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Animation%20-%201741521505134-qzjmgDY2g08qeC3KhVK44hTldi8vem.json",
    )
      .then((data) => setAquariumAnimationData(data))
      .catch(async (error) => {
        console.error("加载新的动画失败:", error)
        try {
          const fallbackData = await fetchJsonData("/fallback-aquarium.json")
          setAquariumAnimationData(fallbackData)
        } catch (fallbackError) {
          console.error("加载备用动画也失败:", fallbackError)
        }
      })
  }, [])

  useEffect(() => {
    const tableObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowTable(true)
            tableObserver.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: "-50px",
        threshold: 0,
      },
    )

    if (tableRef.current) {
      tableObserver.observe(tableRef.current)
    }

    // 防止 iframe 滚动事件冒泡到外部页面
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation()
    }

    if (iframeContainerRef.current) {
      iframeContainerRef.current.addEventListener("wheel", handleWheel, { passive: false })
    }

    // 监听全屏变化事件
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      if (tableRef.current) {
        tableObserver.unobserve(tableRef.current)
      }
      if (iframeContainerRef.current) {
        iframeContainerRef.current.removeEventListener("wheel", handleWheel)
      }
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    if (!fullscreenContainerRef.current) return

    if (!document.fullscreenElement) {
      // 进入全屏
      fullscreenContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`全屏模式错误: ${err.message}`)
      })
    } else {
      // 退出全屏
      document.exitFullscreen()
    }
  }

  return (
    <div className="relative min-h-screen">
      <StarTrails />

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8 sm:py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {animationData && <LottieAnimation animationData={animationData} className="w-40 h-40 sm:w-64 sm:h-64" />}
              {aquariumAnimationData && (
                <LottieAquarium animationData={aquariumAnimationData} className="w-40 h-40 sm:w-64 sm:h-64" />
              )}
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white text-center mb-2 drop-shadow-lg"
              style={{
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
            >
              鱼泡泡的撸毛之旅
            </h1>
            <p className="text-lg sm:text-xl italic text-orange-400 text-center mb-8 sm:mb-12">
              Yu Paopao's Journey of Airdrop
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mb-8">
              <Link
                href="https://x.com/yupaopao0"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-500/20 backdrop-blur-sm hover:bg-purple-500/30 transition-all rounded-lg p-4 sm:p-6 flex flex-row sm:flex-col items-center justify-center border border-purple-400/30 hover:border-purple-400/50 group"
              >
                <Twitter className="h-8 w-8 sm:h-12 sm:w-12 text-white mb-0 sm:mb-4 mr-4 sm:mr-0 group-hover:scale-110 transition-transform" />
                <span className="text-lg sm:text-xl font-semibold text-white">推特</span>
              </Link>

              <Link
                href="https://docs.google.com/spreadsheets/d/1gnu7hOAF3FxivkPJk3yypyLKGrIoSfHF8vB1nOwyemI/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/30 transition-all rounded-lg p-4 sm:p-6 flex flex-row sm:flex-col items-center justify-center border border-blue-400/30 hover:border-blue-400/50 group"
              >
                <FileSpreadsheet className="h-8 w-8 sm:h-12 sm:w-12 text-white mb-0 sm:mb-4 mr-4 sm:mr-0 group-hover:scale-110 transition-transform" />
                <span className="text-lg sm:text-xl font-semibold text-white">撸毛文档</span>
              </Link>

              <Link
                href="https://raw.githubusercontent.com/gunksd/img/refs/heads/main/yupaopao.png"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500/20 backdrop-blur-sm hover:bg-green-500/30 transition-all rounded-lg p-4 sm:p-6 flex flex-row sm:flex-col items-center justify-center border border-green-400/30 hover:border-green-400/50 group"
              >
                <Users className="h-8 w-8 sm:h-12 sm:w-12 text-white mb-0 sm:mb-4 mr-4 sm:mr-0 group-hover:scale-110 transition-transform" />
                <span className="text-lg sm:text-xl font-semibold text-white">微信群</span>
              </Link>
            </div>

            {/* 标语 - 放在卡片下面 */}
            <p className="text-xl sm:text-2xl font-bold text-center mb-16 sm:mb-24 bg-clip-text text-transparent animate-rainbow-gradient-slow">
              跟着泡泡撸空投，每天10u不用愁
            </p>

            {/* 表格区域 */}
            <div ref={tableRef} className="w-full max-w-5xl min-h-[500px] sm:min-h-[600px]">
              {showTable && (
                <div className="w-full max-w-5xl bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-purple-400/30 animate-fadeIn">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">撸毛记录表</h2>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-colors"
                      aria-label={isFullscreen ? "退出全屏" : "全屏显示"}
                      title={isFullscreen ? "退出全屏" : "全屏显示"}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-5 w-5 text-white" />
                      ) : (
                        <Maximize2 className="h-5 w-5 text-white" />
                      )}
                    </button>
                  </div>
                  <div ref={fullscreenContainerRef} className="relative w-full">
                    <div
                      ref={iframeContainerRef}
                      className="w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden"
                      style={{ isolation: "isolate" }}
                    >
                      <iframe
                        src="https://docs.google.com/spreadsheets/d/1gnu7hOAF3FxivkPJk3yypyLKGrIoSfHF8vB1nOwyemI/edit?gid=0&amp;single=true&amp;widget=true&amp;headers=false"
                        className="w-full h-full border-none"
                        loading="lazy"
                      />
                    </div>
                    {isFullscreen && (
                      <button
                        onClick={toggleFullscreen}
                        className="absolute top-4 right-4 p-2 rounded-full bg-purple-500/50 hover:bg-purple-500/70 transition-colors z-10"
                        aria-label="退出全屏"
                        title="退出全屏"
                      >
                        <Minimize2 className="h-5 w-5 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

