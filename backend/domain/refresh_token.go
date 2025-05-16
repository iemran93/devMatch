package domain

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/iemran93/devMatch/bootstrap"
)

type RefreshTokenRequest struct {
	RefreshToken string `form:"refreshToken" binding:"required"`
}

type RefreshTokenResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func (rt *RefreshTokenRequest) Validate() error {
	v := validator.New()
	err := v.Struct(rt)
	if err != nil {
		return err
	}
	return nil
}

type RefreshTokenUseCase interface {
	RefreshToken(ctx context.Context, request RefreshTokenRequest, env *bootstrap.Env) (accessToken string, refreshToken string, err error)
}
