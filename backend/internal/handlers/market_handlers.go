package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"thugcorp.io/trading/internal/logger"
	"thugcorp.io/trading/internal/repository"
)

type MarketHandler struct {
	marketRepo repository.MarketRepository
	logger     *logger.Logger
}

func NewMarketHandler(marketRepo repository.MarketRepository, logger *logger.Logger) *MarketHandler {
	return &MarketHandler{
		marketRepo: marketRepo,
		logger:     logger,
	}
}

// GetHistoricalTrades handles HTTP requests to fetch historical trades for a given symbol.
func (h *MarketHandler) GetHistoricalTrades(w http.ResponseWriter, r *http.Request) {
	// get ?symbol=BTCUSDT from URL query parameters
	symbol := r.URL.Query().Get("symbol")
	limitStr := r.URL.Query().Get("limit")

	// convert limitStr to int, default to 500 if not provided or invalid
	limit := 500
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		} else {
			h.logger.Error("Invalid 'limit' query parameter, defaulting to 500", err)
		}
	}
	
	if symbol == "" {
		h.logger.Error("Missing 'symbol' query parameter", nil)
		h.writeJSONError(w, "Missing 'symbol' query parameter", http.StatusBadRequest)
		return
	}

	// Fetch historical trades from repository
	historicalTradeLookup, err := h.marketRepo.GetHistoricalTrades(r.Context(), symbol, limit)
	if err != nil {
		h.logger.Error("Error getting historical trades: ", err)
		h.writeJSONError(w, "Failed to get historical trades", http.StatusInternalServerError)
		return
	}

	// Prepare JSON response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(historicalTradeLookup); err != nil {
		h.logger.Error("Failed to encode response", err)
		h.writeJSONError(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	h.logger.Info("Responded with historical trades for symbol: " + symbol)
}

// writeJSONError is a helper function to write JSON error responses.
func (h *MarketHandler) writeJSONError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	response := map[string]string{"error": message}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.logger.Error("Failed to encode error response", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}