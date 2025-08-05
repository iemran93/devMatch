package repository

import (
	"context"

	"github.com/iemran93/devMatch/domain"
	"github.com/jmoiron/sqlx"
)

type ProjectRolesRepository struct {
	db *sqlx.DB
}

type ProjectRolesInterface interface {
	Create(ctx context.Context, req *domain.ProjectRoleRequest) (*domain.ProjectRole, error)
	Get(ctx context.Context, id int) (*domain.ProjectRole, error)
	// id is role id /{id}
	Update(ctx context.Context, req *domain.ProjectRoleRequest, id int) (*domain.ProjectRole, error)
	Delete(ctx context.Context, id int) error
}

func NewProjectRolesRepository(db *sqlx.DB) ProjectRolesInterface {
	return &ProjectRolesRepository{
		db: db,
	}
}

func (prr *ProjectRolesRepository) Create(ctx context.Context, req *domain.ProjectRoleRequest) (*domain.ProjectRole, error) {
	tx, err := prr.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	pr := domain.ProjectRole{
		ProjectId:              req.ProjectId,
		Title:                  req.Title,
		Description:            req.Description,
		RequiredExperienceLeve: req.RequiredExperienceLeve,
		IsFilled:               false,
	}

	result, err := tx.ExecContext(ctx, `INSERT INTO ProjectRole (project_id, title, description, required_experience_level, is_filled)
		VALUES (?, ?, ?, ?, ?)`,
		pr.ProjectId, pr.Title, pr.Description, pr.RequiredExperienceLeve, pr.IsFilled)

	if err != nil {
		return nil, err
	}

	roleId, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	pr.Id = int(roleId)

	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return &pr, nil
}

func (prr *ProjectRolesRepository) Get(ctx context.Context, id int) (*domain.ProjectRole, error) {
	var pr domain.ProjectRole

	query := `SELECT * FROM ProjectRole WHERE id=?`
	err := prr.db.GetContext(ctx, &pr, query, id)
	if err != nil {
		return nil, err
	}

	return &pr, nil
}

func (prr *ProjectRolesRepository) Update(ctx context.Context, req *domain.ProjectRoleRequest, id int) (*domain.ProjectRole, error) {
	tx, err := prr.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	query := `UPDATE ProjectRole SET title=?, description=?, required_experience_level=?, is_filled=? WHERE id=?`

	_, err = tx.ExecContext(ctx, query, req.Title, req.Description, req.RequiredExperienceLeve, req.IsFilled, id)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	var pr = domain.ProjectRole{
		Id:                     id,
		ProjectId:              req.ProjectId,
		Title:                  req.Title,
		Description:            req.Description,
		RequiredExperienceLeve: req.RequiredExperienceLeve,
		IsFilled:               req.IsFilled,
	}

	return &pr, nil
}

func (prr *ProjectRolesRepository) Delete(ctx context.Context, id int) error {
	tx, err := prr.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer tx.Rollback()

	_, err = tx.ExecContext(ctx, `DELETE FROM ProjectRole WHERE id=?`, id)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
