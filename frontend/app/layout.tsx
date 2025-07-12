"use client"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Providers } from "@/providers"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "devMatch - Developer Collaboration Platform",
//   description: "Connect with developers and collaborate on exciting projects",
//   openGraph: {
//     type: "website",
//     url: "https://devmatch.example.com",
//     title: "devMatch - Developer Collaboration Platform",
//     description: "Connect with developers and collaborate on exciting projects",
//     images: [
//       {
//         url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
//         width: 1200,
//         height: 630,
//         alt: "devMatch - Developer Collaboration Platform",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     site: "https://devmatch.example.com",
//     title: "devMatch - Developer Collaboration Platform",
//     description: "Connect with developers and collaborate on exciting projects",
//     images: [
//       "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
//     ],
//   },
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <Providers>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryClientProvider>
        </Providers>
      </body>
    </html>
  )
}
