import { urlForImage } from 'lib/sanity.image'
import type { Video } from 'lib/sanity.queries'
import Image from 'next/image'
import Link from 'next/link'

interface VideoCardProps {
  video: Video
  priority?: boolean
}

export default function VideoCard({ video, priority }: VideoCardProps) {
  const { title, coverImage, slug, description } = video

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
      <Link href={`/videos/${slug}`} className="block">
        <div className="relative aspect-video bg-gray-100">
          {coverImage && (
            <Image
              src={urlForImage(coverImage).width(1920).height(1080).url()}
              alt={coverImage.alt || title || 'Video cover image'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              quality={90}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center transition-colors group-hover:bg-black/30">
            <div className="rounded-full bg-white p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <svg
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
      </Link>
    </div>
  )
} 