import { FC } from 'react'

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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export default StructuredData 