import type { Metadata } from 'next'
import './globals.css'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'

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
      <body>
        {children}
        <FloatingWhatsApp
          phone="0555056545"
          message="مرحباً! أحتاج إلى مساعدة في Celebrate Hub"
        />
      </body>
    </html>
  )
}
