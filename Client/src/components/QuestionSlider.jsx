import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FreeMode, Pagination } from 'swiper/modules'
import { MdOutlineAddBox } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom'

const QuestionSlider = ({questions,currentQuestionIndex,setCurrentQuestionIndex,setQuestions,initialValue}) => {
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState();
    

    function addSlide(){
        setQuestions((prev) =>[...prev,initialValue])
        setCurrentQuestionIndex(questions.length);
    }
    
    return (
        <>
            <div className='w-full h-[60px] fixed bottom-0 z-100 bg-[#003433] pl-2'>
                <div className='relative pr-14'>
                {questions?.length ? (
                    <Swiper
                        slidesPerView={2}
                        spaceBetween={5}
                        loop={false}
                        modules={[FreeMode, Pagination]}
                        breakpoints={{
                            1024: {
                                slidesPerView: 9,
                            },
                        }}
                        className="max-h-[30rem]"
                    >
                        {questions?.map((que, i) => (
                            <SwiperSlide key={i} className=' mt-3 cursor-pointer' onClick={()=>setCurrentQuestionIndex(i)}>
                                <div 
                                 
                                className={`bg-white aspect-square border-2 ${currentQuestionIndex != i ?"border-white": "border-blue-400"} text-black rounded-md h-10 text-center w-full`}>{`Slide ${i+1}`}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="text-xl text-richblack-5">No question Found! Please Add Question</p>
                )}
                <MdOutlineAddBox size={30} className=' absolute right-2 top-5 cursor-pointer' onClick={addSlide}/>
                </div>
            </div>
            <div className='h-[60px] w-full bg-[#00837E]'></div>
        </>
    )
}

export default QuestionSlider