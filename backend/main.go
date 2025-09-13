package main

import (
	"log"
	"net/http"
	"os"

	binance_connector "github.com/binance/binance-connector-go"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	apphandlers "thugcorp.io/trading/internal/handlers"
	"thugcorp.io/trading/internal/logger"
	"thugcorp.io/trading/internal/repository"
	
)

func InitializeLogger() *logger.Logger {
	logInstance, err := logger.NewLogger("trading_bot.log")
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	return logInstance
}

func main() {
	// Load env variables
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found: %v", err)
	}
	// Initialize logger
	logInstance := InitializeLogger()
	defer logInstance.Close()

	// Initialise repositories
	marketRepo := repository.NewMarketDataRepository(*binance_connector.NewClient("", ""))
	// orderRepo := repository.NewOrderRepository("your_api_key", "your_secret_key")

	// // Initialise services
	// tradingService := services.NewTradingService(orderRepo, marketRepo)

	// Initialise handlers
	// tradingHandler := apphandlers.NewTradingHandler(tradingService, logInstance)
	marketdataHandler := apphandlers.NewMarketDataHandler(marketRepo, logInstance)

	// Set up routes
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()

	// Start trading bot endpoint
	// api.HandleFunc("/start_bot", tradingHandler.StartBot).Methods("POST")

	// Market data endpoints
	api.HandleFunc("/market_ticks", marketdataHandler.GetAllMarketTicks).Methods("GET")
	api.HandleFunc("/kline", marketdataHandler.GetKline).Methods("GET")
	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := http.ListenAndServe(":"+port, handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(r)); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
