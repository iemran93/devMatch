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

func NewProjectActionsRouter(env *bootstrap.Env, timeout time.Duration, db *sqlx.DB, r *mux.Router) {
	pr := repository.NewProjectActionsRepository(db)
	ur := repository.NewUserRepository(db)
	prr := repository.NewProjectRepository(db)
	pu := usecase.NewProjectActionsUseCase(pr, ur, prr, timeout)
	pc := &controller.ProjectActionsController{
		ProjectActionsUseCase: pu,
		Env:                   env,
	}

	group := r.PathPrefix("/project/request").Subrouter()
	group.HandleFunc("/{id}", pc.GetProjectRequests).Methods("GET")
	group.HandleFunc("/apply", pc.ApplyToProject).Methods("POST")
	group.HandleFunc("/cancel", pc.CancelRequestToProject).Methods("DELETE")
	group.HandleFunc("/withdraw", pc.WithdrawFromProject).Methods("DELETE")
	group.HandleFunc("/reply", pc.ReplyToRequest).Methods("PUT")
}
