package domain

import (
	"context"

	"github.com/iemran93/devMatch/bootstrap"
)

type LoginRequest struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required"`
}

type LoginResponse struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	User         string `json:"user"`
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type LoginUseCase interface {
	Login(ctx context.Context, request LoginRequest, env *bootstrap.Env) (loginResponse LoginResponse, err error)
}
