import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import Navigation from 'components/Navigation'
import type { Settings } from 'lib/sanity.queries'

export interface AboutPageProps {
  settings: Settings
}

export default function AboutPage({ settings }: AboutPageProps) {
  return (
    <Layout preview={false}>
      <Container>
        <Navigation items={settings?.navigation} settings={settings} />
        <div className="max-w-2xl mx-auto mt-8">
          <h1 className="text-4xl font-bold mb-6">About</h1>
          <div className="prose prose-lg">
            <p>Welcome to my about page. This is where you can learn more about me and my work.</p>
          </div>
        </div>
      </Container>
    </Layout>
  )
} 