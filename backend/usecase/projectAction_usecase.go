package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/iemran93/devMatch/domain"
	"github.com/iemran93/devMatch/repository"
	log "github.com/sirupsen/logrus"
)

type projectActionUseCase struct {
	projectActionsRepository repository.ProjectActionsRepository
	userRepository           repository.UserRepository
	projectRepository        repository.ProjectRepository
	contextTimeout           time.Duration
}

func NewProjectActionsUseCase(projectActionsRepository *repository.ProjectActionsRepository, userRepository repository.UserRepository, projectRepository repository.ProjectRepository, timeout time.Duration) domain.ProjectActionsUseCase {
	return &projectActionUseCase{
		projectActionsRepository: *projectActionsRepository,
		userRepository:           userRepository,
		projectRepository:        projectRepository,
		contextTimeout:           timeout,
	}
}

func (p *projectActionUseCase) GetById(ctx context.Context, id int) ([]*domain.ProjectRequest, error) {
	ctx, cancel := context.WithTimeout(ctx, p.contextTimeout)
	defer cancel()

	return p.projectActionsRepository.Get(ctx, id)
}

func (p *projectActionUseCase) ApplyToProject(ctx context.Context, req domain.ProjectActionRequest) error {
	ctx, cancel := context.WithTimeout(ctx, p.contextTimeout)
	defer cancel()

	// get user from context
	userId := ctx.Value("user_id").(int)
	req.UserId = userId

	// check if user is already applied to the project
	requests, err := p.projectActionsRepository.GetRequstsByUserId(ctx, req.UserId)
	if err != nil {
		return err
	}
	for _, request := range requests {
		if request.ProjectId == req.ProjectId && request.RoleId == req.RoleId {
			if request.Status == "accepted" || request.Status == "pending" {
				return domain.ErrRequestAlreadyExists
			}
		}
	}
	// all checks passed, proceed to apply
	req.Status = "pending"
	err = p.projectActionsRepository.ApplyToProject(ctx, req)
	if err != nil {
		log.Error("Failed to apply to project:", err)
		return domain.ErrFaildToChangeRequestStatus
	}
	return nil
}
func (p *projectActionUseCase) CancelRequestToProject(ctx context.Context, req domain.ProjectActionRequest) error {
	ctx, cancel := context.WithTimeout(ctx, p.contextTimeout)
	defer cancel()

	// get user from context
	userId := ctx.Value("user_id").(int)
	req.UserId = userId

	// check if request exists
	requests, err := p.projectActionsRepository.GetRequstsByUserId(ctx, req.UserId)
	if err != nil {
		return err
	}
	for _, request := range requests {
		if request.ProjectId == req.ProjectId && request.Status == "pending" {
			// logic to cancel the request
			return p.projectActionsRepository.CancelRequestToProject(ctx, req)
		}
	}

	return errors.New("request not found or not in pending status")
}
func (p *projectActionUseCase) WithdrawFromProject(ctx context.Context, req domain.ProjectActionRequest) error {
	ctx, cancel := context.WithTimeout(ctx, p.contextTimeout)
	defer cancel()

	// get user from context
	userId := ctx.Value("user_id").(int)
	req.UserId = userId

	// check if request exists
	requests, err := p.projectActionsRepository.GetRequstsByUserId(ctx, req.UserId)
	if err != nil {
		return err
	}
	for _, request := range requests {
		if request.ProjectId == req.ProjectId && (request.Status == "accepted" || request.Status == "pending") {
			// logic to withdraw from the project
			return p.projectActionsRepository.WithdrawFromProject(ctx, req)
		}
	}

	return errors.New("request not found or not in accepted/pending status")
}

func (p *projectActionUseCase) ReplyToRequest(ctx context.Context, req domain.ProjectActionReplyRequest) error {
	ctx, cancel := context.WithTimeout(ctx, p.contextTimeout)
	defer cancel()

	// get user from context
	userID := ctx.Value("user_id").(int)

	// check if request exists and project belong to the user (owner)
	request, err := p.projectActionsRepository.GetRequestById(ctx, req.RequestId)
	if err != nil {
		return domain.ErrRequestNotFound
	}

	project, err := p.projectRepository.GetById(ctx, request.ProjectId)
	if err != nil {
		return domain.ErrProjectNotFound
	}
	if project.Creator.Id != userID {
		return domain.ErrUserNotAllowed
	}

	// logic to reply to the request
	return p.projectActionsRepository.ReplyToRequest(ctx, req)
}
