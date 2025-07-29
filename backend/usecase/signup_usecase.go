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

type signupUseCase struct {
	userRepository repository.UserRepository
	contextTimeout time.Duration
}

func NewSignupUseCase(userRepository repository.UserRepository, timeout time.Duration) domain.SignupUseCase {
	return &signupUseCase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (su *signupUseCase) SignUp(ctx context.Context, request domain.SignupRequest, env *bootstrap.Env) (accessToken string, refreshToken string, err error) {
	// Check if user already exists
	existingUser, _ := su.userRepository.GetUserByEmail(ctx, request.Email)
	if existingUser != nil {
		log.Error("User already exists")
		err = domain.ErrUserAlreadyExists
		return
	}

	encryptedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(request.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		log.Error(err)
		return
	}

	request.Password = string(encryptedPassword)

	user := &domain.User{
		Name:      request.Name,
		Email:     request.Email,
		Password:  request.Password,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	user, err = su.userRepository.CreateUser(ctx, user)
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

	return
}
