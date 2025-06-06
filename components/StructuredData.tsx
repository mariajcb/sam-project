import { FC } from 'react'
import DOMPurify from 'dompurify'

type StructuredDataType = 'Blog' | 'BlogPosting' | 'WebPage' | 'Organization'

interface StructuredDataProps {
  type: StructuredDataType
  name: string
  description: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
  author?: {
    name: string
    url?: string
  }
}

const StructuredData: FC<StructuredDataProps> = ({
  type,
  name,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
    ...(image && { image }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(author && {
      author: {
        '@type': 'Person',
        name: author.name,
        ...(author.url && { url: author.url }),
      },
    }),
  }

  const sanitizedData = DOMPurify.sanitize(JSON.stringify(structuredData))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizedData }}
    />
  )
}

export default StructuredData 