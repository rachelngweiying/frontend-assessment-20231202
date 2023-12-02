import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ItemDetailPage from './pages/ItemDetailPage';
import UserPage from './pages/UserPage';

function App() {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/item/:itemId" element={<ItemDetailPage />} />
                    <Route path="/user/:userId" element={<UserPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;