import Container from 'components/Container'
import Layout from 'components/BlogLayout'
import Navigation from 'components/Navigation'
import HeroPost from 'components/HeroPost'
import MoreStories from 'components/MoreStories'
import ClientPostsRouter from 'components/ClientPostsRouter'
import StructuredData from 'components/StructuredData'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { client } from 'lib/sanity.client'
import { indexQuery, settingsQuery } from 'lib/sanity.queries'
import Head from 'next/head'

interface PostsPageProps {
  posts: Post[]
  settings: Settings
}

export default function PostsPage({ posts, settings }: PostsPageProps) {
  const [heroPost, ...morePosts] = posts || []
  const { title = demo.title } = settings || {}

  return (
    <ClientPostsRouter settings={settings}>
      <Head>
        <title>Blog Posts | {title}</title>
        <meta name="description" content="Browse our collection of blog posts" />
        <meta property="og:title" content={`Blog Posts | ${title}`} />
        <meta property="og:description" content="Browse our collection of blog posts" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <StructuredData
        type="Blog"
        name={`${title} Blog`}
        description="Browse our collection of blog posts"
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/posts`}
      />
      <Layout preview={false}>
        <Container padding="small">
          <header className="mb-8 mt-8 text-pretty">
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
    </ClientPostsRouter>
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