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
	Username string `json:"username" validate:"required,min=4"`
}

type SignupResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func (sr *SignupRequest) Validate() error {
	v := validator.New()
	err := v.Struct(sr)
	if err != nil {
		return err
	}
	return nil
}

type SignupUseCase interface {
	SignUp(ctx context.Context, request SignupRequest, env *bootstrap.Env) (accessToken string, refreshToken string, err error)
}
