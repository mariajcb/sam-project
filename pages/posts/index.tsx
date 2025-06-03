import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import Navigation from 'components/Navigation'
import HeroPost from 'components/HeroPost'
import MoreStories from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { client } from 'lib/sanity.client'
import { indexQuery, settingsQuery } from 'lib/sanity.queries'
import { useRouter } from 'next/router'

interface PostsPageProps {
  posts: Post[]
  settings: Settings
}

export default function PostsPage({ posts, settings }: PostsPageProps) {
  const router = useRouter()
  const [heroPost, ...morePosts] = posts || []
  const { title = demo.title } = settings || {}

  // Redirect to home if blog is hidden
  if (settings?.showBlog === false) {
    router.replace('/')
    return null
  }

  return (
    <Layout preview={false}>
      <Container>
        <header className="mb-10 mt-16 text-pretty">
          <Navigation settings={settings} items={settings.navigation} />
        </header>
        <h1 className="text-6xl font-bold mb-12">Posts</h1>
        {posts.length > 0 ? (
          <>
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
          </>
        ) : (
          <p className="text-xl text-gray-600">No posts yet.</p>
        )}
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<PostsPageProps> = async () => {
  const [posts, settings] = await Promise.all([
    client.fetch(indexQuery),
    client.fetch(settingsQuery),
  ])

  return {
    props: {
      posts,
      settings,
    },
    revalidate: 60,
  }
} 