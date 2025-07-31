package repository

import (
	"context"

	"github.com/iemran93/devMatch/domain"
	"github.com/jmoiron/sqlx"
)

type ProjectActionsRepo interface {
	Get(ctx context.Context, id int) ([]*domain.ProjectRequest, error)
	ApplyToProject(ctx context.Context, req domain.ProjectActionRequest) error
	CancelRequestToProject(ctx context.Context, req domain.ProjectActionRequest) error
	WithdrawFromProject(ctx context.Context, req domain.ProjectActionRequest) error
	GetRequstsByUserId(ctx context.Context, userId int) ([]domain.ProjectRequest, error)
}

type ProjectActionsRepository struct {
	db *sqlx.DB
}

func NewProjectActionsRepository(db *sqlx.DB) *ProjectActionsRepository {
	return &ProjectActionsRepository{db: db}
}

func (r *ProjectActionsRepository) Get(ctx context.Context, id int) ([]*domain.ProjectRequest, error) {
	var projectRequests []*domain.ProjectRequest

	err := r.db.Select(&projectRequests, "SELECT * FROM ProjectRequest WHERE project_id = ?", id)
	if err != nil {
		return nil, err
	}

	return projectRequests, nil
}

func (r *ProjectActionsRepository) ApplyToProject(ctx context.Context, req domain.ProjectActionRequest) error {
	query := "INSERT INTO ProjectRequest (project_id, user_id, role_id, status) VALUES (?, ?, ?, ?)"
	_, err := r.db.ExecContext(ctx, query, req.ProjectId, req.UserId, req.RoleId, req.Status)
	if err != nil {
		return err
	}
	return nil
}
func (r *ProjectActionsRepository) CancelRequestToProject(ctx context.Context, req domain.ProjectActionRequest) error {
	// delete from db
	query := "DELETE FROM ProjectRequest WHERE project_id = ? AND user_id = ? AND role_id = ?"
	_, err := r.db.ExecContext(ctx, query, req.ProjectId, req.UserId, req.RoleId)
	return err
}
func (r *ProjectActionsRepository) WithdrawFromProject(ctx context.Context, req domain.ProjectActionRequest) error {
	// delete from db
	query := "DELETE FROM ProjectRequest WHERE project_id = ? AND user_id = ? AND role_id = ?"
	_, err := r.db.ExecContext(ctx, query, req.ProjectId, req.UserId, req.RoleId)
	return err
}

func (r *ProjectActionsRepository) GetRequstsByUserId(ctx context.Context, userId int) ([]domain.ProjectRequest, error) {
	var requests []domain.ProjectRequest
	query := "SELECT * FROM ProjectRequest WHERE user_id = ?"
	err := r.db.SelectContext(ctx, &requests, query, userId)
	if err != nil {
		return nil, err
	}
	return requests, nil
}

func (r *ProjectActionsRepository) ReplyToRequest(ctx context.Context, req domain.ProjectActionReplyRequest) error {
	query := "UPDATE ProjectRequest SET status = ? WHERE id = ?"
	status := "rejected"
	if req.Accepted {
		status = "accepted"
	}
	_, err := r.db.ExecContext(ctx, query, status, req.RequestId)
	if err != nil {
		return err
	}
	return nil
}

func (r *ProjectActionsRepository) GetRequestById(ctx context.Context, requestId int) (*domain.ProjectRequest, error) {
	var request domain.ProjectRequest
	query := "SELECT * FROM ProjectRequest WHERE id = ?"
	err := r.db.GetContext(ctx, &request, query, requestId)
	if err != nil {
		return nil, err
	}
	return &request, nil
}
