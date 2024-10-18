import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useSkeletonLoader } from "@/hooks/useSkeletonLoader";
import CustomSkeleton from "@/components/Skeleton";
import useLocalStorageState from "use-local-storage-state";

const ImageCarousel = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });

  const carouselSkeleton = useSkeletonLoader(
    !isMounted,
    <div className="w-full h-auto ">
      <CustomSkeleton
        width="100%"
        height="100%"
        borderRadius="0.5rem"
        theme={theme}
      />
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] mb-6 md:mb-0 flex">
      {!isMounted ? (
        carouselSkeleton
      ) : (
        <Swiper
          modules={[Autoplay, Thumbs]}
          autoplay={{ delay: 3000 }}
          thumbs={{ swiper: thumbsSwiper }}
          className="rounded-lg h-full w-full"
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
    </div>
  );
};

export default ImageCarousel;
