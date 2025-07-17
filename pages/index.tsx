import Layout from 'components/BlogLayout'
import Container from 'components/Container'
import Navigation from 'components/Navigation'
import TextBox from 'components/TextBox'
import { getClient } from 'lib/sanity.client'
import { urlForImage } from 'lib/sanity.image'
import type { Settings } from 'lib/sanity.queries'
import Image from 'next/image'
import { groq } from 'next-sanity'

interface HomePageProps {
  settings: Settings
  home: {
    title: string
    description: string
    image: any
    imageDescription: string
  }
}

export default function HomePage({ settings, home }: HomePageProps) {
  return (
    <Layout preview={false}>
      <Container padding="small">
        <Navigation items={settings?.navigation} settings={settings} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
            <div className="relative w-3/4 md:w-4/5 lg:w-full mx-auto aspect-[4/3] md:aspect-[3/4] overflow-hidden rounded-lg">
              {/* Frame outer border */}
              <div className="absolute inset-0 border-[14px] border-white/90 rounded-lg shadow-lg"></div>
              {/* Frame inner border */}
              <div className="absolute inset-[8px] border-[2px] border-black/70 rounded-lg"></div>
              {/* Frame mat */}
              <div className="absolute inset-[10px] border-[55px] border-white/90 rounded-lg"></div>
              {/* Image container with slight padding */}
              <div className="absolute inset-[60px]">
                <Image
                  src={urlForImage(home.image).width(600).height(800).url()}
                  alt={home.imageDescription}
                  fill
                  sizes="(max-width: 768px) 75vw, 25vw"
                  priority
                  className="object-cover rounded-sm"
                  quality={90}
                />
              </div>
            </div>
            <TextBox>
              <h1 className="text-4xl font-bold mb-6 text-gray-900">{home.title}</h1>
              <div className="prose prose-lg text-gray-800">
                <p>{home.description}</p>
              </div>
            </TextBox>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const client = getClient()
  const settings = await client.fetch(groq`*[_type == "settings"][0]`)
  const home = await client.fetch(groq`*[_type == "home"][0]`)

  return {
    props: {
      settings,
      home,
    },
    revalidate: 60,
  }
} 