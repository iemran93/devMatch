package domain

import (
	"context"

	"github.com/go-playground/validator/v10"
)

type ProjectRequest struct {
	Id        int    `json:"id" db:"id"`
	ProjectId int    `json:"project_id" db:"project_id"`
	UserId    int    `json:"user_id" db:"user_id"`
	RoleId    int    `json:"role_id" db:"role_id"`
	Status    string `json:"status" db:"status"`
	CreatedAt string `json:"created_at" db:"created_at"`
	UpdatedAt string `json:"updated_at" db:"updated_at"`
}

type ProjectActionRequest struct {
	ProjectId int    `json:"project_id" validate:"required"`
	UserId    int    `json:"user_id"`
	RoleId    int    `json:"role_id" validate:"required"`
	Status    string `json:"status"`
}

type ProjectActionReplyRequest struct {
	RequestId int  `json:"request_id" validate:"required"`
	Accepted  bool `json:"accepted"`
}

type ProjectActionsUseCase interface {
	GetById(ctx context.Context, id int) ([]*ProjectRequest, error)
	ApplyToProject(ctx context.Context, req ProjectActionRequest) error
	CancelRequestToProject(ctx context.Context, req ProjectActionRequest) error
	WithdrawFromProject(ctx context.Context, req ProjectActionRequest) error
	ReplyToRequest(ctx context.Context, req ProjectActionReplyRequest) error
}

func (r *ProjectActionRequest) Validate() error {
	v := validator.New()
	err := v.Struct(r)
	if err != nil {
		return err
	}
	return nil
}

func (pr *ProjectActionReplyRequest) Validate() error {
	v := validator.New()
	err := v.Struct(pr)
	if err != nil {
		return err
	}
	return nil
}
