import type { Metadata } from 'next'
import { Micro_5 } from 'next/font/google'
import { FadeProvider } from '@/hooks/useFade'
import { ScreenProvider } from '@/hooks/useScreen'
import './globals.css'

const micro = Micro_5({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'Project Z',
  description: 'Bustabit-inspired roguelike.',
  manifest: '/manifest.json',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={micro.className}>
        <ScreenProvider>
            <FadeProvider>
                {children}
            </FadeProvider>
        </ScreenProvider>
      </body>
    </html>
  )
}
