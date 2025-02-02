import React from 'react'

const Button = ({text,isSubmitting}) => {
  return (
    <button className=' bg-black rounded-lg text-white w-24 text-center self-center p-1 mt-3' disabled={isSubmitting} type='submit'>{text}</button>
  )
}

export default Button