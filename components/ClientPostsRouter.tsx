import type { Settings } from 'lib/sanity.queries'
import { useRouter } from 'next/router'
import { FC, ReactNode, useEffect } from 'react'

interface ClientPostsRouterProps {
  children: ReactNode
  settings: Settings
}

const ClientPostsRouter: FC<ClientPostsRouterProps> = ({ children, settings }) => {
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're on the client side and the blog should be hidden
    if (settings?.showBlog === false) {
      router.replace('/')
    }
  }, [settings?.showBlog, router])

  // Always render children, let the effect handle the redirect
  return <>{children}</>
}

export default ClientPostsRouter 