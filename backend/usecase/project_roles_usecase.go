package usecase

import (
	"context"
	"time"

	"github.com/iemran93/devMatch/domain"
	"github.com/iemran93/devMatch/repository"
)

type projectRolesUseCase struct {
	projectRolesRepository repository.ProjectRolesInterface
	projectRepository      repository.ProjectRepository
	contextTimeout         time.Duration
}

func NewProjectRolesUseCase(prr repository.ProjectRolesInterface, pr repository.ProjectRepository, timeout time.Duration) domain.ProjectRolesUseCase {
	return &projectRolesUseCase{
		projectRolesRepository: prr,
		projectRepository:      pr,
		contextTimeout:         timeout,
	}
}

func (pru *projectRolesUseCase) Create(c context.Context, req *domain.ProjectRoleRequest) (*domain.ProjectRole, error) {
	ctx, cancel := context.WithTimeout(c, pru.contextTimeout)
	defer cancel()

	// project exist ? userId is the creater ?
	userId := ctx.Value("user_id")
	project, err := pru.projectRepository.GetById(ctx, req.ProjectId)
	if err != nil {
		return nil, err
	}
	if project == nil {
		return nil, domain.ErrProjectNotFound
	}
	if project.Creator.Id != userId {
		return nil, domain.ErrUnauthorized
	}

	return pru.projectRolesRepository.Create(ctx, req)
}

func (pru *projectRolesUseCase) Update(c context.Context, req *domain.ProjectRoleRequest, id int) (*domain.ProjectRole, error) {
	ctx, cancel := context.WithTimeout(c, pru.contextTimeout)
	defer cancel()

	userId := ctx.Value("user_id")
	// role exist ? is woner?
	_, err := pru.projectRolesRepository.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	project, err := pru.projectRepository.GetById(ctx, req.ProjectId)
	if err != nil {
		return nil, err
	}

	if project == nil {
		return nil, domain.ErrProjectNotFound
	}
	if project.Creator.Id != userId {
		return nil, domain.ErrUnauthorized
	}

	return pru.projectRolesRepository.Update(ctx, req, id)
}

func (pru *projectRolesUseCase) Delete(c context.Context, id int) error {
	ctx, cancel := context.WithTimeout(c, pru.contextTimeout)
	defer cancel()

	userId := ctx.Value("user_id")

	// role exist ? is owner ?

	role, err := pru.projectRolesRepository.Get(ctx, id)
	if err != nil {
		return err
	}

	project, err := pru.projectRepository.GetById(ctx, role.ProjectId)
	if err != nil {
		return err
	}

	if project.Creator.Id != userId {
		return domain.ErrUnauthorized
	}

	return pru.projectRolesRepository.Delete(ctx, id)
}
