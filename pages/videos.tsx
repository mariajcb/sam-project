import Layout from 'components/BlogLayout'
import Container from 'components/Container'
import Navigation from 'components/Navigation'
import TextBox from 'components/TextBox'
import VideoGallery from 'components/VideoGallery'
import { client } from 'lib/sanity.client'
import type { Settings, Video } from 'lib/sanity.queries'
import { settingsQuery,videosQuery } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'

export interface VideosPageProps {
  settings: Settings
  videos: Video[]
}

export default function VideosPage({ settings, videos }: VideosPageProps) {
  return (
    <Layout preview={false} settings={settings}>
      <Container padding="xl">
        <Navigation items={settings?.navigation} settings={settings} />
        <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          <TextBox>
            <h1 className="text-4xl font-bold mb-6">Videos</h1>
            <div className="prose prose-lg mb-8">
              <p>Check out my latest work and projects in this video collection.</p>
            </div>
            <VideoGallery videos={videos} />
          </TextBox>
        </div>
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [videos, settings] = await Promise.all([
    client.fetch(videosQuery),
    client.fetch(settingsQuery),
  ])

  return {
    props: {
      videos,
      settings,
    },
    revalidate: 60,
  }
} 