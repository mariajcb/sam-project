import { urlForImage } from 'lib/sanity.image'
import type { Video } from 'lib/sanity.queries'
import Image from 'next/image'
import { useState } from 'react'

interface VideoPlayerProps {
  video: Video
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const { videoUrl, coverImage, title } = video

  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        const videoId = urlObj.searchParams.get('v')
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1`
        }
      } else if (urlObj.hostname === 'youtu.be') {
        const videoId = urlObj.pathname.slice(1)
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1`
        }
      }
      return url
    } catch {
      return url
    }
  }

  if (isPlaying && videoUrl) {
    return (
      <div 
        className="relative aspect-video w-full overflow-hidden rounded-2xl"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <iframe
          src={getEmbedUrl(videoUrl)}
          className="h-full w-full rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`Playing ${title}`}
        />
      </div>
    )
  }

  return (
    <div 
      className="relative aspect-video w-full overflow-hidden rounded-2xl"
      style={{
        backdropFilter: 'blur(12px)',
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      {coverImage && (
        <Image
          src={urlForImage(coverImage).width(1920).height(1080).url()}
          alt={coverImage.alt || title || 'Video cover image'}
          fill
          className="object-cover rounded-2xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          quality={90}
        />
      )}
      <button
        onClick={() => setIsPlaying(true)}
        className="absolute inset-0 z-10 flex items-center justify-center transition-all duration-300 hover:bg-black/30 rounded-2xl general-button-interactive"
        aria-label={`Play video: ${title}`}
      >
        <div 
          className="rounded-full p-6 transition-all duration-300 hover:scale-110"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
          }}
        >
          <svg
            className="w-8 h-8 text-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
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
      </button>
    </div>
  )
} 