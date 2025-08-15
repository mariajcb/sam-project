import AlertBanner from 'components/AlertBanner'
import Background from 'components/Background'

export default function BlogLayout({
  preview,
  loading,
  children,
}: {
  preview: boolean
  loading?: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <Background />
      <div className="relative min-h-screen">
        <AlertBanner preview={preview} loading={loading} />
        <main className="relative">{children}</main>
      </div>
    </>
  )
}
