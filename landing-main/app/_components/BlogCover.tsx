import type { PostCover } from "../_data/posts";

export function BlogCover({
  cover,
  className = "",
}: {
  cover: PostCover;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-neutral-50 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cover.src}
        alt={cover.alt}
        width={1600}
        height={1000}
        className="size-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#3e0049]/35 via-transparent to-black/10"
      />
    </div>
  );
}
