import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "鱼泡泡的撸毛之旅",
  description: "鱼泡泡的撸毛记录和社交媒体链接",
  icons: {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GRXSVlIPvqLSrgGwWyWECsDKpjWfUk.png",
    apple: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GRXSVlIPvqLSrgGwWyWECsDKpjWfUk.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'