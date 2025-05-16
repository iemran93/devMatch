package middleware

import (
	"context"
	"net/http"

	"github.com/iemran93/devMatch/domain"
	"github.com/iemran93/devMatch/internal/tokenutil"
	"github.com/iemran93/devMatch/utils"
)

func JwtAuthMiddleware(secret string) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(
			func(w http.ResponseWriter, r *http.Request) {
				authToken, err := utils.GetCookie(r, "access_token")
				if err == nil {
					authorized, err := tokenutil.IsAuthorized(authToken, secret)
					if err != nil {
						utils.JSON(w, 401, domain.ErrorResponse{Message: err.Error()})
						return
					}
					if authorized {
						userID, err := tokenutil.ExtractIDFromToken(authToken, secret)
						if err != nil {
							utils.JSON(w, 401, domain.ErrorResponse{Message: err.Error()})
							return
						}
						// set user id to context
						ctx := context.WithValue(r.Context(), "user_id", userID)
						r = r.WithContext(ctx)
						next.ServeHTTP(w, r)
						return
					}
					utils.JSON(w, 401, domain.ErrorResponse{Message: domain.ErrUnauthorized.Error()})
					return
				}
				utils.JSON(w, 401, domain.ErrorResponse{Message: domain.ErrUnauthorized.Error()})
				return
			})
	}
}

// authHeader := r.Header.Get("Authorization")
// t := strings.Split(authHeader, " ")
