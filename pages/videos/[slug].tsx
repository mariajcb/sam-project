import Layout from 'components/BlogLayout'
import Container from 'components/Container'
import Navigation from 'components/Navigation'
import TextBox from 'components/TextBox'
import VideoPlayer from 'components/VideoPlayer'
import { client } from 'lib/sanity.client'
import type { Settings, Video } from 'lib/sanity.queries'
import { settingsQuery,videoBySlugQuery, videoSlugsQuery } from 'lib/sanity.queries'
import { GetStaticPaths,GetStaticProps } from 'next'
import { useRouter } from 'next/router'

interface VideoPageProps {
  video: Video
  settings: Settings
}

export default function VideoPage({ video, settings }: VideoPageProps) {
  const router = useRouter()

  if (!router.isFallback && !video?.slug) {
    return <div>Video not found</div>
  }

  return (
    <Layout preview={false} settings={settings}>
      <Container padding="xl">
        <Navigation items={settings?.navigation} settings={settings} />
        <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <VideoPlayer video={video} />
          </div>
          <TextBox>
            <h1 className="text-4xl font-bold mb-6">{video.title}</h1>
            {video.description && (
              <div className="prose prose-lg">
                <p>{video.description}</p>
              </div>
            )}
          </TextBox>
        </div>
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const [video, settings] = await Promise.all([
    client.fetch(videoBySlugQuery, { slug: params?.slug }),
    client.fetch(settingsQuery),
  ])

  return {
    props: {
      video,
      settings,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(videoSlugsQuery)

  return {
    paths: slugs.map((slug: string) => ({ params: { slug } })),
    fallback: 'blocking',
  }
} 