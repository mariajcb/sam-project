import Layout from 'components/BlogLayout'
import Container from 'components/Container'
import Navigation from 'components/Navigation'
import TextBox from 'components/TextBox'
import Button from 'components/Button'
import { getClient } from 'lib/sanity.client'
import { urlForImage } from 'lib/sanity.image'
import { settingsQuery } from 'lib/sanity.queries'
import type { Settings } from 'lib/sanity.queries'
import Image from 'next/image'
import Link from 'next/link'
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
    <Layout preview={false} settings={settings}>
      <Container padding="xl">
        <Navigation items={settings?.navigation} settings={settings} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
            <div className="relative w-3/4 md:w-4/5 lg:w-full mx-auto aspect-[4/3] md:aspect-[3/4] rounded-2xl backdrop-blur-[16px] bg-white/25 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-[90%] h-[90%] rounded-xl overflow-hidden">
                  <Image
                    src={urlForImage(home.image).width(600).height(800).url()}
                    alt={home.imageDescription}
                    fill
                    sizes="(max-width: 768px) 75vw, 25vw"
                    priority
                    className="object-cover"
                    quality={90}
                  />
                </div>
              </div>
            </div>
            <TextBox>
              <h1 className="text-4xl font-bold mb-6 text-gray-900">{home.title}</h1>
              <div className="prose prose-lg text-gray-800">
                <p>{home.description}</p>
              </div>
              <div className="mt-6">
                <Link href="/videos/reel2025" tabIndex={-1} className="focus:outline-none">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full"
                  >
                    See My Reel
                  </Button>
                </Link>
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
  const settings = await client.fetch(settingsQuery)
  const home = await client.fetch(groq`*[_type == "home"][0]`)

  return {
    props: {
      settings,
      home,
    },
    revalidate: 60,
  }
} 