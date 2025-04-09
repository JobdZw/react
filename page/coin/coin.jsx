import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CoinContext } from '../../src/context/CoinContext.jsx';
import { Chart } from "react-google-charts";

const Coin = () => {
    const { coinId } = useParams();
    const navigate = useNavigate();
    const { coins } = useContext(CoinContext);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const coinInfo = coins.find((coin) => coin.id === coinId);
        setSelectedCoin(coinInfo);

        if (coinInfo) {

            fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=eur&days=7`)
                .then((response) => response.json())
                .then((data) => {

                    const formattedData = [
                        ["Tijd", "Prijs (EUR)"],
                        ...data.prices.map(([timestamp, price]) => [
                            new Date(timestamp).toLocaleString("nl-NL", {
                                weekday: "short",
                                hour: "2-digit",
                            }),
                            price,
                        ]),
                    ];
                    setChartData(formattedData);
                })
                .catch((error) => console.error("Fout bij het ophalen van gegevens:", error));
        }
    }, [coinId, coins]);

    if (!selectedCoin) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ color: "white", padding: "20px", backgroundColor: "#121212", minHeight: "100vh" }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: "20px",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    backgroundColor: "#4267f5",
                    color: "white",
                }}
            >
                Terug
            </button>

            <h1>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</h1>
            <img src={selectedCoin.image} alt={selectedCoin.name} style={{ width: "50px" }} />
            <p>Huidige prijs: €{selectedCoin.current_price.toLocaleString()}</p>
            <p>Marktkapitalisatie: €{selectedCoin.market_cap.toLocaleString()}</p>

            {chartData ? (
                <div style={{ marginTop: "30px", backgroundColor: "white", borderRadius: "10px", padding: "20px" }}>
                    <h3>Prijs per uur voor de afgelopen 7 dagen</h3>
                    <Chart
                        chartType="LineChart"
                        width="100%"
                        height="400px"
                        data={chartData}
                        options={{
                            legend: { position: "bottom" },
                            backgroundColor: "#f9f9f9",
                            hAxis: { title: "Tijd", gridlines: { count: 24 * 7 } },
                            vAxis: { title: "Prijs (EUR)" },
                        }}
                    />
                </div>
            ) : (
                <p>Grafiekgegevens laden...</p>
            )}
        </div>
    );
};

export default Coin;