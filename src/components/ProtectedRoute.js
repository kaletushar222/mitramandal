import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = useSelector(state => state.authReducer.currentUser);
    if (!user) {
        return <Navigate to="/mitramandal/login" replace />;
    }
    return children;
}

export default ProtectedRoute;
