interface VideoPlayerProps {
    videoId: string;
    title?: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
    return (
        <div className="not-prose mb-8 -mx-4 sm:mx-0">
            <div className="relative aspect-video rounded-none sm:rounded-2xl overflow-hidden bg-gray-950 border-y sm:border border-gray-800 shadow-2xl">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&color=white`}
                    title={title ?? 'Vídeo de la lección'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                />
            </div>
        </div>
    );
}
