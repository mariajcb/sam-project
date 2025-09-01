import AboutPage from 'components/AboutPage'
import Layout from 'components/BlogLayout'
import Container from 'components/Container'
import Navigation from 'components/Navigation'
import { getClient } from 'lib/sanity.client'
import { settingsQuery } from 'lib/sanity.queries'
import type { Settings } from 'lib/sanity.queries'
import { groq } from 'next-sanity'

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
    <Layout preview={false} settings={settings}>
      <Container padding="xl">
        <Navigation items={settings?.navigation} settings={settings} />
        <AboutPage settings={settings} about={about} />
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const client = getClient()
  const settings = await client.fetch(settingsQuery)
  const about = await client.fetch(groq`*[_type == "about"][0]`)

  return {
    props: {
      settings,
      about,
    },
    revalidate: 60,
  }
} 