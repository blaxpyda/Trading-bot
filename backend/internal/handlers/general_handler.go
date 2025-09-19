package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"thugcorp.io/trading/internal/logger"
	"thugcorp.io/trading/internal/repository"
)

type GeneralHandler struct {
	generalRepo repository.GeneralRepository
	logger *logger.Logger
}

func NewGeneralHandler(generalRepo repository.GeneralRepository, logger *logger.Logger) *GeneralHandler {
	return &GeneralHandler{
		generalRepo: generalRepo,
		logger: logger,
	}
}

func (h *GeneralHandler) GetBinanceServerStatus(w http.ResponseWriter, r *http.Request) {
	// Validate HTTP method
	if r.Method != http.MethodGet {
		h.logger.Error(fmt.Sprintf("Invalid HTTP method: %s", r.Method), nil)
		h.writeJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	h.logger.Info("Received request for Binance server status")

	// Fetch server status from repository
	status, err := h.generalRepo.GetBinanceServerStatus(r.Context())
	if err != nil {
		h.logger.Error("Error getting Binance server status: ", err)
		h.writeJSONError(w, "Failed to get server status", http.StatusInternalServerError)
		return
	}
	// Prepare JSON response
	response := map[string]string{"status": status}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.logger.Error("Failed to encode response", err)
		h.writeJSONError(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	h.logger.Info(fmt.Sprintf("Responded with Binance server status: %s", status))
}

func (h *GeneralHandler) GetBinanceServerTime(w http.ResponseWriter, r *http.Request) {
	// Validate HTTP method
	if r.Method != http.MethodGet {
		h.logger.Error(fmt.Sprintf("Invalid HTTP method: %s", r.Method), nil)
		h.writeJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	h.logger.Info("Received request for Binance server time")

	// Fetch server time from repository
	serverTime, err := h.generalRepo.GetBinanceServerTime(r.Context())
	if err != nil {
		h.logger.Error("Error getting Binance server time: ", err)
		h.writeJSONError(w, "Failed to get server time", http.StatusInternalServerError)
		return
	}
	// Prepare JSON response
	response := map[string]int64{"server_time": serverTime}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.logger.Error("Failed to encode response", err)
		h.writeJSONError(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	h.logger.Info(fmt.Sprintf("Responded with Binance server time: %d", serverTime))
}

// GetBinanceTickers handles the HTTP request to get all Binance tickers.
func (h *GeneralHandler) GetBinanceTickers(w http.ResponseWriter, r *http.Request) {
	// Validate HTTP method
	if r.Method != http.MethodGet {
		h.logger.Error(fmt.Sprintf("Invalid HTTP method: %s", r.Method), nil)
		h.writeJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	h.logger.Info("Received request for all Binance tickers")

	// Fetch tickers from repository
	tickerJSON, err := h.generalRepo.GetAllBinanceTickers(r.Context())
	if err != nil {
		h.logger.Error("Error getting Binance tickers: ", err)
		h.writeJSONError(w, "Failed to get tickers", http.StatusInternalServerError)
		return
	}
	// Prepare JSON response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tickerJSON); err != nil {
		h.logger.Error("Failed to write response", err)
		h.writeJSONError(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	h.logger.Info("Responded with all Binance tickers")
}

// GetBinanceExchangeAndSymbol handles the HTTP request to get Binance exchange and symbol information.
func (h *GeneralHandler) GetBinanceExchangeAndSymbol(w http.ResponseWriter, r *http.Request) {
	// Validate HTTP method
	if r.Method != http.MethodGet {
		h.logger.Error(fmt.Sprintf("Invalid HTTP method: %s", r.Method), nil)
		h.writeJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	h.logger.Info("Received request for Binance exchange and symbol information")
	
	// Fetch exchange info from repository
	exchangeJSON, err := h.generalRepo.GetBinanceExchangeAndSymbol(r.Context())
	if err != nil {
		h.logger.Error("Error getting Binance exchange info: ", err)
		h.writeJSONError(w, "Failed to get exchange info", http.StatusInternalServerError)
		return
	}
	// Prepare JSON response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(exchangeJSON); err != nil {
		h.logger.Error("Failed to write response", err)
		h.writeJSONError(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	h.logger.Info("Responded with Binance exchange and symbol information")
}

// writeJSONError writes a JSON error response with the given message and status code.
func (h *GeneralHandler) writeJSONError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	response := map[string]string{"error": message}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.logger.Error("Failed to encode error response", err)
		// Fallback to plain text if JSON encoding fails
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}