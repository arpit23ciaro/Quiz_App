import React, { useEffect, useRef, useState } from 'react'
import { LuImagePlus } from "react-icons/lu";
import { BiSolidTrashAlt } from "react-icons/bi";
import { ErrorMessage, Field } from 'formik';


const InputImageBox = ({ isSelect, name, isQuestion, text = '', image = null, index, values, setFieldValue, handleChange }) => {
  const [imageUrl ,setImageUrl] = useState(isQuestion ? values.questionImg : values.options[index].optionImg)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  useEffect(() => {
    if (isQuestion && values.questionImg) {
      setImageUrl(values.questionImg);
    } else if (!isQuestion && values.options[index]?.optionImg) {
      setImageUrl(values.options[index].optionImg);
    }
  }, [values.questionImg, values.options, index, isQuestion]);

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile)
    }
  }, [imageFile])

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }
  const handleRemove = () => {
    setImageFile(null);
    setPreviewSource(null);
    setImageUrl(null);
    setFieldValue(isQuestion ? "questionImg" : `options.${index}.optionImg`, null);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      previewFile(file)
      setFieldValue(isQuestion ? "questionImg" : `options.${index}.optionImg`, file);
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleOptionChange = (index, e) => {
    if (values.selectedType !== "Multiple choice") {
      const updatedOptions = values.options.map((option, idx) => ({
        ...option,
        isSelect: idx === index,
      }));
      setFieldValue("options", updatedOptions);
    }
    else {
      const currentStatus = values.options[index]?.isSelect;
      setFieldValue(`options.${index}.isSelect`, !currentStatus);
    }
  };

  return (
    <div className=' bg-gray-300 p-1 rounded-lg flex flex-col items-center'>
      <div className='flex flex-row bg-white rounded-md p-1 items-center gap-2 w-full'>
        {!isQuestion && <div >
          <input type="checkbox"
            name={`options.${index}.isSelect`}
            checked={values.options[index].isSelect}
            onChange={(e) => handleOptionChange(index, e)}
          />
        </div>}
        <input type='text'
          name={name}
          value={text}
          placeholder={isQuestion == "" ? "Enter the question" : "Enter the ansewer"}
          disabled={values.selectedType == "True/False" && !isQuestion}
          onChange={handleChange}
          className=' focus:outline-none w-full' />
        <input
          type="file"
          name={isQuestion ? "questionImg" : `options.${index}.optionImg`}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/gif, image/jpeg"
        />
        {imageFile || previewSource || imageUrl  ? <BiSolidTrashAlt size={25} onClick={handleRemove} className=' cursor-pointer' />
          : <LuImagePlus size={25} onClick={handleClick} className=' cursor-pointer' />}
      </div>
     
      {(previewSource || imageUrl) && (
      <img
        src={imageUrl ||previewSource}
        alt=''
        className={`rounded-xl ${!isQuestion ? "w-[128px] h-[118px]" : "w-[158px] h-[158px]"} ${(previewSource == null && (isQuestion)==null)} rounded-sm object-cover flex items-center mt-1`}
      />)}
    </div>
  )
}

export default InputImageBox