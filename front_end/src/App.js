import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/index';
import DashBoard from './Pages/DashBoard/index';
import Register from './Pages/Register/index';
import Events from './Pages/Events/index'
import MyRegistration from './Pages/My Registration/index';
import { Container } from 'reactstrap';
import './App.css';

const App = () => {
    return (
        <>
            <Container>
                <h1>Subscripzz App </h1>
                <div className="content">
                    <Routes>
                    <Route exact path='/' element={<DashBoard />}>DashBoard</Route>
                        <Route exact path='/login' element={<Login />}>Login</Route>
                        <Route exact path='/register' element={<Register />}>Register</Route>
                        <Route exact path='/events' element={<Events />}>Events</Route>
                        <Route exact path='/requests' element={<MyRegistration />}>Reguests</Route>
                    </Routes>
                </div>
            </Container>
        </>
    )
};
export default App;