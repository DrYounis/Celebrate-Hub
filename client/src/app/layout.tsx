import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Celebrate Hub | منصة تنظيم المناسبات',
  description: 'خطط لمناسبتك في حائل بذكاء وسهولة',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Celebrate Hub | منصة تنظيم المناسبات',
    description: 'خطط لمناسبتك في حائل بذكاء وسهولة',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
