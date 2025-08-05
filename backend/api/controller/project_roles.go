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

type ProjectRolesController struct {
	ProjectRolesUseCase domain.ProjectRolesUseCase
	Env                 *bootstrap.Env
}

func (prc *ProjectRolesController) CreateRole(w http.ResponseWriter, r *http.Request) {
	var projectRoleRequest domain.ProjectRoleRequest
	ctx := r.Context()

	if err := json.NewDecoder(r.Body).Decode(&projectRoleRequest); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrIncorrectRequestBody)
		return
	}

	if err := projectRoleRequest.Validate(); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrIncorrectRequestBody)
		return
	}

	role, err := prc.ProjectRolesUseCase.Create(ctx, &projectRoleRequest)
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrInternalServerError)
		return
	}

	utils.JSON(w, http.StatusCreated, role)
}
func (prc *ProjectRolesController) UpdateRole(w http.ResponseWriter, r *http.Request) {
	var projectRoleRequest domain.ProjectRoleRequest
	ctx := r.Context()

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrIncorrectRequestBody)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&projectRoleRequest); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrIncorrectRequestBody)
		return
	}

	if err := projectRoleRequest.Validate(); err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrIncorrectRequestBody)
		return
	}

	role, err := prc.ProjectRolesUseCase.Update(ctx, &projectRoleRequest, id)
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrInternalServerError)
		return
	}

	utils.JSON(w, http.StatusOK, role)

}
func (prc *ProjectRolesController) DeleteRole(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusBadRequest, domain.ErrIncorrectRequestBody)
		return
	}

	err = prc.ProjectRolesUseCase.Delete(ctx, id)
	if err != nil {
		log.Error(err)
		utils.JSON(w, http.StatusInternalServerError, domain.ErrInternalServerError)
		return
	}

	utils.JSON(w, http.StatusOK, domain.SuccessResponse{Message: "Delete Role successfully"})

}
