import PostPage, { PostPageProps } from 'components/PostPage'
import {
  type Post,
  postAndMoreStoriesQuery,
  Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import { usePresentationQuery } from '@sanity/next-loader/hooks'

export default function PreviewPostPage(props: PostPageProps) {
  const { data: postData } = usePresentationQuery<typeof postAndMoreStoriesQuery>({
    query: postAndMoreStoriesQuery,
    params: { slug: props.post.slug },
  })

  const { data: settingsData } = usePresentationQuery<typeof settingsQuery>({
    query: settingsQuery,
  })

  const postPreview = postData?.post || props.post
  const morePosts = postData?.morePosts || props.morePosts
  const settings = settingsData || props.settings

  if (!postData || !settingsData) {
    return (
      <PostPage
        preview
        loading={true}
        post={postPreview}
        morePosts={[]}
        settings={settings}
      />
    )
  }

  return (
    <PostPage
      preview
      loading={false}
      post={postPreview}
      morePosts={morePosts}
      settings={settings}
    />
  )
}
