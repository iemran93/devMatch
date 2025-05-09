package bootstrap

import (
	"github.com/rs/cors"
)

// NewCorsHandler creates a new CORS handler with configured options
func NewCorsHandler() *cors.Cors {
	// Create a new CORS handler with options that allow requests from the frontend
	corsOptions := cors.Options{
		// Allow requests from both local development and production environments
		AllowedOrigins: []string{
			"http://localhost:3000",           // Local development
			"https://your-production-url.com", // Replace with your production URL when deployed
		},
		AllowedMethods: []string{
			"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH",
		},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
			"X-Requested-With",
			"Origin",
		},
		// Allow credentials such as cookies to be sent with requests
		AllowCredentials: true,
		// How long the results of a preflight request can be cached (in seconds)
		MaxAge: 600, // 10 minutes
		// Enable Debugging for development, disable in production
		Debug: false,
	}

	return cors.New(corsOptions)
}
