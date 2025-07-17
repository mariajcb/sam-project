import type { NavigationItem, Settings } from 'lib/sanity.queries'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PortableText } from 'next-sanity'

import styles from '../styles/components/Navigation.module.css'

interface NavigationProps {
  items?: NavigationItem[]
  settings?: Settings
}

export default function Navigation({ 
  items = [], 
  settings
}: NavigationProps) {
  const router = useRouter()
  const title = settings?.title || 'Sam Di Lorenzo'
  const description = settings?.description || []

  // Filter out blog-related navigation items if showBlog is false
  const filteredItems = settings?.showBlog === false
    ? items.filter(item => !item.link.startsWith('/posts'))
    : items

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.titleSection}>
        <Link href="/" className={styles.titleLink}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.description}>
            <PortableText value={description} />
          </div>
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {filteredItems.map((item) => (
            <li key={item._key} className={styles.navItem}>
              <Link
                href={item.link}
                className={`${styles.navLink} ${
                  router.pathname === item.link ? styles.active : ''
                }`}
                title={item.description}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
} 