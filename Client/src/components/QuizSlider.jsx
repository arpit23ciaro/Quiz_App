import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FreeMode, Pagination } from 'swiper/modules'
import QuizCard from './QuizCard';

export default function QuizSlider({quizes, setQuizes}) {
  
  return (
    <div className='w-full'>
      <Swiper
        slidesPerView={1}
        spaceBetween={5}
        loop={false}
        modules={[FreeMode, Pagination]}
        breakpoints={{
          648: {
            slidesPerView: 2,
          },
          970: {
            slidesPerView: 3,
          },
          1260: {
            slidesPerView: 4,
          }
        }}
        className=""
      >
      {
        quizes.length==0 ? <div className='text-white text-center text-xl'>No Quiz Availabel</div>
        : quizes.map((quiz,i) =>(
          <SwiperSlide key={i}><QuizCard data={quiz} setQuizes={setQuizes}/></SwiperSlide>
        ))
      }
      </Swiper>
    </div>
  );
}
