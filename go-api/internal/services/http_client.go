package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"qr-go-api/config"
	"qr-go-api/internal/models"
)

type HTTPClient struct {
	client     *http.Client
	nodeAPIURL string
}

func NewHTTPClient(cfg *config.Config) *HTTPClient {
	return &HTTPClient{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
		nodeAPIURL: cfg.NodeAPIURL,
	}
}

func (c *HTTPClient) PostStatistics(request models.StatisticsRequest, token string) (*models.StatisticsResponse, error) {
	url := fmt.Sprintf("%s/api/v1/statistics", c.nodeAPIURL)

	jsonData, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", token)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("statistics API returned status %d: %s", resp.StatusCode, string(body))
	}

	var statistics models.StatisticsResponse
	if err := json.NewDecoder(resp.Body).Decode(&statistics); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &statistics, nil
}
