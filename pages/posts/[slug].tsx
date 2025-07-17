import ClientPostsRouter from 'components/ClientPostsRouter'
import PostPage from 'components/PostPage'
import PreviewPostPage from 'components/PreviewPostPage'
import StructuredData from 'components/StructuredData'
import { readToken } from 'lib/sanity.api'
import {
  getAllPostsSlugs,
  getClient,
  getPostAndMoreStories,
  getSettings,
} from 'lib/sanity.client'
import { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  post: Post
  morePosts: Post[]
  settings: Settings
}

export default function Page(props: PageProps) {
  const { post, morePosts, settings, draftMode } = props

  if (draftMode) {
    return <PreviewPostPage {...props} />
  }

  return (
    <ClientPostsRouter settings={settings}>
      <Head>
        <title>{post.title} | {settings.title}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | ${settings.title}`} />
        <meta property="og:description" content={post.excerpt} />
        {post.coverImage && (
          <meta property="og:image" content={post.coverImage.url} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <StructuredData
        type="BlogPosting"
        name={post.title}
        description={post.excerpt}
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`}
        image={post.coverImage?.url}
        datePublished={post.date}
        dateModified={post._updatedAt}
        author={post.author ? {
          name: post.author.name
        } : undefined}
      />
      <PostPage {...props} />
    </ClientPostsRouter>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const { draftMode = false, params = {} } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, postData] = await Promise.all([
    getSettings(client),
    getPostAndMoreStories(client, params.slug as string),
  ])

  if (!postData?.post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post: postData.post,
      morePosts: postData.morePosts,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}

export const getStaticPaths = async () => {
  const slugs = await getAllPostsSlugs()
  return {
    paths: slugs?.map(({ slug }) => `/posts/${slug}`) || [],
    fallback: 'blocking',
  }
}
