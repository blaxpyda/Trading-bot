package services

// import (
// 	"context"
// 	"encoding/json"
// 	"net/http"
// 	"thugcorp.io/trading/internal/models"
// )


// type SystemStatusResponse struct {
// 	Status int    `json:"status"`
// 	Msg    string `json:"msg"`
// }


// type APIKeyPermissionService struct {

// }

// func (s *APIKeyPermissionService) Do(ctx context.Context) (res *models.APIKeyPermissionResponse, err error) {
// 	r := &request {
// 		method: http.MethodGet,
// 		endpoint: systemStatusEndpoint,
// 		sectype: secTypeNone,

// 	}
// 	data, err := s.c.callAPI(ctx, r, opts...)
// 	if err != nil {
// 		return nil, err
// 	}
// 	res = new(SystemStatusResponse)
// 	err = json.Unmarshal(data, &res)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return res, nil
// }