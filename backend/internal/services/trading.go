package services

// import (
// 	"fmt"
// 	"time"

// 	"thugcorp.io/trading/internal/models"
// 	"thugcorp.io/trading/internal/repository"
// )

// type TradingService interface {
// 	EvaluateAndTrade(symbol string, buyThreshold, sellThreshold float64) error
// }

// type tradingService struct {
// 	orderRepo repository.OrderRepository
// 	marketRepo repository.MarketDataRepository
// }

// func NewTradingService(orderRepo repository.OrderRepository, marketRepo repository.MarketDataRepository) TradingService {
// 	return &tradingService{
// 		orderRepo: orderRepo,
// 		marketRepo: marketRepo,
// 	}
// }

// func (s *tradingService) EvaluateAndTrade(symbol string, buyThreshold, sellThreshold float64) error {
// 	// Fetch price from market data repository
// 	priceData, err := s.marketRepo.GetPrice(symbol)
// 	if err != nil {
// 		return fmt.Errorf("failed to get price: %w", err)
// 	}
// 	// Simple threshold-based trading logic
// 	var decision string
// 	if priceData.Price < buyThreshold {
// 		decision = "buy"
// 	} else if priceData.Price > sellThreshold {
// 		decision = "sell"
// 	} else {
// 		decision = "hold" 
// 	}

// 	fmt.Printf("Price: %.2f, Decision: %s\n", priceData.Price, decision)

// 	// Place order if decision is buy or sell
// 	if decision == "buy" || decision == "sell" {
// 		order := models.Order{
// 			Symbol:   symbol,
// 			Side:     decision,
// 			Quantity: 1.0, // Example fixed quantity
// 			Price:    priceData.Price,
// 			Timestamp: time.Now().Unix(),
// 		}
// 		if err := s.orderRepo.PlaceOrder(order); err != nil {
// 			return fmt.Errorf("failed to place order: %w", err)
// 		}
// 	}

// 	return nil
// }