"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const searchParams = useSearchParams();
  const size = searchParams.get("size") || "10";
  const sort = searchParams.get("sort") || "-published_at";

  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  return (
    <div className="flex justify-center space-x-2 mt-8">
      {/* First */}
      <Link
        href={`/?page=1&size=${size}&sort=${sort}`}
        className={`px-3 py-1 rounded-lg border border-slate-300 text-slate-600 font-semibold transition-colors duration-150 ${
          currentPage === 1
            ? "opacity-50 pointer-events-none"
            : "bg-white hover:bg-slate-100"
        }`}
        aria-label="First"
      >
        «
      </Link>
      <Link
        href={`/?page=${Math.max(
          1,
          currentPage - 1
        )}&size=${size}&sort=${sort}`}
        className={`px-3 py-1 rounded-lg border border-slate-300 text-slate-600 font-semibold transition-colors duration-150 ${
          currentPage === 1
            ? "opacity-50 pointer-events-none"
            : "bg-white hover:bg-slate-100"
        }`}
        aria-label="Previous"
      >
        ‹
      </Link>
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ).map((page) => (
        <Link
          key={page}
          href={`/?page=${page}&size=${size}&sort=${sort}`}
          className={`px-3 py-1 rounded-lg border border-slate-300 text-slate-600 font-semibold transition-colors duration-150 ${
            currentPage === page
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white border-primary shadow-md"
              : "bg-white hover:bg-slate-100"
          }`}
          aria-label={`Page ${page}`}
        >
          {page}
        </Link>
      ))}
      <Link
        href={`/?page=${Math.min(
          totalPages,
          currentPage + 1
        )}&size=${size}&sort=${sort}`}
        className={`px-3 py-1 rounded-lg border border-slate-300 text-slate-600 font-semibold transition-colors duration-150 ${
          currentPage === totalPages
            ? "opacity-50 pointer-events-none"
            : "bg-white hover:bg-slate-100"
        }`}
        aria-label="Next"
      >
        ›
      </Link>
      <Link
        href={`/?page=${totalPages}&size=${size}&sort=${sort}`}
        className={`px-3 py-1 rounded-lg border border-slate-300 text-slate-600 font-semibold transition-colors duration-150 ${
          currentPage === totalPages
            ? "opacity-50 pointer-events-none"
            : "bg-white hover:bg-slate-100"
        }`}
        aria-label="Last"
      >
        »
      </Link>
      <span className="px-3 py-1 text-slate-600 font-semibold">
        of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
