import type { Metadata } from 'next'
import styles from './staff.module.css'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Gunpla POS | Staff',
  description: 'Point of Sale Staff Interface',
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <div className={styles.layout}>
          {children}
        </div>
      </body>
    </html>
  )
}
