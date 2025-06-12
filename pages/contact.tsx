import Container from 'components/Container'
import Layout from 'components/BlogLayout'
import Navigation from 'components/Navigation'
import type { Settings } from 'lib/sanity.queries'

export interface ContactPageProps {
  settings: Settings
}

export default function ContactPage({ settings }: ContactPageProps) {
  return (
    <Layout preview={false}>
      <Container>
        <Navigation items={settings?.navigation} settings={settings} />
        <div className="max-w-2xl mx-auto mt-8">
          <h1 className="text-4xl font-bold mb-6">Contact</h1>
          <div className="prose prose-lg">
            <p>Get in touch with me for collaborations, inquiries, or just to say hello!</p>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <ul className="list-none space-y-2">
                <li>Email: your.email@example.com</li>
                <li>Phone: (123) 456-7890</li>
                <li>Location: Your City, Country</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
} 