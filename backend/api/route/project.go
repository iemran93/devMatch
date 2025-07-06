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

func NewProjectRouter(env *bootstrap.Env, timeout time.Duration, db *sqlx.DB, publicRouter, protectedRouter *mux.Router) {
	pr := repository.NewProjectRepository(db)
	pu := usecase.NewProjectUseCase(pr, timeout)
	pc := &controller.ProjectController{
		ProjectUseCase: pu,
		Env:            env,
	}

	// public routes
	setupPublicProjectRoutes(pc, publicRouter)

	// private routes
	setupProtectedProjectRoutes(pc, protectedRouter)
}

func setupPublicProjectRoutes(controller *controller.ProjectController, router *mux.Router) {
	router.HandleFunc("/projects", controller.List).Methods("GET")
	router.HandleFunc("/projects/{id}", controller.GetById).Methods("GET")
	// TODO: Implement these handlers in ProjectController
	//router.HandleFunc("/projects/search", controller.Search).Methods("GET")
	//router.HandleFunc("/projects/categories", controller.GetCategories).Methods("GET")
}

func setupProtectedProjectRoutes(controller *controller.ProjectController, router *mux.Router) {
	router.HandleFunc("/projects", controller.Create).Methods("POST")
	router.HandleFunc("/projects/{id}", controller.Update).Methods("PUT")
	router.HandleFunc("/projects/{id}", controller.Delete).Methods("DELETE")
	// TODO: Implement these handlers in ProjectController
	//router.HandleFunc("/projects/my", controller.GetMyProjects).Methods("GET")
	//router.HandleFunc("/projects/{id}/join", controller.JoinProject).Methods("POST")
	//router.HandleFunc("/projects/{id}/leave", controller.LeaveProject).Methods("DELETE")
}
