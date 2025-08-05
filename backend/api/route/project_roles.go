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

func NewProjectRolesRouter(env *bootstrap.Env, timeout time.Duration, db *sqlx.DB, r *mux.Router) {
	prr := repository.NewProjectRolesRepository(db)
	pr := repository.NewProjectRepository(db)
	prc := &controller.ProjectRolesController{
		ProjectRolesUseCase: usecase.NewProjectRolesUseCase(prr, pr, timeout),
		Env:                 env,
	}

	group := r.PathPrefix("/project/roles").Subrouter()
	group.HandleFunc("", prc.CreateRole).Methods("POST")
	group.HandleFunc("/{id}", prc.UpdateRole).Methods("PUT")
	group.HandleFunc("/{id}", prc.DeleteRole).Methods("DELETE")
}
