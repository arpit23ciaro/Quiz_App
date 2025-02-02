import React from 'react'
import { useUserAuth } from '../../context/userAuthContextProvider'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated,navLoading } = useUserAuth();
    if(isAuthenticated==null)
        return <div>Loading...</div>
    return isAuthenticated ? children : <Navigate to='/login' />

}

export default PrivateRoute