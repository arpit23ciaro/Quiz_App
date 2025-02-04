import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './routes/Route'

function App() {
  return (
    <div className='bg-[#00837E] min-h-[100vh]  w-full relative overflow-x-hidden'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
