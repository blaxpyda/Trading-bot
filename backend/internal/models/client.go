package models

import (
	"log"
	"net/http"
)

type Client struct {
	APIKey     string
	SecretKey  string
	BaseURL    string
	HTTPClient *http.Client
	Debug      bool
	Logger     *log.Logger
	TimeOffset int64
	do         doFunc
}

type doFunc func(req *http.Request) (*http.Response, error)


