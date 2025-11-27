import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata = {
  title: 'PRISM - Deep Space Academy',
  description: 'Learn anything from First Principles with AI-powered guidance',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="min-h-screen bg-surface overflow-hidden">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
