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

func (r *projectRepository) Create(ctx context.Context, req *domain.CreateProjectRequest, creator_id int) (int, error) {
	tx, err := r.db.Beginx()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	project := domain.Project{
		Title:       req.Title,
		Description: req.Description,
		Goals:       req.Goals,
		CategoryId:  req.CategoryId,
		Stage:       req.Stage,
		CreatorId:   creator_id,
	}

	// Set timestamps
	now := time.Now()
	project.CreatedAt = now
	project.UpdatedAt = now

	// Insert project
	result, err := tx.NamedExec(`
		INSERT INTO Project (
			title, description, goals, category_id,
			stage, created_at, updated_at, creator_id
		) VALUES (
			:title, :description, :goals, :category_id,
			:stage, :created_at, :updated_at, :creator_id
		)
	`, project)
	if err != nil {
		return 0, err
	}

	projectId, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	// Insert technologies
	if len(req.Technologies) > 0 {
		for _, techId := range req.Technologies {
			_, err = tx.Exec(`
				INSERT INTO ProjectTechnology (project_id, technology_id)
				VALUES (?, ?)
			`, projectId, techId)
			if err != nil {
				return 0, err
			}
		}
	}

	// Insert languages
	if len(req.Languages) > 0 {
		for _, langId := range req.Languages {
			_, err = tx.Exec(`
				INSERT INTO ProjectLanguage (project_id, language_id)
				VALUES (?, ?)
			`, projectId, langId)
			if err != nil {
				return 0, err
			}
		}
	}

	// insert types
	if len(req.ProjectType) > 0 {
		for _, typeId := range req.ProjectType {
			_, err = tx.Exec(`
				INSERT INTO ProjectType (project_id, type_id)
				VALUES (?, ?)
			`, projectId, typeId)
			if err != nil {
				return 0, err
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		return 0, err
	}

	return int(projectId), nil
}

func (r *projectRepository) GetById(ctx context.Context, id int) (*domain.ProjectResponse, error) {
	var project domain.ProjectResponse

	// Get project basic info
	err := r.db.Get(&project, `
		SELECT 
			p.id,
			p.title,
			p.description,
			p.goals,
			p.stage,
			p.created_at,
			p.updated_at,
			u.id as "creator.id",
			u.name as "creator.name",
			u.email as "creator.email",
			c.id as "category.id",
			c.name as "category.name"
		FROM Project p
		JOIN User u ON p.creator_id = u.id
		JOIN Category c ON p.category_id = c.id
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

	// get types
	err = r.db.Select(&project.Types, `
			SELECT t.*
			FROM Types t
			JOIN ProjectType pt ON t.id = pt.type_id
			WHERE pt.project_id = ?
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
			p.id, p.title, p.description, p.goals, p.stage, p.created_at, p.updated_at, p.creator_id, p.category_id,
			u.id as user_id, u.name as user_name, u.email as user_email,
			c.id as category_id, c.name as category_name
		FROM Project p
		JOIN User u ON p.creator_id = u.id
		JOIN Category c ON p.category_id = c.id
	`

	// Add JOIN for project_type_id filter if needed
	if _, ok := filters["project_type_id"].(int); ok {
		query += " JOIN ProjectType pt ON p.id = pt.project_id"
	}

	// Build WHERE clause (keep your existing logic)
	whereClause := ""
	args := []any{}

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
		whereClause += "pt.type_id = ?" // Changed this line
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

	// Execute the query (you'll need to handle the scanning differently due to aliases)
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var project domain.ProjectResponse
		var userId int
		var userName, userEmail string
		var categoryId int
		var categoryName string

		err = rows.Scan(
			&project.Id, &project.Title, &project.Description, &project.Goals,
			&project.Stage, &project.CreatedAt, &project.UpdatedAt, &project.Creator.Id, &categoryId,
			&userId, &userName, &userEmail, &categoryId, &categoryName,
		)
		if err != nil {
			return nil, err
		}

		project.Creator = domain.UserResponse{Id: userId, Name: userName, Email: userEmail}
		project.Category = domain.Category{Id: categoryId, Name: categoryName}
		projects = append(projects, project)
	}

	// get technologies, languages, types
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

		// get types
		err = r.db.Select(&projects[i].Types, `
			SELECT t.*
			FROM Types t
			JOIN ProjectType pt ON t.id = pt.type_id
			WHERE pt.project_id = ?
			`, projects[i].Id)
		if err != nil {
			return nil, err
		}
	}

	return projects, nil
}

func (r *projectRepository) Update(ctx context.Context, req *domain.CreateProjectRequest, id int) error {
	tx, err := r.db.Beginx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	project := domain.Project{
		Id:          id,
		Title:       req.Title,
		Description: req.Description,
		Goals:       req.Goals,
		CategoryId:  req.CategoryId,
		Stage:       req.Stage,
		UpdatedAt:   time.Now(),
	}

	// Insert project
	_, err = tx.NamedExec(`
		UPDATE Project SET
			title = :title,
			description = :description,
			goals = :goals,
			category_id = :category_id,
			stage = :stage,
			updated_at = :updated_at
		WHERE id = :id
	`, project)
	if err != nil {
		return err
	}

	_, err = tx.Exec("DELETE FROM ProjectTechnology WHERE project_id = ?", id)
	if err != nil {
		return err
	}

	// update technologies
	if len(req.Technologies) > 0 {
		for _, techId := range req.Technologies {
			_, err = tx.Exec(`
				INSERT INTO ProjectTechnology (project_id, technology_id)
				VALUES (?, ?)
			`, id, techId)
			if err != nil {
				return err
			}
		}
	}

	// Update languages
	_, err = tx.Exec("DELETE FROM ProjectLanguage WHERE project_id = ?", id)
	if err != nil {
		return err
	}

	if len(req.Languages) > 0 {
		for _, langId := range req.Languages {
			_, err = tx.Exec(`
				INSERT INTO ProjectLanguage (project_id, language_id)
				VALUES (?, ?)
			`, id, langId)
			if err != nil {
				return err
			}
		}
	}

	// Update types
	_, err = tx.Exec("DELETE FROM ProjectType WHERE project_id = ?", id)
	if err != nil {
		return err
	}

	if len(req.ProjectType) > 0 {
		for _, typeId := range req.ProjectType {
			_, err = tx.Exec(`
				INSERT INTO ProjectType (project_id, type_id)
				VALUES (?, ?)
			`, id, typeId)
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

	_, err = tx.Exec("DELETE FROM ProjectType WHERE project_id = ?", id)
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
