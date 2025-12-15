package handlers

import (
	"log"
	"time"

	"qr-go-api/config"
	"qr-go-api/internal/models"
	"qr-go-api/internal/services"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type MatrixHandler struct {
	matrixService *services.MatrixService
	config        *config.Config
}

func NewMatrixHandler(matrixService *services.MatrixService, cfg *config.Config) *MatrixHandler {
	return &MatrixHandler{
		matrixService: matrixService,
		config:        cfg,
	}
}

func (h *MatrixHandler) CalculateQR(c *fiber.Ctx) error {
	var req models.QRFactorizationRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request format",
		})
	}

	// Validate matrix
	if err := h.matrixService.ValidateMatrix(req.Matrix); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Compute QR
	q, r, err := h.matrixService.ComputeQR(req.Matrix)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	token := c.Get("Authorization")
	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing authorization token",
		})
	}

	stats, err := h.matrixService.GetStatistics(q, r, token)
	if err != nil {
		log.Printf("Warning: Failed to get statistics: %v", err)
		return c.JSON(fiber.Map{
			"original": req.Matrix,
			"Q":        q,
			"R":        r,
		})
	}

	return c.JSON(fiber.Map{
		"original":   req.Matrix,
		"Q":          q,
		"R":          r,
		"statistics": stats,
	})
}

func (h *MatrixHandler) HealthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":  "healthy",
		"service": "go-api",
	})
}

func (h *MatrixHandler) Login(c *fiber.Ctx) error {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Username == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Username and password are required",
		})
	}
	// If ADMIN_USER and ADMIN_PASS are configured, enforce credential check.
	// Otherwise, allow any non-empty credentials for demo purposes.
	if h.config.AdminUser != "" || h.config.AdminPass != "" {
		if req.Username != h.config.AdminUser || req.Password != h.config.AdminPass {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid username or password",
			})
		}
	}
	claims := jwt.MapClaims{
		"username": req.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
		"iat":      time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(h.config.JWTSecret))
	if err != nil {
		log.Printf("Error generating token: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
	})
}