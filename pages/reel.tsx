import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import Navigation from 'components/Navigation'
import type { Settings } from 'lib/sanity.queries'

export interface ReelPageProps {
  settings: Settings
}

export default function ReelPage({ settings }: ReelPageProps) {
  return (
    <Layout preview={false}>
      <Container>
        <Navigation items={settings?.navigation} settings={settings} />
        <div className="max-w-2xl mx-auto mt-8">
          <h1 className="text-4xl font-bold mb-6">Reel</h1>
          <div className="prose prose-lg">
            <p>Check out my latest work and projects in this video reel.</p>
          </div>
        </div>
      </Container>
    </Layout>
  )
} 