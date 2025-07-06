package controller

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/iemran93/devMatch/bootstrap"
	"github.com/iemran93/devMatch/domain"
	"github.com/iemran93/devMatch/utils"
	log "github.com/sirupsen/logrus"
)

type ProjectController struct {
	ProjectUseCase domain.ProjectUseCase
	Env            *bootstrap.Env
}

func (pc *ProjectController) Create(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}

	if err := req.Validate(); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: domain.ErrIncorrectRequestBody.Error()})
		return
	}

	ctx := r.Context()
	project, err := pc.ProjectUseCase.Create(ctx, &req)
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	utils.JSON(w, http.StatusCreated, project)
}

func (pc *ProjectController) GetById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid project ID"})
		return
	}

	ctx := r.Context()
	project, err := pc.ProjectUseCase.GetById(ctx, id)
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	if project == nil {
		utils.JSON(w, http.StatusNotFound, domain.ErrorResponse{Message: "Project not found"})
		return
	}

	utils.JSON(w, http.StatusOK, project)
}

func (pc *ProjectController) List(w http.ResponseWriter, r *http.Request) {
	filters := make(map[string]any)

	// Parse query parameters
	if stage := r.URL.Query().Get("stage"); stage != "" {
		filters["stage"] = stage
	}
	if projectType := r.URL.Query().Get("project_type_id"); projectType != "" {
		if typeId, err := strconv.Atoi(projectType); err == nil {
			filters["project_type_id"] = typeId
		}
	}
	if category := r.URL.Query().Get("category_id"); category != "" {
		if categoryId, err := strconv.Atoi(category); err == nil {
			filters["category_id"] = categoryId
		}
	}

	ctx := r.Context()
	projects, err := pc.ProjectUseCase.List(ctx, filters)
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	utils.JSON(w, http.StatusOK, projects)
}

func (pc *ProjectController) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid project ID"})
		return
	}

	var req domain.CreateProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}

	err = req.Validate()
	if err != nil {
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: domain.ErrIncorrectRequestBody.Error()})
		return
	}

	ctx := r.Context()
	if err := pc.ProjectUseCase.Update(ctx, &req, id); err != nil {
		if err == domain.ErrUnauthorized {
			utils.JSON(w, http.StatusForbidden, domain.ErrorResponse{Message: "Not authorized to update this project"})
			return
		}
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	utils.JSON(w, http.StatusOK, "Project updated successfully")
}

func (pc *ProjectController) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid project ID"})
		return
	}

	ctx := r.Context()
	if err := pc.ProjectUseCase.Delete(ctx, id); err != nil {
		if err == domain.ErrUnauthorized {
			utils.JSON(w, http.StatusForbidden, domain.ErrorResponse{Message: "Not authorized to delete this project"})
			return
		}
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	utils.JSON(w, http.StatusOK, "Project deleted successfully")
}
