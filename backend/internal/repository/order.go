package repository

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/go-resty/resty/v2"
	"thugcorp.io/trading/internal/models"
)

type OrderRepository interface {
	PlaceOrder(order models.Order) error
}

type orderRepository struct {
	client *resty.Client
	apiKey string
	secretKey string
}

func NewOrderRepository(apiKey, secretKey string) OrderRepository {
	return &orderRepository{
		client: resty.New(),
		apiKey: apiKey,
		secretKey: secretKey,
	}
}

func (r *orderRepository) PlaceOrder(order models.Order) error {
	timestamp := fmt.Sprintf("%d", time.Now().Unix()*1000)
	query := fmt.Sprintf("symbol=%s&side=%s&type=MARKET&quantity=%.8f&timestamp=%s",
		order.Symbol, order.Side, order.Quantity, timestamp)
	
	// Create HMAC SHA256 signature
	mac := hmac.New(sha256.New, []byte(r.secretKey))
	mac.Write([]byte(query))
	signature := hex.EncodeToString(mac.Sum(nil))

	resp, err := r.client.R().
		SetHeader("X-MBX-APIKEY", r.apiKey).
		SetQueryParams(map[string]string{
			"symbol":    order.Symbol,
			"side":      order.Side,
			"type":      "MARKET",
			"quantity":  fmt.Sprintf("%.8f", order.Quantity),
			"timestamp": timestamp,
			"signature": signature,
		}).
		Post("https://api.binance.com/api/v3/order")
	if err != nil {
		return fmt.Errorf("failed to place order: %w", err)
	}
	if resp.IsError() {
		return fmt.Errorf("order placement failed: %s", resp.String())
	}
	fmt.Printf("Order placed: %s\n", resp.String())
	return nil
}