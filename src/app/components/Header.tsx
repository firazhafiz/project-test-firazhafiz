"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isPostActive, setIsPostActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      // Cek apakah PostList sudah masuk viewport
      const postList = document.getElementById("post-list-section");
      if (postList) {
        const rect = postList.getBoundingClientRect();
        // Jika bagian atas PostList sudah masuk viewport
        setIsPostActive(rect.top <= 80 && rect.bottom > 80);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl px-14 py-3 transition-all duration-300 rounded-full ${
        isVisible
          ? "translate-y-0 backdrop-blur-xs bg-white/75"
          : "-translate-y-[80px]"
      }`}
    >
      <nav className="container mx-auto  flex justify-center items-center">
        <div className="flex items-center space-x-10">
          <Image
            src="/suitmedia.png"
            alt="Suitmedia Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
            style={{ height: "auto" }}
          />
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className={`text-gray-800 hover:text-orange-400 transition-colors duration-200 ${
                  pathname === "/" && !isPostActive
                    ? "font-bold text-orange-400  border-orange-400"
                    : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#post-list-section"
                className={`text-gray-800 hover:text-orange-400 transition-colors duration-200 ${
                  isPostActive
                    ? "font-bold text-orange-400 border-orange-400"
                    : ""
                }`}
              >
                Posts
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
