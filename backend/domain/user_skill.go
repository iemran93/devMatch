package domain

import (
	"context"

	"github.com/go-playground/validator/v10"
)

type UserSkill struct {
	Id               int `db:"id" json:"id"`
	UserID           int `db:"user_id" json:"user_id"`
	TypeID           int `db:"type_id" json:"type_id"`
	TechnologyID     int `db:"technology_id" json:"technology_id"`
	LanguageID       int `db:"language_id" json:"language_id"`
	ProficiencyLevel int `db:"proficiency_level" json:"proficiency_level"`
}

type UserSkillResponse struct {
	Id               int `json:"id"`
	UserID           int `json:"user_id"`
	TypeID           int `json:"type_id"`
	TechnologyID     int `json:"technology_id"`
	LanguageID       int `json:"language_id"`
	ProficiencyLevel int `json:"proficiency_level"`
}

type UserSkillRequest struct {
	TypeID           int `json:"type_id" `
	TechnologyID     int `json:"technology_id"`
	LanguageID       int `json:"language_id"`
	ProficiencyLevel int `json:"proficiency_level" validate:"required"`
}

type UserSkillUseCase interface {
	CreateSkill(ctx context.Context, req *UserSkillRequest) (*UserSkill, error)
	GetSkillByUserId(ctx context.Context, id int)
}

func (usr *UserSkillRequest) Validate() error {
	v := validator.New()
	err := v.Struct(usr)
	if err != nil {
		return err
	}

	return nil
}
