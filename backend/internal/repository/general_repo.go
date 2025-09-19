package repository

import (
	"context"
	"encoding/json"

	binance_connector "github.com/binance/binance-connector-go"
	"thugcorp.io/trading/internal/logger"
)

// GeneralRepository defines methods to interact with general endpoints of the Binance API.
type GeneralRepository interface {
	GetBinanceServerStatus(ctx context.Context) (string, error)
	GetBinanceServerTime(ctx context.Context) (int64, error)
	GetAllBinanceTickers(ctx context.Context) (string, error)
	GetBinanceExchangeAndSymbol(ctx context.Context) (string, error)
}

type generalRepository struct {
	binance_connector.Client
	logger *logger.Logger
}

func NewGeneralRepository(client binance_connector.Client, logger *logger.Logger) GeneralRepository {
	return &generalRepository{
		Client: client,
		logger: logger,
	}
}

// GetBinanceServerStatus retrieves the current status of the Binance server.
func (r *generalRepository) GetBinanceServerStatus(ctx context.Context) (string, error) {
	r.logger.Info("Fetching Binance server status")
	err := r.Client.NewPingService().Do(ctx)
	if err != nil {
		r.logger.Error("Error fetching server status: ", err)
		return "DOWN", err
	}
	r.logger.Info("Binance server status retrieved successfully")
	return "UP", nil
}

// GetBinanceServerTime retrieves the current server time from Binance.
func (r *generalRepository) GetBinanceServerTime(ctx context.Context) (int64, error) {
	r.logger.Info("Fetching Binance server time")
	serverTime, err := r.Client.NewServerTimeService().Do(ctx)
	if err != nil {
		r.logger.Error("Error fetching server time: ", err)
		return 0, err
	}
	r.logger.Info("Binance server time retrieved successfully")
	return int64(serverTime.ServerTime), nil
}

// GetAllBinanceTickers retrieves all ticker information from Binance.
func (r *generalRepository) GetAllBinanceTickers(ctx context.Context) (string, error) {
	r.logger.Info("Fetching all Binance tickers")
	tickers, err := r.Client.NewTickerPriceService().Do(ctx)
	if err != nil {
		r.logger.Error("Error fetching tickers: ", err)
		return "", err
	}
	// Convert tickers to JSON string
	tickerJSON, err := json.Marshal(tickers)
	if err != nil {
		r.logger.Error("Error marshalling tickers to JSON: ", err)
		return "", err
	}
	r.logger.Info("All Binance tickers retrieved successfully")
	return string(tickerJSON), nil
}

// GetBinanceExchangeAndSymbol retrieves exchange and symbol information from Binance.
func (r *generalRepository) GetBinanceExchangeAndSymbol(ctx context.Context) (string, error) {
	r.logger.Info("Fetching Binance exchange and symbol information")
	exchangeInfo, err := r.Client.NewExchangeInfoService().Do(ctx)
	if err != nil {
		r.logger.Error("Error fetching exchange info: ", err)
		return "", err
	}
	// Convert exchange info to JSON string
	exchangeJSON, err := json.Marshal(exchangeInfo)
	if err != nil {
		r.logger.Error("Error marshalling exchange info to JSON: ", err)
		return "", err
	}
	r.logger.Info("Binance exchange and symbol information retrieved successfully")
	return string(exchangeJSON), nil
}

