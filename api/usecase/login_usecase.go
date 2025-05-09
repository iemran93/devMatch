package usecase

import (
	"context"
	"time"

	"github.com/iemran93/devMatch/bootstrap"
	"github.com/iemran93/devMatch/domain"
	"github.com/iemran93/devMatch/internal/tokenutil"
	"github.com/iemran93/devMatch/repository"

	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

type loginUseCase struct {
	userRepository repository.UserRepository
	contextTimeout time.Duration
}

func NewLoginUseCase(userRepository repository.UserRepository, timeout time.Duration) domain.LoginUseCase {
	return &loginUseCase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (lu *loginUseCase) Login(ctx context.Context, request domain.LoginRequest, env *bootstrap.Env) (loginResponse domain.LoginResponse, err error) {
	var user *domain.User
	user, err = lu.userRepository.GetUserByEmail(ctx, request.Email)
	if err != nil {
		log.Error(err)
		return
	}

	if user.GoogleId.Valid {
		log.Error("User should login with Google")
		err = domain.ErrUserShouldLoginWithGoogle
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)) != nil {
		log.Error("Invalid password")
		err = domain.ErrInvalidPassword
		return
	}

	accessToken, err := tokenutil.CreateAccessToken(user, env.AccessTokenSecret, env.AccessTokenExpiryHour)
	if err != nil {
		log.Error(err)
		return
	}

	refreshToken, err := tokenutil.CreateRefreshToken(user, env.RefreshTokenSecret, env.RefreshTokenExpiryHour)
	if err != nil {
		log.Error(err)
		return
	}

	return domain.LoginResponse{
		Id:           user.Id,
		Name:         user.Name,
		Email:        user.Email,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}
