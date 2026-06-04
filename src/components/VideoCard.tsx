import type { Video } from "@/lib/data";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noreferrer"
      className="card rounded-xl overflow-hidden block"
    >
      <div className="aspect-video bg-black relative">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <span className="chip">{video.category}</span>
        <div className="font-semibold mt-2 leading-snug">{video.title}</div>
        <div className="text-sm text-[color:var(--muted)] mt-1">{video.description}</div>
      </div>
    </a>
  );
}
