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

func NewGoogleRouter(env *bootstrap.Env, timeout time.Duration, db *sqlx.DB, r *mux.Router) {
	ur := repository.NewUserRepository(db)
	gc := &controller.GoogleController{
		GoogleUseCase: usecase.NewGoogleUseCase(ur, timeout),
		Env:           env,
	}

	r.HandleFunc("/google/login", gc.HandleGoogleLogin).Methods("GET")
	r.HandleFunc("/google/callback", gc.HandleGoogleCallback).Methods("GET")
}
