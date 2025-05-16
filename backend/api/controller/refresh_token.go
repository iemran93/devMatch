package controller

import (
	"net/http"

	"github.com/iemran93/devMatch/bootstrap"
	"github.com/iemran93/devMatch/domain"
	"github.com/iemran93/devMatch/utils"

	log "github.com/sirupsen/logrus"
)

type RefreshTokenController struct {
	RefreshTokenUseCase domain.RefreshTokenUseCase
	Env                 *bootstrap.Env
}

func (rtc *RefreshTokenController) RefreshToken(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	refreshTokenValue, err := utils.GetCookie(r, "refresh_token")
	if err != nil {
		// Instead of an error, just return unauthorized status
		log.Warn("Refresh token not found in cookies")
		utils.JSON(w, http.StatusUnauthorized, domain.ErrorResponse{Message: "Authentication required"})
		return
	}

	request := domain.RefreshTokenRequest{
		RefreshToken: refreshTokenValue,
	}

	if err := request.Validate(); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: domain.ErrIncorrectRequestBody.Error()})
		return
	}

	// Generate new tokens
	accessToken, refreshToken, err := rtc.RefreshTokenUseCase.RefreshToken(ctx, request, rtc.Env)
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusUnauthorized, domain.ErrorResponse{Message: "Invalid refresh token"})
		return
	}

	// Set the new tokens as cookies
	utils.SetCookie(w, "access_token", accessToken)
	utils.SetCookie(w, "refresh_token", refreshToken)

	// Return success response
	utils.JSON(w, http.StatusOK, domain.SuccessResponse{Message: "Tokens refreshed successfully"})
	return
}
