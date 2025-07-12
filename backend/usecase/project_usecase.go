package usecase

import (
	"context"
	"time"

	"github.com/iemran93/devMatch/domain"
)

type projectUseCase struct {
	projectRepository domain.ProjectRepository
	contextTimeout    time.Duration
}

func NewProjectUseCase(projectRepository domain.ProjectRepository, timeout time.Duration) domain.ProjectUseCase {
	return &projectUseCase{
		projectRepository: projectRepository,
		contextTimeout:    timeout,
	}
}

func (pu *projectUseCase) Create(c context.Context, req *domain.CreateProjectRequest) (*domain.ProjectResponse, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	creatorId := ctx.Value("user_id").(int)

	projectId, err := pu.projectRepository.Create(ctx, req, creatorId)
	if err != nil {
		return nil, err
	}

	project, err := pu.projectRepository.GetById(ctx, projectId)
	if err != nil {
		return nil, err
	}

	return project, nil
}

func (pu *projectUseCase) GetById(c context.Context, id int) (*domain.ProjectResponse, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.projectRepository.GetById(ctx, id)
}

func (pu *projectUseCase) List(c context.Context, filters map[string]any) ([]domain.ProjectResponse, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.projectRepository.List(ctx, filters)
}

func (pu *projectUseCase) Update(c context.Context, req *domain.CreateProjectRequest, id int) error {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	// Get user ID from context and verify ownership
	userId := ctx.Value("user_id").(int)
	existingProject, err := pu.projectRepository.GetById(ctx, id)
	if err != nil {
		return err
	}
	if existingProject.Creator.Id != userId {
		return domain.ErrUnauthorized
	}

	return pu.projectRepository.Update(ctx, req, id)
}

func (pu *projectUseCase) Delete(c context.Context, id int) error {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	// Get user ID from context and verify ownership
	userId := ctx.Value("user_id").(int)
	existingProject, err := pu.projectRepository.GetById(ctx, id)
	if err != nil {
		return err
	}
	if existingProject.Creator.Id != userId {
		return domain.ErrUnauthorized
	}

	return pu.projectRepository.Delete(ctx, id)
}

func (pu *projectUseCase) GetCategory(c context.Context) ([]domain.Category, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.projectRepository.GetCategory(ctx)
}

func (pu *projectUseCase) GetTechnology(c context.Context) ([]domain.Technology, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.projectRepository.GetTechnology(ctx)
}

func (pu *projectUseCase) GetLanguage(c context.Context) ([]domain.Language, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.projectRepository.GetLanguage(ctx)
}

func (pu *projectUseCase) GetType(c context.Context) ([]domain.Types, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.projectRepository.GetType(ctx)
}
