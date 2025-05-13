import type { Video } from 'lib/sanity.queries'
import VideoCard from './VideoCard'

interface VideoGalleryProps {
  videos: Video[]
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video, index) => (
        <VideoCard
          key={video._id}
          video={video}
          priority={index < 3} // Prioritize loading for first 3 videos
        />
      ))}
    </div>
  )
} 