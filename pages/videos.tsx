import Container from 'components/Container'
import Layout from 'components/BlogLayout'
import Navigation from 'components/Navigation'
import VideoGallery from 'components/VideoGallery'
import type { Settings, Video } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { client } from 'lib/sanity.client'
import { videosQuery, settingsQuery } from 'lib/sanity.queries'

export interface VideosPageProps {
  settings: Settings
  videos: Video[]
}

export default function VideosPage({ settings, videos }: VideosPageProps) {
  return (
    <Layout preview={false}>
      <Container padding="small">
        <Navigation items={settings?.navigation} settings={settings} />
        <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Videos</h1>
          <div className="prose prose-lg mb-8">
            <p>Check out my latest work and projects in this video collection.</p>
          </div>
          <VideoGallery videos={videos} />
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