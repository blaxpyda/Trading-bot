package handlers

import (
	"encoding/json"
	"net/http"

	"thugcorp.io/trading/internal/logger"
	"thugcorp.io/trading/internal/repository"
)

type MarketDataHandler struct {
	marketdatarepo repository.MarketDataRepository
	logger		 *logger.Logger
}

func NewMarketDataHandler(marketdatarepo repository.MarketDataRepository, logger *logger.Logger) *MarketDataHandler {
	return &MarketDataHandler{
		marketdatarepo: marketdatarepo,
		logger:         logger,
	}
}

// Utility functions
func (h *MarketDataHandler) respondWithJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		h.logger.Error("Failed to encode JSON response: %v", err)
	}
}

// Handle for all market ticks
func (h *MarketDataHandler) GetAllMarketTicks(w http.ResponseWriter, r *http.Request) {
	marketTicks, err := h.marketdatarepo.GetAllMarketTicks()
	if err != nil {
		h.logger.Error("Failed to get market ticks: %v", err)
		http.Error(w, "Failed to get market ticks", http.StatusInternalServerError)
		return
	}
	h.respondWithJSON(w, http.StatusOK, marketTicks)
}

// Handle for kline data
func (h *MarketDataHandler) GetKline(w http.ResponseWriter, r *http.Request) {
	klines, err := h.marketdatarepo.GetKline()
	if err != nil {
		h.logger.Error("Failed to get kline data: %v", err)
		http.Error(w, "Failed to get kline data", http.StatusInternalServerError)
		return
	}
	h.respondWithJSON(w, http.StatusOK, klines)
}