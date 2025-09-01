import { useState, useEffect } from 'react'
import { 
  Linkedin, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Github,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import type { SocialMedia } from 'lib/sanity.queries'
import styles from '../styles/components/Footer.module.css'

interface FooterProps {
  socialMedia?: SocialMedia[]
}

// Icon mapping for social media platforms
const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return Linkedin
    case 'instagram':
      return Instagram
    case 'twitter':
      return Twitter
    case 'facebook':
      return Facebook
    case 'youtube':
      return Youtube
    case 'github':
      return Github
    case 'email':
      return Mail
    case 'phone':
      return Phone
    case 'location':
      return MapPin
    default:
      return Linkedin // fallback
  }
}

export default function Footer({ socialMedia = [] }: FooterProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Update year on mount and when year changes
  useEffect(() => {
    const updateYear = () => {
      setCurrentYear(new Date().getFullYear())
    }
    
    // Update immediately
    updateYear()
    
    // Set up interval to check for year changes (e.g., around midnight on New Year's)
    const interval = setInterval(updateYear, 1000 * 60 * 60) // Check every hour
    
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className={styles.footerContainer} role="contentinfo">
      <div className={styles.footerContent}>
        {/* Social Media Section */}
        <div className={styles.socialSection}>
          <h2 className={styles.visuallyHidden}>Social Media</h2>
          <ul className={styles.socialLinks} role="list">
            {socialMedia.map((social) => {
              const IconComponent = getSocialIcon(social.platform)
              const ariaLabel = social.description || `Follow us on ${social.platform}`
              
              return (
                <li key={social.platform} className={styles.socialItem}>
                  <a
                    href={social.url}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ariaLabel}
                    title={ariaLabel}
                  >
                    <IconComponent 
                      size={24} 
                      className={styles.socialIcon} 
                      aria-hidden="true"
                    />
                    <span className={styles.visuallyHidden}>{social.platform}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Copyright & Credits Section */}
        <div className={styles.copyrightSection}>
          <p className={styles.copyright}>
            © {currentYear} Sam DiLorenzo. All rights reserved.
          </p>
          <p className={styles.credits}>
            Built by{' '}
            <a
              href="https://github.com/mariajcb"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
              aria-label="View mariajcb's GitHub profile"
            >
              mariajcb
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
