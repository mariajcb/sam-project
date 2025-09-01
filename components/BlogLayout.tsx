import AlertBanner from 'components/AlertBanner'
import Background from 'components/Background'
import Footer from 'components/Footer'
import { getClient } from 'lib/sanity.client'
import { settingsQuery } from 'lib/sanity.queries'
import type { Settings } from 'lib/sanity.queries'

export default function BlogLayout({
  preview,
  loading,
  children,
  settings,
}: {
  preview: boolean
  loading?: boolean
  children: React.ReactNode
  settings?: Settings
}) {
  return (
    <>
      <Background />
      <div className="relative min-h-screen flex flex-col">
        <AlertBanner preview={preview} loading={loading} />
        <main className="relative flex-grow pt-6">{children}</main>
        <Footer socialMedia={settings?.socialMedia || []} />
      </div>
    </>
  )
}
