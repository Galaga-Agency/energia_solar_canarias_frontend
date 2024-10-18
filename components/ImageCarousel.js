import Image from "next/image";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ImageCarousel = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="w-full h-64 mb-6 md:mb-0 md:h-auto">
      <Swiper
        modules={[Autoplay, Thumbs]}
        autoplay={{ delay: 3000 }}
        thumbs={{ swiper: thumbsSwiper }}
        className="rounded-lg h-full"
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
    </div>
  );
};

export default ImageCarousel;
