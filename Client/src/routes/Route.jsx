import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import CreateQuiz from "../pages/CreateQuiz";
import QuizTitle from "../components/QuizTitle";
import PublicRoute from "../components/Auth/PublicRoute";
import PrivateRoute from "../components/Auth/PrivateRoute";
import UserProfile from "../pages/UserProfile";
import UserNavbar from "../components/userSide/UserNavbar";
import JoiningScreen from '../components/userSide/JoiningScreen'
import FinalScoreBoard from "../components/userSide/FinalScoreBoard";
import PlayQuiz from "../components/userSide/PlayQuiz";
import HostQuizPlayScreen from "../components/HostQuizPlayScreen";



export const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicRoute>
            <Navbar />
            <div className="h-[63px] w-full"></div>
            <Home />
        </PublicRoute>
    },
    {
        path: '/login',
        element: <PublicRoute>
            <Navbar />
            <div className="h-[63px] w-full"></div>
            <Login />
        </PublicRoute>
    },
    {
        path: '/signup',
        element: <PublicRoute>
            <Navbar />
            <div className="h-[63px] w-full"></div>
            <Signup />
        </PublicRoute>
    },
    {
        path: '/forgot-password',
        element: <PublicRoute>
            <Navbar />
            <div className="h-[63px] w-full"></div>
            <ForgotPassword />
        </PublicRoute>
    },
    {
        path: '/reset-password/:token',
        element: <PublicRoute>
            <Navbar />
            <div className="h-[63px] w-full"></div>
            <ResetPassword />
        </PublicRoute>
    },
    {
        path: '/dashboard/:userId',
        element:<PrivateRoute>
            <Navbar />
            <div className="h-[63px] w-full"></div>
            <Dashboard />
        </PrivateRoute>
    },
    {
        path: '/myQuiz/:quizId',
        element:
        <PrivateRoute>
            <Navbar />  
            <CreateQuiz />
        </PrivateRoute>
    },
    {
        path:"/quizTitle",
        element:<PrivateRoute>
            <Navbar />
            <div className="h-[63px] w-full"></div>
            <QuizTitle />
        </PrivateRoute>
    },
    {
        path:"/userProfile",
        element:<>
            <UserNavbar />
            <UserProfile />
        </>
    },
    {
        path:"/joiningScreen",
        element:<>
            <FinalScoreBoard />
        </>
    },
    {
        path:"/userJoining/:quizId",
        element:<>
            <JoiningScreen />
        </>
    },
    {
        path:"/playQuiz",
        element:<>
            <UserNavbar />
            <PlayQuiz />
        </>
    },
    {
        path:"/hostQuizPlay",
        element:<>
            <HostQuizPlayScreen/>
        </>
    }
])