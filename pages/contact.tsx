import Container from 'components/Container'
import Layout from 'components/BlogLayout'
import Navigation from 'components/Navigation'
import ContactForm from 'components/ContactForm'
import TextBox from 'components/TextBox'
import type { Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { client } from 'lib/sanity.client'
import { settingsQuery } from 'lib/sanity.queries'

export interface ContactPageProps {
  settings: Settings
}

export default function ContactPage({ settings }: ContactPageProps) {
  return (
    <Layout preview={false}>
      <Container padding="small">
        <Navigation items={settings?.navigation} settings={settings} />
        <div className="max-w-2xl mx-auto mt-8">
          <TextBox>
            <h1 className="text-4xl font-bold mb-6">Contact</h1>
            <div className="prose prose-lg mb-12">
              <p>Get in touch with me for collaborations, inquiries, or just to say hello!</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-6">Send me a message</h2>
              <ContactForm />
            </div>
          </TextBox>
        </div>
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<ContactPageProps> = async () => {
  const settings = await client.fetch(settingsQuery)

  return {
    props: {
      settings,
    },
    revalidate: 60,
  }
} 