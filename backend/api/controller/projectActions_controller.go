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

type ProjectActionsController struct {
	ProjectActionsUseCase domain.ProjectActionsUseCase
	Env                   *bootstrap.Env
}

func (c *ProjectActionsController) GetProjectRequests(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid project ID"})
		return
	}

	ctx := r.Context()
	projectRequests, err := c.ProjectActionsUseCase.GetById(ctx, id)
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrorResponse{Message: "Internal server error"})
		return
	}

	if projectRequests == nil {
		utils.JSON(w, http.StatusNotFound, domain.ErrorResponse{Message: "Project not found"})
		return
	}

	utils.JSON(w, http.StatusOK, projectRequests)
}

func (c *ProjectActionsController) ApplyToProject(w http.ResponseWriter, r *http.Request) {
	var req domain.ProjectActionRequest
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
	if err := c.ProjectActionsUseCase.ApplyToProject(ctx, req); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	utils.JSON(w, http.StatusOK, domain.SuccessResponse{Message: "Applied to project successfully"})
}
func (c *ProjectActionsController) CancelRequestToProject(w http.ResponseWriter, r *http.Request) {
	var req domain.ProjectActionRequest
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
	if err := c.ProjectActionsUseCase.CancelRequestToProject(ctx, req); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	utils.JSON(w, http.StatusOK, domain.SuccessResponse{Message: "Request cancelled successfully"})
}
func (c *ProjectActionsController) WithdrawFromProject(w http.ResponseWriter, r *http.Request) {
	var req domain.ProjectActionRequest
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
	if err := c.ProjectActionsUseCase.WithdrawFromProject(ctx, req); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	utils.JSON(w, http.StatusOK, domain.SuccessResponse{Message: "Withdrawn from project successfully"})
}
func (c *ProjectActionsController) ReplyToRequest(w http.ResponseWriter, r *http.Request) {
	var req domain.ProjectActionReplyRequest
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
	if err := c.ProjectActionsUseCase.ReplyToRequest(ctx, req); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	utils.JSON(w, http.StatusOK, domain.SuccessResponse{Message: "Replied to request successfully"})
}
