import React, { useEffect, useState } from 'react'
import InputImageBox from '../components/createQuiz/InputImageBox'
import { MdAddToPhotos } from "react-icons/md";
import { BiSolidTrashAlt } from "react-icons/bi";
import { useParams } from 'react-router-dom';
import questionsData from '../services/questionsData';
import { MdEdit } from "react-icons/md";
import { RiUpload2Fill } from "react-icons/ri";
import { useUserAuth } from '../context/userAuthContextProvider';
import * as Yup from "yup";
import { ErrorMessage, Form, Formik } from 'formik';

const QuestionArea = ({ question, title, setTitle, handleSubmit,setQuestions ,submitTitle}) => {
    const [titleToggle, setTitleToggle] = useState(true);

    const [initialValues, setInitialValues] = useState({
        id:"dummy",
        question: "",
        questionImg: null,
        options: [
            {
                id:"dummy1",
                text: "",
                isSelect: false,
                optionImg: null
            },
            {
                id:"dummy2",
                text: "",
                isSelect: false,
                optionImg: null
            }
        ],
        selectedType: "Single choice",
        questionTime: "20s",
    });

    useEffect(() => {
        if (question) {
            setInitialValues({
                id:question._id || question.id || "dummy",
                question: question.question || "",
                questionImg: question.questionImg || null,
                options: question.options || [{id:"dummy1", text: "", isSelect: false, optionImg: null }, {id:"dummy2", text: "", isSelect: false, optionImg: null }],
                selectedType: question.questionType || "Single choice",
                questionTime: question.duration || "20s",
            });
        }

    }, [question]);


    const validationSchema = Yup.object().shape({
        id:Yup.string(),
        question: Yup.string().required("Question is required"),
        questionImg: Yup.mixed().nullable(),
        options: Yup.array()
            .of(
                Yup.object().shape({
                    id:Yup.string(),
                    text: Yup.string().required("Option text is required."),
                    optionImg: Yup.mixed().nullable(),
                    isSelect: Yup.boolean(),
                })
            )
            .test(
                "at-least-one-selected",
                "At least one option must be selected.",
                (options) => options.some((option) => option.isSelect)
            )
            .test(
                "at-least-two-options",
                "At least two options are required.",
                (options) => options.length >= 2
            )
            .test(
                "only-one-selected-if-radio",
                "Only one option can be selected when 'radio' type is chosen.",
                function (options) {
                    const { selectedType } = this.parent;
                    if (selectedType === "radio") {
                        const selectedCount = options.filter((option) => option.isSelect).length;
                        return selectedCount <= 1;
                    }
                    return true; 
                }
            ),
        selectedType: Yup.string().required("Type is required"),
        questionTime: Yup.string().required("Time is required"),
    });


    function handelDelete(id){
        if(id.substring(0,id.length-1)=="dummy"){
            setQuestions((prev)=>prev.filter((ques)=>ques.id.substring(5)!=id.substring(5)))
            console.log("deleted successfully") 
        }
        else 
            console.log("ok")
    }


    return (
        <>
            <div className='h-[63px] text-white fixed top-5 text-center w-full z-101 font-bold'>
                <div className='flex justify-center items-center'>
                    <MdEdit size={25} className=' cursor-pointer rotate-[290deg]' onClick={() => setTitleToggle((prev) => !prev)} />
                    <input
                        className=' text-xl bg-inherit focus:outline-none w-40'
                        value={title}
                        disabled={titleToggle}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={submitTitle}
                    />
                </div>
            </div>
            <div className='h-[63px]'></div>

            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, handleChange, errors }) => (
                    <Form>
                        <div className='flex flex-col bg-[#00837E] items-center  mt-[2rem]  z-10 gap-2'>
                            <div className='bg-white rounded-md w-[70%] md:w-[527.57px] p-2 flex flex-col gap-2'>
                                <p className=' font-semibold text-md'>Question:</p>
                                <InputImageBox name='question' text={values.question} isQuestion={true} image={values.questionImg} setFieldValue={setFieldValue} handleChange={handleChange} values={values} />
                                <div className='flex flex-row items-center gap-2'>
                                    <p className=' font-semibold text-md'>Answers:</p>
                                    {values.selectedType != "True/False" && <MdAddToPhotos size={20} onClick={() => setFieldValue("options",[...values.options,{ id:`dummy${values.options.length+1}`,text: "",isSelect: false,optionImg: null}])} className=' cursor-pointer' />}
                                    {values.selectedType != "True/False" && <BiSolidTrashAlt size={20} onClick={() => setFieldValue("options",values.options.filter((option,i)=> i!=values.options.length-1))} className=' cursor-pointer' />}
                                </div>
                                {
                    
                                    values.selectedType == "True/False" ? <>
                                        <InputImageBox name={`options.${0}.text`} isQuestion={false} text="True" image={values.options[0].optionImg} setFieldValue={setFieldValue} index={0} handleChange={handleChange} values={values} />
                                        <InputImageBox name={`options.${1}.text`} isQuestion={false} text="False" image={values.options[1].optionImg} setFieldValue={setFieldValue} index={1} handleChange={handleChange} values={values} />
                                    </>
                                        : values.options.map((ans, i) => (
                                            <InputImageBox name={`options.${i}.text`} key={i} type={values.selectedType} text={ans.text} isSelect={ans.isSelect} image={ans.optionImg || null} index={i} setFieldValue={setFieldValue} handleChange={handleChange} values={values} />
                                        ))
                                        
                                }

                                <div className='flex flex-row gap-2'>
                                    <label htmlFor='selectedType' className=' font-semibold text-md'>Question Type: </label>
                                    <select id="selectedType" name="selectedType"
                                        value={values.selectedType}
                                        onChange={(e) => setFieldValue("selectedType", e.target.value)}
                                        className=' focus:outline-slate-400 border border-slate-700'>
                                        <option value="Multiple choice" selected>Multiple choice</option>
                                        <option value="Single choice">Single choice</option>
                                        <option value="True/False">True/False</option>
                                    </select>
                                </div>

                                <div className='flex flex-row gap-2'>
                                    <label htmlFor='questionTime' className=' font-semibold text-md'>Question Time: </label>
                                    <select id="questionTime" name="questionTime"
                                        value={values.questionTime}
                                        onChange={(e) => setFieldValue("questionTime", e.target.value)}
                                        className=' focus:outline-slate-400 border border-slate-700'>
                                        <option >5s</option>
                                        <option >10s</option>
                                        <option >15s</option>
                                        <option >20s</option>
                                        <option >30s</option>
                                        <option >60s</option>
                                        <option >120s</option>
                                    </select>
                                </div>

                                <div className='flex flex-row justify-evenly'>
                                    <button type='submit' className=' bg-green-900 rounded-lg text-white w-24 text-center self-center p-1'>Save</button>
                                    <p type='' className=' bg-red-700 rounded-lg text-white w-24 text-center self-center p-1' onClick={()=>handelDelete(values.id)}>Delete</p>
                                </div>
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </>
    )
}

export default QuestionArea