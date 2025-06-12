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

// NewProjectRouter sets up both public and protected project routes
func NewProjectRouter(env *bootstrap.Env, timeout time.Duration, db *sqlx.DB, publicRouter, protectedRouter *mux.Router) {
	// Initialize repositories, usecases and controllers
	projectRepository := repository.NewProjectRepository(db)
	projectUseCase := usecase.NewProjectUseCase(projectRepository, timeout)
	projectController := &controller.ProjectController{
		ProjectUseCase: projectUseCase,
		Env:            env,
	}

	// Public project routes (no authentication required)
	setupPublicProjectRoutes(projectController, publicRouter)

	// Protected project routes (authentication required)
	setupProtectedProjectRoutes(projectController, protectedRouter)
}

func setupPublicProjectRoutes(controller *controller.ProjectController, router *mux.Router) {
	// Public routes - accessible without authentication
	router.HandleFunc("/projects", controller.List).Methods("GET")
	router.HandleFunc("/projects/{id}", controller.GetById).Methods("GET")
	// TODO: Implement these handlers in ProjectController
	//router.HandleFunc("/projects/search", controller.Search).Methods("GET")
	//router.HandleFunc("/projects/categories", controller.GetCategories).Methods("GET")
}

func setupProtectedProjectRoutes(controller *controller.ProjectController, router *mux.Router) {
	// Protected routes - require authentication
	router.HandleFunc("/projects", controller.Create).Methods("POST")
	router.HandleFunc("/projects/{id}", controller.Update).Methods("PUT")
	router.HandleFunc("/projects/{id}", controller.Delete).Methods("DELETE")
	// TODO: Implement these handlers in ProjectController
	//router.HandleFunc("/projects/my", controller.GetMyProjects).Methods("GET")
	//router.HandleFunc("/projects/{id}/join", controller.JoinProject).Methods("POST")
	//router.HandleFunc("/projects/{id}/leave", controller.LeaveProject).Methods("DELETE")
}
