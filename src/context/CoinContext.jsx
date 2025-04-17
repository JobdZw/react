import React, { createContext, useEffect, useState } from 'react';

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
    const [coins, setCoins] = useState([]);
    const [favorites, setFavorites] = useState([]); // Toevoegen van favorieten

    const fetchCoins = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-cg-demo-api-key': 'CG-JGcuvpwqF5yR8DXmg5p8jRXw'
            }
        };

        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur', options)
            .then(res => res.json())
            .then(res => setCoins(res))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchCoins();
    }, []);

    const toggleFavorite = (coinId) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(coinId)) {
                // Als coin al favoriet is, verwijder deze
                return prevFavorites.filter(id => id !== coinId);
            } else {
                // Anders voeg coin toe aan favorieten
                return [...prevFavorites, coinId];
            }
        });
    };

    const contextValue = {
        coins,
        favorites,
        toggleFavorite, // Functie om favorieten te beheren
        fetchCoins,
    };

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    );
};

export default CoinContextProvider;