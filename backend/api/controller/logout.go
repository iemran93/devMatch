package controller

import (
	"net/http"
	"time"

	"github.com/iemran93/devMatch/domain"
	"github.com/iemran93/devMatch/utils"

	log "github.com/sirupsen/logrus"
)

type LogoutController struct{}

func (lc *LogoutController) Logout(w http.ResponseWriter, r *http.Request) {
	// Clear access token cookie
	expiredCookie := &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
	}
	http.SetCookie(w, expiredCookie)

	// Clear refresh token cookie
	expiredRefreshCookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
	}
	http.SetCookie(w, expiredRefreshCookie)

	log.Info("User logged out successfully")
	utils.JSON(w, http.StatusOK, domain.SuccessResponse{Message: "Logged out successfully"})
}
