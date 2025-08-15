import { useState, useEffect } from 'react'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const title = settings?.title || 'Sam Di Lorenzo'
  const description = settings?.description || []

  // Filter out blog-related navigation items if showBlog is false
  const filteredItems = settings?.showBlog === false
    ? items.filter(item => !item.link.startsWith('/posts'))
    : items

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [router.pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <div className={styles.navigationContainer}>
        <div className={styles.titleSection}>
          <Link href="/" className={`${styles.titleLink} site-title-link-interactive`}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.description}>
              <PortableText value={description} />
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {filteredItems.map((item) => (
              <li key={item._key} className={styles.navItem}>
                <Link
                  href={item.link}
                  className={`${styles.navLink} nav-link-interactive ${
                    router.pathname === item.link ? `${styles.active} nav-link-active` : ''
                  }`}
                  title={item.description}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger Button */}
        <button 
          className={`${styles.hamburgerButton} mobile-menu-toggle-interactive`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <nav className={styles.mobileNav}>
          <ul className={styles.mobileNavList}>
            {filteredItems.map((item) => (
              <li key={item._key} className={styles.mobileNavItem}>
                <Link
                  href={item.link}
                  className={`${styles.mobileNavLink} nav-link-interactive ${
                    router.pathname === item.link ? `${styles.active} nav-link-active` : ''
                  }`}
                  title={item.description}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
} 