package domain

import "context"

// project roles domain
type ProjectRolesUseCase interface {
	Create(ctx context.Context, req *ProjectRoleRequest) (*ProjectRole, error)
	Update(ctx context.Context, req *ProjectRoleRequest, id int) (*ProjectRole, error)
	Delete(ctx context.Context, id int) error
}
