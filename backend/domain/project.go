package domain

import (
	"context"
	"time"

	"github.com/go-playground/validator/v10"
)

type Category struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type Types struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Technology struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Language struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type ProjectRole struct {
	Id                     int    `json:"id" db:"id"`
	ProjectId              int    `json:"project_id" db:"project_id"`
	Title                  string `json:"title" db:"title"`
	Description            string `json:"description" db:"description"`
	RequiredExperienceLeve int    `json:"required_experience_level" db:"required_experience_level"`
	IsFilled               bool   `json:"is_filled" db:"is_filled"`
}

type ProjectRoleRequest struct {
	Title                  string `json:"title" validate:"required" db:"title"`
	ProjectId              int    `json:"project_id" db:"project_id"`
	Description            string `json:"description" db:"description"`
	RequiredExperienceLeve int    `json:"required_experience_level" db:"required_experience_level"`
	IsFilled               bool   `json:"is_filled" db:"if_filled"`
}

type Project struct {
	Id          int       `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Goals       *string   `json:"goals,omitempty" db:"goals"`
	CategoryId  int       `json:"category_id" db:"category_id"`
	Stage       string    `json:"stage" db:"stage"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
	CreatorId   int       `json:"creator_id" db:"creator_id"`
}

type UpdateProjectRequest struct {
	Title        string  `json:"title" validate:"required"`
	Description  string  `json:"description" validate:"required"`
	Goals        *string `json:"goals"`
	CategoryId   int     `json:"category_id" validate:"required"`
	Stage        string  `json:"stage" validate:"required,oneof=Idea 'In Progress' Completed"`
	ProjectType  []int   `json:"project_type" validate:"required"`
	Technologies []int   `json:"technologies"`
	Languages    []int   `json:"languages"`
}

type CreateProjectRequest struct {
	Title        string               `json:"title" validate:"required"`
	Description  string               `json:"description" validate:"required"`
	Goals        *string              `json:"goals"`
	CategoryId   int                  `json:"category_id" validate:"required"`
	Stage        string               `json:"stage" validate:"required,oneof=Idea 'In Progress' Completed"`
	ProjectType  []int                `json:"project_type" validate:"required"`
	Technologies []int                `json:"technologies"`
	Languages    []int                `json:"languages"`
	ProjectRoles []ProjectRoleRequest `json:"project_roles" validate:"required,dive"`
}

type ProjectResponse struct {
	Id           int           `json:"id" db:"id"`
	Title        string        `json:"title" db:"title"`
	Description  string        `json:"description" db:"description"`
	Goals        *string       `json:"goals,omitempty" db:"goals"`
	Stage        string        `json:"stage" db:"stage"`
	CreatedAt    time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time     `json:"updated_at" db:"updated_at"`
	Creator      UserResponse  `json:"creator"`
	Category     Category      `json:"category"`
	Types        []Types       `json:"types"`
	Technologies []Technology  `json:"technologies"`
	Languages    []Language    `json:"languages"`
	ProjectRoles []ProjectRole `json:"project_roles"`
}

type ProjectUseCase interface {
	Create(ctx context.Context, req *CreateProjectRequest) (*ProjectResponse, error)
	GetById(ctx context.Context, id int) (*ProjectResponse, error)
	GetByProjectId(ctx context.Context, id int) ([]*ProjectRole, error)
	List(ctx context.Context, filters map[string]any) ([]ProjectResponse, error)
	Update(ctx context.Context, req *UpdateProjectRequest, id int) error
	Delete(ctx context.Context, id int) error
	GetCategory(ctx context.Context) ([]Category, error)
	GetTechnology(ctx context.Context) ([]Technology, error)
	GetLanguage(ctx context.Context) ([]Language, error)
	GetType(ctx context.Context) ([]Types, error)
}

func (pr *CreateProjectRequest) Validate() error {
	v := validator.New()
	err := v.Struct(pr)
	if err != nil {
		return err
	}
	return nil
}

func (prr *ProjectRoleRequest) Validate() error {
	v := validator.New()
	err := v.Struct(prr)
	if err != nil {
		return err
	}
	return nil
}

func (upr *UpdateProjectRequest) Validate() error {
	v := validator.New()
	err := v.Struct(upr)
	if err != nil {
		return err
	}
	return nil
}
