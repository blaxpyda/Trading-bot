package models

type APIKeyPermissionResponse struct {
	IPRestrict                   bool   `json:"ipRestrict"`
	CreateTime                   uint64 `json:"createTime"`
	EnableReading                bool   `json:"enableReading"`
	EnableWithdrawals            bool   `json:"enableWithdrawals"`
	EnableInternalTransfer       bool   `json:"enableInternalTransfer"`
	EnableMargin                 bool   `json:"enableMargin"`
	EnableFutures                bool   `json:"enableFutures"`
	PermitsUniversalTransfer     bool   `json:"permitsUniversalTransfer"`
	EnableVanillaOptions         bool   `json:"enableVanillaOptions"`
	EnableFixApiTrade            bool   `json:"enableFixApiTrade"`
	EnableFixReadOnly            bool   `json:"enableFixReadOnly"`
	EnableSpotAndMarginTrading   bool   `json:"enableSpotAndMarginTrading"`
	EnablePortfolioMarginTrading bool   `json:"enablePortfolioMarginTrading"`
}
