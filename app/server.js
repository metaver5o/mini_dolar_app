const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Configurações
const ALPHA_VANTAGE_KEY = "HK5KYXS7W5BM0V52"; // Substitua por uma key válida

let marketData = {
  dol: { 
    price: 5200, 
    change: 0, 
    session: { high: 0, low: 0 }, 
    volume: 0,
    indicators: {
      rsi: 50,
      movingAverage: 5200,
      volatility: 1.0
    }
  },
  economicIndicators: {
    selic: 10.75,
    ipca: 0.35,
    usdIndex: 100
  }
};

async function getDolarData() {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=USD&to_symbol=BRL&interval=5min&apikey=${ALPHA_VANTAGE_KEY}`
    );
    
    if (!response.data || !response.data["Meta Data"]) {
      throw new Error("Resposta inválida da API");
    }

    const lastRefreshed = response.data["Meta Data"]["3. Last Refreshed"];
    const timeSeries = response.data["Time Series FX (5min)"][lastRefreshed];
    
    return {
      price: parseFloat(timeSeries["1. open"]),
      high: parseFloat(timeSeries["2. high"]),
      low: parseFloat(timeSeries["3. low"]),
      volume: parseFloat(timeSeries["5. volume"])
    };
  } catch (error) {
    console.error("Erro Alpha Vantage:", error.message);
    // Dados simulados
    const randomVariation = (Math.random() - 0.5) * 0.1;
    return {
      price: 5.20 + randomVariation,
      high: 5.25 + randomVariation,
      low: 5.15 + randomVariation,
      volume: 1000 + Math.random() * 500
    };
  }
}

async function updateMarketData() {
  const dolarData = await getDolarData();
  const previousPrice = marketData.dol.price / 1000 || dolarData.price;
  const changePercent = ((dolarData.price - previousPrice) / previousPrice) * 100;

  marketData.dol = {
    price: dolarData.price * 1000,
    change: (dolarData.price - previousPrice) * 1000,
    session: {
      high: Math.max(dolarData.high * 1000, marketData.dol.session.high),
      low: Math.min(dolarData.low * 1000, marketData.dol.session.low || Infinity)
    },
    volume: dolarData.volume,
    indicators: {
      rsi: Math.min(70, Math.max(30, 50 + changePercent * 2)),
      movingAverage: (dolarData.price * 1000 * 0.6 + marketData.dol.price * 0.4),
      volatility: Math.abs(changePercent) * 1.5
    }
  };

  console.log("Dados atualizados:", new Date().toLocaleTimeString());
}

app.get("/api/data", (req, res) => {
  res.json(marketData);
});

app.use(express.static("public"));

const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  setInterval(updateMarketData, 30000);
  updateMarketData();
});