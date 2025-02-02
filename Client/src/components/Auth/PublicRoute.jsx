import React from 'react'
import { useUserAuth } from '../../context/userAuthContextProvider';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({children}) => {
    const { isAuthenticated ,user,navLoading} = useUserAuth();
    
    if(isAuthenticated==null)
        return <div>Loading...</div>
    return isAuthenticated ? <Navigate to={`/dashboard/${user.id}`} /> : children;
}

export default PublicRoute