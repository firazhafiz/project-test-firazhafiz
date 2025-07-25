"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import axios from "axios";

const Banner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get("/api/banner");
        console.log("Banner API response:", response.data);
        setBannerImageUrl(response.data.url + "?ts=" + Date.now());
      } catch (error) {
        console.error("Failed to fetch banner:", error);
        setBannerImageUrl("/banner.jpg?ts=" + Date.now());
      }
    };

    fetchBanner();

    const onBannerUpdated = () => {
      console.log("Banner updated event triggered");
      fetchBanner();
    };
    window.addEventListener("banner-updated", onBannerUpdated);

    return () => {
      window.removeEventListener("banner-updated", onBannerUpdated);
    };
  }, []);

  return (
    <div ref={ref} className="relative h-[500px] overflow-hidden">
      {bannerImageUrl && (
        <motion.div className="absolute inset-0" style={{ y: yImage }}>
          <Image
            src={bannerImageUrl}
            alt="Banner Image"
            fill
            className="object-cover"
            priority
            onLoad={() => {
              window.dispatchEvent(new Event("banner-updated-done"));
            }}
          />
        </motion.div>
      )}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: yText }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">Ideas</h1>
          <p className="mt-2 text-lg">Where all our great things begin</p>
        </div>
      </motion.div>
      <div
        className="absolute bg-gray-100 left-0 bottom-0 w-full h-32 pointer-events-none"
        style={{
          clipPath: "polygon(0 70%, 100% 0, 100% 100%, 0% 100%)",
        }}
      />
    </div>
  );
};

export default Banner;
