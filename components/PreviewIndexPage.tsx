import IndexPage, { type IndexPageProps } from 'components/IndexPage'
import {
  indexQuery,
  type Post,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import { usePresentationQuery } from '@sanity/next-loader/hooks'

export default function PreviewIndexPage(props: IndexPageProps) {
  const { data: postsData } = usePresentationQuery<typeof indexQuery>({
    query: indexQuery,
  })

  const { data: settingsData } = usePresentationQuery<typeof settingsQuery>({
    query: settingsQuery,
  })

  const posts = postsData || props.posts || []
  const settings = settingsData || props.settings

  // Don't render until we have the data
  if (!postsData || !settingsData) {
    return (
      <IndexPage
        preview
        loading={true}
        posts={posts}
        settings={settings}
      />
    )
  }

  return (
    <IndexPage
      preview
      loading={false}
      posts={posts}
      settings={settings}
    />
  )
}
