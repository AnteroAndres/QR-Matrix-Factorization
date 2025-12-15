package models

type Matrix [][]float64

type QRFactorizationRequest struct {
	Matrix Matrix `json:"matrix"`
}

type QRFactorizationResponse struct {
	Original   Matrix              `json:"original"`
	Q          Matrix              `json:"Q"`
	R          Matrix              `json:"R"`
	Statistics *StatisticsResponse `json:"statistics"`
}

type StatisticsRequest struct {
	Q Matrix `json:"Q"`
	R Matrix `json:"R"`
}

type StatisticsResponse struct {
	Max        float64        `json:"max"`
	Min        float64        `json:"min"`
	Average    float64        `json:"average"`
	Sum        float64        `json:"sum"`
	IsDiagonal IsDiagonalInfo `json:"isDiagonal"`
}

type IsDiagonalInfo struct {
	Q bool `json:"Q"`
	R bool `json:"R"`
}
