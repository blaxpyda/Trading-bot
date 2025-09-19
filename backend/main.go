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
	marketRepository := repository.NewMarketRepository(*binance_connector.NewClient(os.Getenv("BINANCE_API_KEY"), os.Getenv("BINANCE_API_SECRET")), logInstance)
	generalRepo := repository.NewGeneralRepository(*binance_connector.NewClient(os.Getenv("BINANCE_API_KEY"), os.Getenv("BINANCE_API_SECRET")), logInstance)

	// // Initialise services

	// Initialise handlers
	generalHandler := apphandlers.NewGeneralHandler(generalRepo, logInstance)
	marketHandler := apphandlers.NewMarketHandler(marketRepository, logInstance)
	// Set up routes
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()

	// Start trading bot endpoint
	// api.HandleFunc("/start_bot", tradingHandler.StartBot).Methods("POST")

	// Market data endpoints
	api.HandleFunc("/status", generalHandler.GetBinanceServerStatus).Methods("GET")
	api.HandleFunc("/time", generalHandler.GetBinanceServerTime).Methods("GET")
	api.HandleFunc("/tickers", generalHandler.GetBinanceTickers).Methods("GET")
	api.HandleFunc("/exchange_info", generalHandler.GetBinanceExchangeAndSymbol).Methods("GET")
	api.HandleFunc("/historical_trades", marketHandler.GetHistoricalTrades).Methods("GET")
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
