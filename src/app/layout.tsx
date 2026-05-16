import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gunpla STORE',
  description: 'The #1 Gunpla Store. Streamline your hobby store operations, track pre-orders, and manage stock easily.',
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
