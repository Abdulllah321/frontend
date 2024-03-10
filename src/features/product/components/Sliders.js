import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation, Keyboard, Autoplay } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { fetchSlidesAsync, selectSlides } from "../productSlice";

export default function Sliders() {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const dispatch = useDispatch();
  const slidesArray = useSelector(selectSlides);

  useEffect(() => {
    dispatch(fetchSlidesAsync());
  }, [dispatch]);

  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

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
        {slidesArray.map((img) => (
          <SwiperSlide key={img}>
            <img src={img.image} alt="slide 1" />
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
