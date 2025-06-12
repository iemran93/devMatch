package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/iemran93/devMatch/domain"
	"github.com/jmoiron/sqlx"
)

type projectRepository struct {
	db *sqlx.DB
}

func NewProjectRepository(db *sqlx.DB) domain.ProjectRepository {
	return &projectRepository{
		db: db,
	}
}

func (r *projectRepository) Create(ctx context.Context, project *domain.Project) error {
	tx, err := r.db.Beginx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Set timestamps
	now := time.Now()
	project.CreatedAt = now
	project.UpdatedAt = now

	// Insert project
	result, err := tx.NamedExec(`
		INSERT INTO Project (
			title, description, goals, category_id, project_type_id,
			stage, created_at, updated_at, creator_id
		) VALUES (
			:title, :description, :goals, :category_id, :project_type_id,
			:stage, :created_at, :updated_at, :creator_id
		)
	`, project)
	if err != nil {
		return err
	}

	projectId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	// Insert technologies
	if len(project.Technologies) > 0 {
		for _, techId := range project.Technologies {
			_, err = tx.Exec(`
				INSERT INTO ProjectTechnology (project_id, technology_id)
				VALUES (?, ?)
			`, projectId, techId)
			if err != nil {
				return err
			}
		}
	}

	// Insert languages
	if len(project.Languages) > 0 {
		for _, langId := range project.Languages {
			_, err = tx.Exec(`
				INSERT INTO ProjectLanguage (project_id, language_id)
				VALUES (?, ?)
			`, projectId, langId)
			if err != nil {
				return err
			}
		}
	}

	return tx.Commit()
}

func (r *projectRepository) GetById(ctx context.Context, id int) (*domain.ProjectResponse, error) {
	var project domain.ProjectResponse

	// Get project basic info
	err := r.db.Get(&project, `
		SELECT 
			p.*,
			u.id as "creator.id",
			u.name as "creator.name",
			u.email as "creator.email",
			u.profile_picture as "creator.profile_picture"
		FROM Project p
		JOIN User u ON p.creator_id = u.id
		WHERE p.id = ?
	`, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	// Get technologies
	err = r.db.Select(&project.Technologies, `
		SELECT t.*
		FROM Technology t
		JOIN ProjectTechnology pt ON t.id = pt.technology_id
		WHERE pt.project_id = ?
	`, id)
	if err != nil {
		return nil, err
	}

	// Get languages
	err = r.db.Select(&project.Languages, `
		SELECT l.*
		FROM Language l
		JOIN ProjectLanguage pl ON l.id = pl.language_id
		WHERE pl.project_id = ?
	`, id)
	if err != nil {
		return nil, err
	}

	return &project, nil
}

func (r *projectRepository) List(ctx context.Context, filters map[string]interface{}) ([]domain.ProjectResponse, error) {
	var projects []domain.ProjectResponse

	query := `
		SELECT DISTINCT
			p.*,
			u.id as "creator.id",
			u.name as "creator.name",
			u.email as "creator.email",
			u.profile_picture as "creator.profile_picture"
		FROM Project p
		JOIN User u ON p.creator_id = u.id
	`

	// Build WHERE clause based on filters
	whereClause := ""
	args := []interface{}{}

	if stage, ok := filters["stage"].(string); ok {
		if whereClause == "" {
			whereClause = " WHERE "
		} else {
			whereClause += " AND "
		}
		whereClause += "p.stage = ?"
		args = append(args, stage)
	}

	if projectType, ok := filters["project_type_id"].(int); ok {
		if whereClause == "" {
			whereClause = " WHERE "
		} else {
			whereClause += " AND "
		}
		whereClause += "p.project_type_id = ?"
		args = append(args, projectType)
	}

	if categoryId, ok := filters["category_id"].(int); ok {
		if whereClause == "" {
			whereClause = " WHERE "
		} else {
			whereClause += " AND "
		}
		whereClause += "p.category_id = ?"
		args = append(args, categoryId)
	}

	query += whereClause + " ORDER BY p.created_at DESC"

	// Execute the query
	err := r.db.Select(&projects, query, args...)
	if err != nil {
		return nil, err
	}

	// For each project, get its technologies and languages
	for i := range projects {
		// Get technologies
		err = r.db.Select(&projects[i].Technologies, `
			SELECT t.*
			FROM Technology t
			JOIN ProjectTechnology pt ON t.id = pt.technology_id
			WHERE pt.project_id = ?
		`, projects[i].Id)
		if err != nil {
			return nil, err
		}

		// Get languages
		err = r.db.Select(&projects[i].Languages, `
			SELECT l.*
			FROM Language l
			JOIN ProjectLanguage pl ON l.id = pl.language_id
			WHERE pl.project_id = ?
		`, projects[i].Id)
		if err != nil {
			return nil, err
		}
	}

	return projects, nil
}

func (r *projectRepository) Update(ctx context.Context, project *domain.Project) error {
	tx, err := r.db.Beginx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	project.UpdatedAt = time.Now()

	// Update project
	_, err = tx.NamedExec(`
		UPDATE Project SET
			title = :title,
			description = :description,
			goals = :goals,
			category_id = :category_id,
			project_type_id = :project_type_id,
			stage = :stage,
			updated_at = :updated_at
		WHERE id = :id
	`, project)
	if err != nil {
		return err
	}

	// Update technologies
	_, err = tx.Exec("DELETE FROM ProjectTechnology WHERE project_id = ?", project.Id)
	if err != nil {
		return err
	}

	if len(project.Technologies) > 0 {
		for _, techId := range project.Technologies {
			_, err = tx.Exec(`
				INSERT INTO ProjectTechnology (project_id, technology_id)
				VALUES (?, ?)
			`, project.Id, techId)
			if err != nil {
				return err
			}
		}
	}

	// Update languages
	_, err = tx.Exec("DELETE FROM ProjectLanguage WHERE project_id = ?", project.Id)
	if err != nil {
		return err
	}

	if len(project.Languages) > 0 {
		for _, langId := range project.Languages {
			_, err = tx.Exec(`
				INSERT INTO ProjectLanguage (project_id, language_id)
				VALUES (?, ?)
			`, project.Id, langId)
			if err != nil {
				return err
			}
		}
	}

	return tx.Commit()
}

func (r *projectRepository) Delete(ctx context.Context, id int) error {
	tx, err := r.db.Beginx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Delete related records first
	_, err = tx.Exec("DELETE FROM ProjectTechnology WHERE project_id = ?", id)
	if err != nil {
		return err
	}

	_, err = tx.Exec("DELETE FROM ProjectLanguage WHERE project_id = ?", id)
	if err != nil {
		return err
	}

	// Delete project
	_, err = tx.Exec("DELETE FROM Project WHERE id = ?", id)
	if err != nil {
		return err
	}

	return tx.Commit()
}
