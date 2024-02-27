import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

import { Autoplay, Navigation, Keyboard, Pagination } from "swiper/modules";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

import { useState } from "react";

export default function ProductImages({ product }) {
  const { images } = product;
  const [large, setLarge] = useState("");
  const renderImages = () => {
    if (images.length === 1) {
      return <OneImage product={product} setLarge={setLarge} />;
    } else if (images.length <= 2) {
      return <TwoImages product={product} setLarge={setLarge} />;
    } else if (images.length <= 3) {
      return <ThreeImages product={product} setLarge={setLarge} />;
    } else if (images.length <= 4) {
      return <FourImages product={product} setLarge={setLarge} />;
    } else if (images.length <= 5) {
      return <FiveImages product={product} setLarge={setLarge} />;
    } else if (images.length <= 6) {
      return <SixImages product={product} setLarge={setLarge} />;
    } else if (images.length <= 7) {
      return <SevenImages product={product} setLarge={setLarge} />;
    } else if (images.length <= 8) {
      return <EightImages product={product} setLarge={setLarge} />;
    } else if (images.length <= 9) {
      return <NineImages product={product} setLarge={setLarge} />;
    } else {
      return <BulkImages product={product} setLarge={setLarge} />;
    }
  };
  const smallScreen = () => {
    return <BulkImagesSmall product={product} />;
  };
  return (
    <div className="mt-4">
      {window.innerWidth > 1024 ? renderImages() : smallScreen()}

      {large !== "" && (
        <div className="fixed w-screen h-screen top-0 left-0 z-30">
          <motion.div
            className={`mx-auto mt-6 lg:px-8 overflow-hidden fixed w-screen h-screen -top-[24px] left-0 bg-black/70`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setLarge("")}
          />
          <motion.img
            src={large}
            alt={product.title}
            className={`object-cover object-center transition max-w-[80%] w-auto min-w-[50%] h-auto absolute`}
            initial={{
              scale: 0,
              translateX: "0%",
              translateY: "0%",
              top: "0%",
              left: "0%",
            }}
            animate={{
              scale: 1,
              translateX: "-50%",
              translateY: "-50%",
              top: "50%",
              left: "50%",
            }}
            transition={{ duration: 0.2 }}
          />

          <FaTimes
            className="text-white top-8 right-14 text-3xl absolute cursor-pointer"
            onClick={() => setLarge("")}
          />
        </div>
      )}
    </div>
  );
}

const OneImage = ({ product, setLarge, large }) => {
  return (
    <div
      className={`mx-auto mt-6 lg:px-8 overflow-hidden relative w-full max-w-2xl sm:px-6 lg:grid lg:max-w-7xl`}
    >
      <img
        src={product.images[0]}
        alt={product.title}
        className={`object-cover object-center transition duration-300 
         w-full h-full relative left-0 top-0 hover:scale-105 cursor-pointer`}
        onClick={() => setLarge(product.images[0])}
      />
    </div>
  );
};

const TwoImages = ({ product, setLarge }) => {
  return (
    <>
      <div
        className={`mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-4 lg:px-8 w-full`}
      >
        <div
          className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block cursor-pointer"
          onClick={() => setLarge(product.images[0])}
        >
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover cursor-pointer object-center hover:scale-105 transition duration-300"
          />
        </div>
        <div
          className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg cursor-pointer"
          onClick={() => setLarge(product.images[1])}
        >
          <img
            src={product.images[1]}
            alt={product.title}
            className="h-full w-full object-cover cursor-pointer object-center hover:scale-105 transition duration-300"
          />
        </div>
      </div>
    </>
  );
};

const ThreeImages = ({ product, setLarge }) => {
  return (
    <>
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-4 lg:px-8 w-full">
        <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover cursor-pointer object-center hover:scale-105 transition duration-300"
            onClick={() => setLarge(product.images[0])}
          />
        </div>
        <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <img
              src={product.images[1]}
              alt={product.title}
              className="h-full w-full object-cover cursor-pointer object-center hover:scale-105 transition duration-300"
              onClick={() => setLarge(product.images[1])}
            />
          </div>
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <img
              src={product.images[2]}
              alt={product.title}
              className="h-full w-full object-cover cursor-pointer object-center hover:scale-105 transition duration-300"
              onClick={() => setLarge(product.images[2])}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const FourImages = ({ product, setLarge }) => {
  return (
    <>
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-4 lg:px-8 w-full">
        <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover cursor-pointer object-center hover:scale-105 transition duration-300"
            onClick={() => setLarge(product.images[0])}
          />
        </div>
        <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <img
              src={product.images[1]}
              alt={product.title}
              className="h-full w-full object-cover cursor-pointer object-center hover:scale-105 transition duration-300"
              onClick={() => setLarge(product.images[1])}
            />
          </div>
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <img
              src={product.images[2]}
              alt={product.title}
              className="h-full w-full object-cover cursor-pointer object-center hover:scale-105 transition duration-300"
              onClick={() => setLarge(product.images[2])}
            />
          </div>
        </div>
        <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
          <img
            src={product.images[3]}
            alt={product.title}
            className="h-full w-full object-cover cursor-pointer object-center hover:scale-105 transition duration-300"
            onClick={() => setLarge(product.images[3])}
          />
        </div>
      </div>
    </>
  );
};

const FiveImages = ({ product, setLarge }) => {
  return (
    <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-4 lg:px-8 w-full">
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[0])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[1]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[1])}
          />
        </div>
      </div>

      <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
        <img
          src={product.images[2]}
          alt={product.title}
          className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
          onClick={() => setLarge(product.images[2])}
        />
      </div>
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[3]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[3])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[4]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[4])}
          />
        </div>
      </div>
    </div>
  );
};

const SixImages = ({ product, setLarge }) => {
  return (
    <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-4 lg:px-8 w-full">
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[0])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[1]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[1])}
          />
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[2]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[2])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[3]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[3])}
          />
        </div>
      </div>
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[4]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[4])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[5]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[5])}
          />
        </div>
      </div>
    </div>
  );
};

const SevenImages = ({ product, setLarge }) => {
  return (
    <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-4 lg:px-8 w-full">
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[0])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[1]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[1])}
          />
        </div>
      </div>
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[2]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[2])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[3]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[3])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[4]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[4])}
          />
        </div>
      </div>
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[5]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[5])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[6]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[6])}
          />
        </div>
      </div>
    </div>
  );
};

const EightImages = ({ product, setLarge }) => {
  return (
    <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-4 lg:px-8 w-full">
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[0])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[1]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[1])}
          />
        </div>
      </div>

      <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
        <img
          src={product.images[2]}
          alt={product.title}
          className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
          onClick={() => setLarge(product.images[2])}
        />
      </div>
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[3]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[3])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[4]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[4])}
          />
        </div>
      </div>
      <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg mt-4">
        <img
          src={product.images[5]}
          alt={product.title}
          className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
          onClick={() => setLarge(product.images[5])}
        />
      </div>
      <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg mt-4">
        <img
          src={product.images[6]}
          alt={product.title}
          className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
          onClick={() => setLarge(product.images[6])}
        />
      </div>
      <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg mt-4">
        <img
          src={product.images[7]}
          alt={product.title}
          className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
          onClick={() => setLarge(product.images[7])}
        />
      </div>
    </div>
  );
};

const NineImages = ({ product, setLarge }) => {
  return (
    <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-4 lg:px-8 w-full">
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[0])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[1]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[1])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[2]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[2])}
          />
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[3]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[3])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[4]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[4])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[5]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[5])}
          />
        </div>
      </div>
      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-4">
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[6]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[6])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[7]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[7])}
          />
        </div>
        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img
            src={product.images[8]}
            alt={product.title}
            className="h-full w-full object-cover object-center hover:scale-105 transition duration-300 rounded-lg cursor-pointer"
            onClick={() => setLarge(product.images[8])}
          />
        </div>
      </div>
    </div>
  );
};

function BulkImages({ product, setLarge }) {
  const swiperParams = {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
    },
    keyboard: {
      enabled: true,
    },
    loop: true,
    modules: [Autoplay, Navigation, Keyboard],
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    className: "mySwiper",
  };
  return (
    <div>
      <Swiper {...swiperParams} className="!rounded-lg !overflow-hidden">
        {product.images.map((image, index) => (
          <SwiperSlide key={index} className="!h-[600px] relative">
            <div className="absolute top-0 left-0 text-black bg-white p-2 z-10 mix-blend-difference rounded-br-lg">
              {index + 1} / {product.images.length}
            </div>
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover hover:scale-105 duration-300 transition-all"
              onClick={() => setLarge(image)}
            />
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev !mix-blend-difference"></div>
        <div className="swiper-button-next !mix-blend-difference"></div>
      </Swiper>
    </div>
  );
}

function BulkImagesSmall({ product }) {
  const [fullscreen, setFullscreen] = useState(false);

  const swiperParams = {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
    },
    pagination: {
      clickable: true,
      el: ".swiper-pagination",
    },
    keyboard: {
      enabled: true,
    },
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    modules: [Autoplay, Navigation, Keyboard],
  };
  const swiperParamsLarger = {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
    },
    pagination: {
      clickable: true,
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    keyboard: true,
    loop: false,
    modules: [Autoplay, Navigation, Keyboard, Pagination],
    className: fullscreen ? "mySwiper fullscreen" : "mySwiper",
    thumbs: {
      swiper: {
        el: ".swiper-thumbs",
        slidesPerView: 3, // Adjust the number of thumbnails per view as needed
        spaceBetween: 10,
      },
    },
  };

  return (
    <div className={fullscreen ? "fullscreen-overlay" : ""}>
      <Swiper {...swiperParams} className="bg-black/90">
        {product.images.map((image, index) => (
          <SwiperSlide key={index} className="!h-[500px] relative">
            <div className="absolute top-0 left-0 text-black bg-white p-2 z-10 rounded-br-lg">
              {index + 1} / {product.images.length}
            </div>
            <img
              src={image}
              alt={`Slide ${index}`}
              className="h-full object-cover mx-auto"
              onClick={() => setFullscreen(!fullscreen)}
            />
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev !text-[#4F46E5]"></div>
        <div className="swiper-button-next !text-[#4F46E5]"></div>
        <div className="swiper-pagination"></div>
      </Swiper>

      {fullscreen && (
        <motion.div
        initial={{scale: 0}}
        animate={{scale:1}}
        className="top-0 left-0 bg-black/70 w-screen h-screen fixed z-20"
        >
          <Swiper
            {...swiperParamsLarger}
            className="!absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 w-[95%]"
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index} className="!h-auto relative">
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  className="m-auto h-full object-cover"
                />
              </SwiperSlide>
            ))}{" "}
          </Swiper>

          <FaTimes
            className="text-white top-8 right-8 text-3xl absolute cursor-pointer"
            onClick={() => setFullscreen(false)}
          />
        </motion.div>
      )}
    </div>
  );
}
