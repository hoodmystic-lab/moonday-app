import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moonday',
  description: 'Daily Moon • Sign • Decan • Tarot • Comments',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-wide">🌙 Moonday</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
