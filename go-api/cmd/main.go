package main

import (
	"log"

	"qr-go-api/config"
	"qr-go-api/internal/handlers"
	"qr-go-api/internal/middleware"
	"qr-go-api/internal/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	cfg := config.LoadConfig()

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${latency} ${method} ${path}\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, OPTIONS",
	}))

	httpClient := services.NewHTTPClient(cfg)
	matrixService := services.NewMatrixService(httpClient)
	matrixHandler := handlers.NewMatrixHandler(matrixService, cfg)

	authMiddleware := middleware.AuthMiddleware(cfg)

	// Routes
	app.Get("/health", matrixHandler.HealthCheck)

	api := app.Group("/api/v1")
	api.Post("/login", matrixHandler.Login)
	api.Use(authMiddleware)
	api.Post("/matrix/qr", matrixHandler.CalculateQR)

	// Start server
	port := cfg.Port
	log.Printf("Server starting on port %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
