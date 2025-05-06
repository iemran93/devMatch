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

func NewUserRouter(env *bootstrap.Env, timeout time.Duration, db *sqlx.DB, r *mux.Router) {
	ur := repository.NewUserRepository(db)
	uc := &controller.UserController{
		UserUseCase: usecase.NewUserUseCase(ur, timeout),
		Env:         env,
	}

	// USER ROUTES
	group := r.PathPrefix("/user").Subrouter()
	group.HandleFunc("/all", uc.GetUsers).Methods("GET")
	group.HandleFunc("", uc.GetUserById).Methods("GET")
	group.HandleFunc("", uc.UpdateUser).Methods("PUT")
	group.HandleFunc("", uc.DeleteUser).Methods("DELETE")
}
