import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import Navigation from 'components/Navigation'
import type { Settings } from 'lib/sanity.queries'
import { getClient } from 'lib/sanity.client'
import { groq } from 'next-sanity'
import AboutPage from 'components/AboutPage'

export interface PageProps {
  settings: Settings
  about: {
    title: string
    mainImage: any
    body: any
  }
}

export default function Page({ settings, about }: PageProps) {
  return (
    <Layout preview={false}>
      <Container>
        <Navigation items={settings?.navigation} settings={settings} />
        <AboutPage settings={settings} about={about} />
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const client = getClient()
  const settings = await client.fetch(groq`*[_type == "settings"][0]`)
  const about = await client.fetch(groq`*[_type == "about"][0]`)

  return {
    props: {
      settings,
      about,
    },
    revalidate: 60,
  }
} 