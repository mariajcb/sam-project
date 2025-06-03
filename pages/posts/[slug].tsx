import PostPage from 'components/PostPage'
import PreviewPostPage from 'components/PreviewPostPage'
import { readToken } from 'lib/sanity.api'
import {
  getAllPostsSlugs,
  getClient,
  getPostAndMoreStories,
  getSettings,
} from 'lib/sanity.client'
import { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  post: Post
  morePosts: Post[]
  settings: Settings
}

export default function Page(props: PageProps) {
  const { post, morePosts, settings, draftMode } = props
  const router = useRouter()

  // Redirect to home if blog is hidden
  if (settings?.showBlog === false) {
    router.replace('/')
    return null
  }

  if (draftMode) {
    return <PreviewPostPage {...props} />
  }

  return <PostPage {...props} />
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
