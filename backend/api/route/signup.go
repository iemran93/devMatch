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

func NewSignupRouter(env *bootstrap.Env, timeout time.Duration, db *sqlx.DB, r *mux.Router) {
	ur := repository.NewUserRepository(db)
	sc := controller.SignupController{
		SignupUseCase: usecase.NewSignupUseCase(ur, timeout),
		Env:           env,
	}

	r.HandleFunc("/signup", sc.Signup).Methods("POST")
}
