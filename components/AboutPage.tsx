import { urlForImage } from 'lib/sanity.image'
import type { Settings } from 'lib/sanity.queries'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-8">
        <div className="relative w-full h-full overflow-hidden rounded-lg">
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
        <div className="relative transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="absolute inset-0 border-[8px] border-white rounded-lg z-10"></div>
          <div className="absolute inset-[8px] border-[2px] border-black rounded-lg z-10"></div>
          <div className="bg-white p-8 rounded-lg relative z-0">
            <h1 className="text-4xl font-bold mb-6">{about.title}</h1>
            <div className="prose prose-lg">
              <PortableText value={about.body} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 