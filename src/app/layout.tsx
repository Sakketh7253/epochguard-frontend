import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EpochGuard - Blockchain Security Detection',
  description: 'A Hybrid ML Model for Detecting Long-Range Attacks in Proof-of-Stake Blockchain Systems',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}