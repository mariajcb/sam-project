import { urlForImage } from 'lib/sanity.image'
import type { Settings } from 'lib/sanity.queries'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import styles from './AboutPage.module.css'

export interface AboutPageProps {
  settings: Settings
  about: {
    title: string
    mainImage: any
    body: any
  }
}

export default function AboutPage({ settings, about }: AboutPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.imageContainer}>
          <Image
            src={urlForImage(about.mainImage).url()}
            alt={about.mainImage.imageDescription}
            width={1200}
            height={1800}
            className="object-cover w-full h-full"
            priority
            quality={90}
          />
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.outerBorder}></div>
          <div className={styles.innerBorder}></div>
          <div className={styles.content}>
            <h1 className={styles.title}>{about.title}</h1>
            <div className={styles.prose}>
              <PortableText value={about.body} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 