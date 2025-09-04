import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

export default function ProtectedRoute() {
  const token = useAppStore((s) => s.token);
  const currentUser = useAppStore((s) => s.currentUser);
  const location = useLocation();

  if (!token || !currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />; // render nested protected routes
}