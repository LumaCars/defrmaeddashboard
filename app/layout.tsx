import React from "react"
import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Dashboard Borderless Banking Cards',
  description: 'Borderless Banking Cards - Admin Dashboard',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon.svg?v=3', type: 'image/svg+xml' },
      { url: '/favicon.png?v=3', type: 'image/png' },
    ],
    apple: { url: '/favicon.png?v=3', type: 'image/png' },
    shortcut: '/icon.svg?v=3',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
