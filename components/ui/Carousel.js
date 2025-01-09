import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Carousel = ({ items, renderItem, config = {} }) => {
  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={16}
      slidesPerView={1}
      pagination={{ clickable: true }}
      {...config}
      className="w-full max-h-[300px]"
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>{renderItem(item)}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
