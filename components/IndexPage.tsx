import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import Navigation from 'components/Navigation'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import MoreStories from 'components/MoreStories'
import IntroTemplate from 'intro-template'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import { Suspense } from 'react'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  settings: Settings
}

export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, posts, settings } = props
  const [heroPost, ...morePosts] = posts || []
  const { title = demo.title } = settings || {}

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          <header className="mb-10 mt-16 text-pretty">
            <Navigation settings={settings} items={settings.navigation} />
          </header>
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
        <Suspense>
          <IntroTemplate />
        </Suspense>
      </Layout>
    </>
  )
}
