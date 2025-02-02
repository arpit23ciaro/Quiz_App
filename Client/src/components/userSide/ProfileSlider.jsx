import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import mountain from '../../assets/freepik__the-style-is-candid-image-photography-with-natural__37993.jpg'
import forest from '../../assets/freepik__the-style-is-candid-image-photography-with-natural__46686.jpg'
import sun from '../../assets/freepik__the-style-is-candid-image-photography-with-natural__46687.jpg'
import water from '../../assets/freepik__the-style-is-candid-image-photography-with-natural__46693.jpg'
import fire from '../../assets/freepik__the-style-is-candid-image-photography-with-natural__46694.jpg'
import '../../index.css'

import { Navigation } from 'swiper/modules';
import ProfileLogos from './ProfileLogos';

export default function ProfileSlider({setImageUrl}) {
    useEffect(()=>{
        setImageUrl(fire);
    },[])
    return (
        <>
            <Swiper navigation={true} slidesPerView={3} breakpoints={{
                1024: {
                    slidesPerView: 4,
                },
            }} spaceBetween={4} modules={[Navigation]} className="w-[500px]" >
                <SwiperSlide><div className=' text-center' onClick={()=>setImageUrl(mountain) }><ProfileLogos url={mountain} /></div></SwiperSlide>
                <SwiperSlide><div className=' text-center' onClick={()=>setImageUrl(forest) }><ProfileLogos url={forest} /></div></SwiperSlide>
                <SwiperSlide><div className=' text-center' onClick={()=>setImageUrl(fire) }><ProfileLogos url={fire} /></div></SwiperSlide>
                <SwiperSlide><div className=' text-center' onClick={()=>setImageUrl(water) }><ProfileLogos url={water} /></div></SwiperSlide>
                <SwiperSlide><div className=' text-center' onClick={()=>setImageUrl(sun) }><ProfileLogos url={sun} /></div></SwiperSlide>
            </Swiper>
        </>
    );
}