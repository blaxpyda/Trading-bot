package repository

import (
	"fmt"
	"time"

	binance_connector "github.com/binance/binance-connector-go"
	"thugcorp.io/trading/internal/models"
)

type MarketDataRepository interface {
	GetAllMarketTicks() ([]models.MarketTick, error)
	GetKline() ([]models.Kline, error)
}

type marketDataRepository struct {
	binance_connector.Client
}

func NewMarketDataRepository(client binance_connector.Client) MarketDataRepository {
	return &marketDataRepository{
		Client: client,
	}
}

func (r *marketDataRepository) GetAllMarketTicks() ([]models.MarketTick, error) {
	websockettStreamClient := binance_connector.NewWebsocketStreamClient(false)
	var marketTicks []models.MarketTick

	wsAllMarketTickersHandler := func(event binance_connector.WsAllMarketTickersStatEvent) {
		for _, ticker := range event {
			marketTick := models.MarketTick{
				Symbol:         ticker.Symbol,
				LastPrice:      ticker.LastPrice,
			}
			marketTicks = append(marketTicks, marketTick)
		}
	}
	errHandler := func(err error) {
		fmt.Println(err)
	}

	doneC, stopC, err := websockettStreamClient.WsAllMarketTickersStatServe(wsAllMarketTickersHandler, errHandler)
	if err != nil {
		return nil, fmt.Errorf("failed to start websocket: %w", err)
	}

	// use stopCh to exit
	go func() {
		time.Sleep(10 * time.Second)
		stopC <- struct{}{}
	}()
	<-doneC
	if len(marketTicks) == 0 {
		return nil, fmt.Errorf("no market ticks received")
	}
	return marketTicks, nil
}

func (r *marketDataRepository) GetKline() ([]models.Kline, error) {
	websocketStreamClient := binance_connector.NewWebsocketStreamClient(false)
	var klines []models.Kline

	wsKlineHandler := func(event *binance_connector.WsKlineEvent) {
		k := event.Kline
		kline := models.Kline{
			StartTime:           k.StartTime,
			Symbol:              k.Symbol,
			Interval:            k.Interval,
			FirstTradeID:        k.FirstTradeID,
			LastTradeID:         k.LastTradeID,
			Volume:              k.Volume,
			QuoteVolume:         k.QuoteVolume,
		}
		klines = append(klines, kline)
	}

	errHandler := func(err error) {
		fmt.Println("websocket error:", err)
	}

	doneCh, stopC, err := websocketStreamClient.WsKlineServe("btcusdt", "1m", wsKlineHandler, errHandler)
	if err != nil {
		return nil, fmt.Errorf("failed to start websocket: %w", err)
	}

	// Stop after 10 seconds for demo purposes
	go func() {
		time.Sleep(10 * time.Second)
		stopC <- struct{}{}
	}()

	<-doneCh

	if len(klines) == 0 {
		return nil, fmt.Errorf("no klines received")
	}
	return klines, nil
}
