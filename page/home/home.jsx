import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import { CoinContext } from "../../src/context/CoinContext.jsx";
import { Link } from 'react-router-dom';
import { Chart } from "react-google-charts"; // Gebruik de Google Charts voor pie chart

const Home = () => {
    const { coins } = useContext(CoinContext);
    const [displayCoin, setDisplayCoin] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pieChartData, setPieChartData] = useState(null);

    // Filtreeer de munten en werk de resultaten bij
    useEffect(() => {
        if (searchText === '') {
            setDisplayCoin(coins);
        } else {
            const filteredCoins = coins.filter(coin =>
                coin.name.toLowerCase().includes(searchText.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchText.toLowerCase())
            );
            setDisplayCoin(filteredCoins);
        }
    }, [coins, searchText]);

    // Zet de dataset voor de Pie Chart
    useEffect(() => {
        if (coins.length > 0) {
            const chartData = [
                ["Coin", "Market Cap"], // Header voor google charts
                ...coins.slice(0, 10).map((coin) => [coin.name, coin.market_cap]), // Top 10 munten
            ];
            setPieChartData(chartData);
        }
    }, [coins]);

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div>
            <h2 style={{ color: "black" }}>Home Page</h2>
            <div className="hero">
                <h1>Home Page</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Search crypto"
                        value={searchText}
                        onChange={handleSearch}
                    />
                </form>
            </div>

            {/* Cirkelgrafiek sectie */}
            {pieChartData && (
                <div style={{ margin: "30px auto", maxWidth: "800px", background: "white", padding: "20px", borderRadius: "10px" }}>
                    <h3 style={{ textAlign: "center" }}>Marktkapitalisatie Verdeling (Top 10)</h3>
                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="400px"
                        data={pieChartData}
                        options={{
                            backgroundColor: "#f9f9f9",
                            is3D: true,
                            legend: { position: "bottom" },
                        }}
                    />
                </div>
            )}

            <div className="crypto-table">
                <div className="table-layout">
                    <p>#</p>
                    <p>Coin</p>
                    <p>Price</p>
                    <p style={{ textAlign: "center" }}>24H Change</p>
                    <p className={'market-cap'}>Market Cap</p>
                </div>

                {displayCoin.length > 0 ? (
                    displayCoin.slice(0, 20).map((item, index) => (
                        <div className="table-layout" key={index}>
                            <p>{item.market_cap_rank}</p>
                            <div>
                                <img src={item.image} alt={item.name} />
                                <Link to={`/coin/${item.id}`} style={{ color: "white" }}>
                                    {item.name + " - " + item.symbol}
                                </Link>
                            </div>
                            <p>{"€" + item.current_price.toLocaleString()}</p>
                            <p className={item.price_change_percentage_24h > 0 ? "green" : "red"}>
                                {Math.floor(item.price_change_percentage_24h * 100) / 100}%
                            </p>
                            <p className={'market-cap'}>€{item.market_cap.toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: "center", color: "gray" }}>Geen resultaten gevonden...</p>
                )}
            </div>
        </div>
    );
};

export default Home;