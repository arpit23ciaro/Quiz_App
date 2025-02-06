import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './routes/Route'
import { usePlayQuiz } from './context/playQuizContextProvider';
import { useEffect } from 'react';
import socket from './utils/socket/socket';

function App() {
  const { setUserId } = usePlayQuiz();
  useEffect(() => {
    socket.connect();
    socket.on('get-user-id', (userId) => {
      setUserId(userId);
    })
    return () => {
      socket.disconnect();
      socket.off('get-user-id');
    };
  }, []);
  return (
    <div className='bg-[#00837E] min-h-[100vh]  w-full relative overflow-x-hidden'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
