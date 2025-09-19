package repository

import (
	"context"
	"encoding/json"

	binance_connector "github.com/binance/binance-connector-go"
	"thugcorp.io/trading/internal/logger"
)

// MarketRepository defines methods to interact with market endpoints of the Binance API.
type MarketRepository interface {
	GetHistoricalTrades(ctx context.Context, symbol string, limit int) (string, error)
}

// marketRepository implements the MarketRepository interface.
type marketRepository struct {
	binance_connector.Client
	logger *logger.Logger
}

// NewMarketRepository creates a new instance of MarketRepository.
func NewMarketRepository(client binance_connector.Client, logger *logger.Logger) MarketRepository {
	return &marketRepository{
		Client: client,
		logger: logger,
	}
}

// GetHistoricalTrades retrieves historical trades for a given symbol from Binance.
func (r *marketRepository) GetHistoricalTrades(ctx context.Context, symbol string, limit int) (string, error) {

	svc := r.Client.NewHistoricalTradeLookupService().Symbol(symbol)

	// add limit if provided
	if limit > 0 {
		svc = svc.Limit(uint(limit))
	}

	historicalTradeLookUp, err := svc.Do(ctx)
	if err != nil {
		r.logger.Error("Error fetching historical trades: ", err)
		return "", err
	}

	historicalTradeLookUpJSON, err := json.Marshal(historicalTradeLookUp)
	if err != nil {
		r.logger.Error("Error marshalling historical trades to JSON: ", err)
		return "", err
	}

	r.logger.Info("Historical trades retrieved successfully")
	return string(historicalTradeLookUpJSON), nil
}

