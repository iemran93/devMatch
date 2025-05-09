package domain

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/iemran93/devMatch/bootstrap"
)

type SignupRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type SignupResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type SignupUseCase interface {
	SignUp(ctx context.Context, request SignupRequest, env *bootstrap.Env) (accessToken string, refreshToken string, err error)
}

func (sr *SignupRequest) Validate() error {
	v := validator.New()
	err := v.Struct(sr)
	if err != nil {
		return err
	}
	return nil
}
