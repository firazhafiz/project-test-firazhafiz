"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PostCard from "./PostCard";
import Pagination from "./Pagination";
import { fetchPosts } from "../lib/api";
import { Post, ApiResponse } from "@/types";

const PostList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0,
  });

  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const sort = searchParams.get("sort") || "-published_at";

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data: ApiResponse = await fetchPosts(page, size, sort);
        console.log("Fetched Data:", data);
        setPosts(data.data || []);
        setPagination({
          page: data.meta.current_page || page,
          pageSize: data.meta.per_page || size,
          pageCount: data.meta.last_page || 1,
          total: data.meta.total || 0,
        });
      } catch (e) {
        console.error("Fetch Error:", e);
        setPosts([]);
        setPagination({
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 0,
        });
      }
    };
    loadPosts();
  }, [page, size, sort, router]);

  const handleSortChange = (newSort: string) => {
    router.push(`/?page=1&size=${size}&sort=${newSort}`);
  };

  const handleSizeChange = (newSize: number) => {
    router.push(`/?page=1&size=${newSize}&sort=${sort}`);
  };

  return (
    <div id="post-list-section" className="container mx-auto px-4 py-8">
      <div className="flex justify-between mb-6">
        <div>
          <label className="mr-2 text-slate-600">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-slate-600 bg-white"
          >
            <option value="-published_at">Terbaru</option>
            <option value="published_at">Terlama</option>
          </select>
        </div>
        <div>
          <label className="mr-2 text-slate-600">Show per page:</label>
          <select
            value={size}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="border border-slate-300 rounded px-2 py-1 text-slate-600 bg-white"
          >
            {[10, 20, 50].map((num) => (
              <option key={num} value={num} className="text-slate-600">
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {pagination &&
        typeof pagination.page === "number" &&
        typeof pagination.pageCount === "number" && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pageCount}
          />
        )}
    </div>
  );
};

export default PostList;
