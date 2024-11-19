import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { auth } from "./config/firebaseConfig";
import StoreContextProvider, { StoreContext } from './context/StoreContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { onAuthStateChanged } from "firebase/auth";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsAuthenticated(true);
            navigate('/home'); 
        } else {
            setIsAuthenticated(false);
            navigate('/'); 
        }
    });
    return () => unsubscribe();
}, [navigate]);
  return (
    <>
      <ToastContainer/>
      <StoreContextProvider>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/home" element={isAuthenticated ? <Home/> :<Login setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
      </StoreContextProvider>
    </>
  );
}

export default App;
