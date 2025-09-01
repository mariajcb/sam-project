import Layout from 'components/BlogLayout'
import Container from 'components/Container'
import IndexPageHead from 'components/IndexPageHead'
import Navigation from 'components/Navigation'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  settings: Settings
  posts?: Post[]
}

export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, settings } = props
  const { title = demo.title } = settings || {}

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading} settings={settings}>
        <Container>
          <header className="mb-10 mt-16 text-pretty">
            <Navigation settings={settings} items={settings.navigation} />
          </header>
        </Container>
      </Layout>
    </>
  )
}