"use client";

import { useInView } from "react-intersection-observer";
import { Post } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [imgError, setImgError] = useState(false);

  const getImageSrc = (imgArr: { url: string }[] | undefined) => {
    if (Array.isArray(imgArr) && imgArr.length > 0 && imgArr[0]?.url) {
      return imgArr[0].url; // Langsung pakai URL asli
    }
    return "";
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

  const imgSrc = getImageSrc(post.medium_image);

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col w-full max-w-[320px] min-h-60 max-h-72 mx-auto relative"
    >
      {inView ? (
        imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={post.title || "Post Image"}
            width={400}
            height={400}
            className="w-full h-auto object-cover rounded-t-xl"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-40 flex items-center gap-2 bg-slate-100 rounded-t-xl text-slate-400 px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75h.008v.008H9.75V9.75zm0 0A.75.75 0 1111.25 9a.75.75 0 019.75 9.75zm-6 6.75h12a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0015.75 3h-9A2.25 2.25 0 004.5 5.25v12A2.25 2.25 0 006.75 19.5zm0 0l3.75-4.5 2.25 2.75 3-4 3.75 4.75"
              />
            </svg>
            <span className="text-sm text-slate-500 font-medium line-clamp-2">
              {post.title || "Post Image"}
            </span>
          </div>
        )
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
