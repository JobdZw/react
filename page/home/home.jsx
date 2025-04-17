import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import { CoinContext } from "../../src/context/CoinContext.jsx";
import { Link } from 'react-router-dom';
import { Chart } from "react-google-charts";

const Home = () => {
    const { coins, favorites, toggleFavorite } = useContext(CoinContext); // Favorieten ophalen
    const [displayCoin, setDisplayCoin] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pieChartData, setPieChartData] = useState(null);

    // Update de Coinlijst en sorteer op favorieten of zoektekst
    useEffect(() => {
        if (searchText === '') {
            // Sorteer de coins: favorieten + overige munten
            const sortedCoins = [
                ...coins.filter(coin => favorites.includes(coin.id)), // Favorieten
                ...coins.filter(coin => !favorites.includes(coin.id)), // Resterende coins
            ];
            setDisplayCoin(sortedCoins);
        } else {
            // Filter de munten op zoektekst
            const filteredCoins = coins.filter(coin =>
                coin.name.toLowerCase().includes(searchText.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchText.toLowerCase())
            );
            setDisplayCoin(filteredCoins);
        }
    }, [coins, favorites, searchText]);

    // Maak dataset voor de Pie Chart
    useEffect(() => {
        if (coins.length > 0) {
            const chartData = [
                ["Coin", "Market Cap"], // Google Charts header
                ...coins.slice(0, 20).map((coin) => [coin.name, coin.market_cap]),
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

            {/* Cirkelgrafiek bovenaan */}
            {pieChartData && (
                <div style={{ margin: "30px auto", maxWidth: "800px", background: "white", padding: "20px", borderRadius: "10px" }}>
                    <h3 style={{ textAlign: "center" }}>Marktkapitalisatie Verdeling (Top 20)</h3>
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

            {/* Zoekbalk */}
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

            {/* Tabel met coins / favorieten */}
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
                                <button
                                    onClick={() => toggleFavorite(item.id)} // Favoriet toggelen
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: favorites.includes(item.id) ? "yellow" : "gray" // Favoriet markeren
                                    }}
                                >
                                    ★
                                </button>
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
                    <p style={{ color: "white", textAlign: "center" }}>Geen munten gevonden</p>
                )}
            </div>
        </div>
    );
};

export default Home;