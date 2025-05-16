package route

import (
	"time"

	"github.com/gorilla/mux"
	"github.com/iemran93/devMatch/api/controller"
	"github.com/iemran93/devMatch/bootstrap"
	"github.com/iemran93/devMatch/repository"
	"github.com/iemran93/devMatch/usecase"
	"github.com/jmoiron/sqlx"
)

func NewRefreshTokenRouter(env *bootstrap.Env, timeout time.Duration, db *sqlx.DB, r *mux.Router) {
	ur := repository.NewUserRepository(db)
	rtc := &controller.RefreshTokenController{
		RefreshTokenUseCase: usecase.NewRefreshTokenUseCase(ur, timeout),
		Env:                 env,
	}

	r.HandleFunc("/refresh_token", rtc.RefreshToken).Methods("POST")
}
