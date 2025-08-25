package repository

import (
	"context"

	"github.com/iemran93/devMatch/domain"
	"github.com/jmoiron/sqlx"
)

type userSkillRepository struct {
	db *sqlx.DB
}

type UserSkillRepository interface {
	CreateSkill(ctx context.Context, us *domain.UserSkill) (*domain.UserSkill, error)
	GetSkillByUserId(ctx context.Context, id int) (*domain.UserSkill, error)
	List(ctx context.Context) ([]*domain.UserSkill, error)
}

func NewUserSkillRepository(db *sqlx.DB) UserSkillRepository {
	&userSkillRepository{
		db: db,
	}
}

func (usr *userRepository) CreateSkill(ctx context.Context, us *domain.UserSkill) (*domain.UserSkill, error) {
	tx, err := usr.db.BeginTxx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	result, err := tx.NamedExec(`INSERT INTO UserSkill (user_id, type_id, technology_id, language_id, proficincy_level)
		VALUES (:user_id, :type_id, :technology_id, :language_id, :proficincy_level)`, us)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	us.Id = int(id)

	tx.Commit()
	return us, nil
}

func (usr *userRepository) GetSkillByUserId(ctx context.Context, id int) (*domain.UserSkill, error) {
	userSkill := domain.UserSkill{}
	err := usr.db.Get(&userSkill, `SELECT * FROM UserSkill WHERE id = ?`, id)
	if err != nil {
		return nil, err
	}

	return &userSkill, nil
}

func (usr *userRepository) List(ctx context.Context) ([]*domain.UserSkill, error) {
	rows, err := usr.db.QueryContext(ctx, `SELECT * FROM UserSkill`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	usersSkill := []*domain.UserSkill{}
	for rows.Next() {
		userSkill := &domain.UserSkill{}
		err := rows.Scan(&userSkill.Id, &userSkill.UserID, &userSkill.TypeID,
			&userSkill.TechnologyID, &userSkill.LanguageID, &userSkill.ProficiencyLevel)
		if err != nil {
			return nil, err
		}
		usersSkill = append(usersSkill, userSkill)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return usersSkill, nil
}
