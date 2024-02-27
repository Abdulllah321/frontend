import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation, Keyboard, Autoplay } from "swiper/modules";

export default function Sliders() {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  const imageArray = [
    "https://icms-image.slatic.net/images/ims-web/d81b28b5-19ca-4666-9bbb-85ba8a57ee60.png",
    "https://icms-image.slatic.net/images/ims-web/f84f7df3-7eac-4a0b-a67f-87d35c90bd48.jpg",
    "https://icms-image.slatic.net/images/ims-web/d553f0fa-4242-4c35-9648-3c4e1af161f7.jpg",
    "https://icms-image.slatic.net/images/ims-web/d8c4ad77-80d2-446d-ae31-459daf7c8a58.jpg_1200x1200.jpg",
  ];
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        // navigation={true}
        keyboard={{
          enabled: true,
        }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        navigation={true}
        modules={[Keyboard, Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {imageArray.map((img) => (
          <SwiperSlide key={img}>
            <img src={img} alt="slide 1" />
          </SwiperSlide>
        ))}
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </>
  );
}
