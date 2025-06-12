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

func (pu *projectUseCase) Create(c context.Context, req *domain.CreateProjectRequest) error {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	// Get creator ID from context
	creatorId := ctx.Value("user_id").(int)

	project := &domain.Project{
		Title:         req.Title,
		Description:   req.Description,
		Goals:         req.Goals,
		CategoryId:    req.CategoryId,
		ProjectTypeId: req.ProjectTypeId,
		Stage:         req.Stage,
		CreatorId:     creatorId,
		Technologies:  req.Technologies,
		Languages:     req.Languages,
	}

	return pu.projectRepository.Create(ctx, project)
}

func (pu *projectUseCase) GetById(c context.Context, id int) (*domain.ProjectResponse, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.projectRepository.GetById(ctx, id)
}

func (pu *projectUseCase) List(c context.Context, filters map[string]interface{}) ([]domain.ProjectResponse, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.projectRepository.List(ctx, filters)
}

func (pu *projectUseCase) Update(c context.Context, project *domain.Project) error {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	// Get user ID from context and verify ownership
	userId := ctx.Value("user_id").(int)
	existingProject, err := pu.projectRepository.GetById(ctx, project.Id)
	if err != nil {
		return err
	}
	if existingProject.Creator.Id != userId {
		return domain.ErrUnauthorized
	}

	return pu.projectRepository.Update(ctx, project)
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
