"use client";

import { useInView } from "react-intersection-observer";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getImageSrc = (imgArr: any[] | undefined) => {
    if (Array.isArray(imgArr) && imgArr.length > 0 && imgArr[0]?.url) {
      const src = `/api/image-proxy?url=${encodeURIComponent(imgArr[0].url)}`;
      console.log("Image Src:", src);
      return src;
    }
    return "/suitmedia.png";
  };

  const formatTanggal = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col w-full max-w-[320px] h-auto mx-auto relative"
    >
      {inView ? (
        <img
          src={getImageSrc(post.medium_image)}
          alt={post.title || "Post Image"}
          width={400}
          height={400}
          className="w-full h-auto object-cover rounded-t-xl"
          loading="lazy"
          onError={(e) => {
            console.log("Image Load Error:", e);
            (e.target as HTMLImageElement).src = "/suitmedia.png";
            (e.target as HTMLImageElement).onerror = null;
          }}
        />
      ) : (
        <div className="w-full aspect-square bg-slate-100 rounded-t-xl" />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <span className="text-xs text-slate-400 uppercase mb-2 tracking-wide">
          {formatTanggal(post.published_at)}
        </span>
        <h3 className="text-base font-bold text-slate-700 line-clamp-3">
          {post.title}
        </h3>
      </div>
    </div>
  );
};

export default PostCard;
