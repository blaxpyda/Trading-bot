package handlers

// import (
// 	"encoding/json"
// 	"net/http"

// 	"thugcorp.io/trading/internal/logger"
// 	"thugcorp.io/trading/internal/services"
// )

// type TradingHandler struct {
// 	tradingService services.TradingService
// 	logger         *logger.Logger
// }


// func NewTradingHandler(tradingService services.TradingService, logger *logger.Logger) *TradingHandler {
// 	return &TradingHandler{
// 		tradingService: tradingService,
// 		logger:         logger,
// 	}
// }

// // Utility functions
// func (h *TradingHandler) respondWithJSON(w http.ResponseWriter, status int, payload interface{}) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(status)
// 	if err := json.NewEncoder(w).Encode(payload); err != nil {
// 		h.logger.Error("Failed to encode JSON response: %v", err)
// 	}
// }

// func (h *TradingHandler) StartBot(w http.ResponseWriter, r *http.Request) {
// 	type requestPayload struct {
// 		Symbol       string  `json:"symbol"`
// 		BuyThreshold float64 `json:"buy_threshold"`
// 		SellThreshold float64 `json:"sell_threshold"`
// 	}

// 	var payload requestPayload
// 	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
// 		h.logger.Error("Failed to decode request body: %v", err)
// 		http.Error(w, "Invalid request payload", http.StatusBadRequest)
// 		return
// 	}

// 	if err := h.tradingService.EvaluateAndTrade(payload.Symbol, payload.BuyThreshold, payload.SellThreshold); err != nil {
// 		h.logger.Error("Trading error: %v", err)
// 		http.Error(w, "Trading error: "+err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	w.WriteHeader(http.StatusOK)
// 	h.respondWithJSON(w, http.StatusOK, map[string]string{"status": "bot started"})
// }