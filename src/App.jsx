import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "../page/home/home.jsx";
import Coin from "../page/coin/coin.jsx"; // Let op: hoofdletter 'C' voor consistentie
function App() {
    return (
        <div className={'app'}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/coin/:coinId" element={<Coin />} /> {/* Dynamische coin id */}
            </Routes>
        </div>
    );
}


export default App;