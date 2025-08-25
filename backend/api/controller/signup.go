package controller

import (
	"encoding/json"
	"net/http"

	"github.com/iemran93/devMatch/bootstrap"
	"github.com/iemran93/devMatch/domain"
	"github.com/iemran93/devMatch/utils"

	log "github.com/sirupsen/logrus"
)

type SignupController struct {
	SignupUseCase domain.SignupUseCase
	Env           *bootstrap.Env
}

func (sc *SignupController) Signup(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var request domain.SignupRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}

	if err := request.Validate(); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: domain.ErrIncorrectRequestBody.Error()})
		return
	}

	accessToken, refreshToken, err := sc.SignupUseCase.SignUp(ctx, request, sc.Env)
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}

	signupResponse := domain.SignupResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}

	utils.JSON(w, http.StatusOK, signupResponse)
}
