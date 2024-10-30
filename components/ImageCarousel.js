"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ImageCarouselSkeleton from "@/components/LoadingSkeletons/ImageCarouselSkeleton";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";

const ImageCarousel = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const theme = useSelector(selectTheme);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isMounted ? (
        <ImageCarouselSkeleton theme={theme} />
      ) : (
        <Swiper
          modules={[Autoplay, Thumbs]}
          autoplay={{ delay: 3000 }}
          thumbs={{ swiper: thumbsSwiper }}
          className="rounded-lg h-full w-full shadow-lg min-h-[400px]"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  priority
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default ImageCarousel;
