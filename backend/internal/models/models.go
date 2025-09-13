package models

type Price struct {
	Symbol string  `json:"symbol"`
	Price  float64 `json:"price"`
}

type Order struct {
	Symbol   string  `json:"symbol"`
	Side	 string  `json:"side"` // "buy" or "sell"
	Quantity float64 `json:"quantity"`
	Price    float64 `json:"price"`
	Timestamp int64   `json:"timestamp"`
}

type MarketTick struct {
    Symbol          string `json:"s"` // Symbol (e.g., BTCUSDT)
    LastPrice       string `json:"c"` // Last price
}

type Kline struct {
    StartTime            int64   `json:"t"` // Kline start time
    CloseTime            int64   `json:"T"` // Kline close time
    Symbol               string  `json:"s"` // Symbol
    Interval             string  `json:"i"` // Interval (1m, 5m, 1h, etc.)
    FirstTradeID         int64   `json:"f"` // First trade ID
    LastTradeID          int64   `json:"L"` // Last trade ID
    OpenPrice            string  `json:"o"` // Open price
    ClosePrice           string  `json:"c"` // Close price
    HighPrice            string  `json:"h"` // High price
    LowPrice             string  `json:"l"` // Low price
    Volume               string  `json:"v"` // Base asset volume
    TradeCount           int64   `json:"n"` // Number of trades
    IsClosed             bool    `json:"x"` // Is this kline closed?
    QuoteVolume          string  `json:"q"` // Quote asset volume
    TakerBuyBaseVolume   string  `json:"V"` // Taker buy base asset volume
    TakerBuyQuoteVolume  string  `json:"Q"` // Taker buy quote asset volume
    Ignore               string  `json:"B"` // Ignore
}