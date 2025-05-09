package usecase

import (
	"context"
	"time"

	"github.com/iemran93/devMatch/bootstrap"
	"github.com/iemran93/devMatch/domain"
	"github.com/iemran93/devMatch/internal/tokenutil"
	"github.com/iemran93/devMatch/repository"

	log "github.com/sirupsen/logrus"
)

type refreshTokenUseCase struct {
	userRepository repository.UserRepository
	contextTimeout time.Duration
}

func NewRefreshTokenUseCase(userRepository repository.UserRepository, timeout time.Duration) domain.RefreshTokenUseCase {
	return &refreshTokenUseCase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (rtu *refreshTokenUseCase) RefreshToken(ctx context.Context, request domain.RefreshTokenRequest, env *bootstrap.Env) (accessToken string, refreshToken string, err error) {
	var id int
	id, err = tokenutil.ExtractIDFromToken(request.RefreshToken, env.RefreshTokenSecret)
	if err != nil {
		log.Error(err)
		return
	}

	var user *domain.User
	user, err = rtu.userRepository.GetUserById(ctx, id)
	if err != nil {
		log.Error(err)
		return
	}

	accessToken, err = tokenutil.CreateAccessToken(user, env.AccessTokenSecret, env.AccessTokenExpiryHour)
	if err != nil {
		log.Error(err)
		return
	}

	refreshToken, err = tokenutil.CreateRefreshToken(user, env.RefreshTokenSecret, env.RefreshTokenExpiryHour)
	if err != nil {
		log.Error(err)
		return
	}

	return accessToken, refreshToken, nil
}
