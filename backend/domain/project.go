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

type Project struct {
	Id          int     `json:"id" db:"id"`
	Title       string  `json:"title" db:"title"`
	Description string  `json:"description" db:"description"`
	Goals       *string `json:"goals,omitempty" db:"goals"`
	CategoryId  int     `json:"category_id" db:"category_id"`
	// ProjectTypeId int       `json:"project_type_id"`
	Stage     string    `json:"stage" db:"stage"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	CreatorId int       `json:"creator_id" db:"creator_id"`
	// Technologies []int     `json:"technologies,omitempty"`
	// Languages    []int     `json:"languages,omitempty"`
}

type CreateProjectRequest struct {
	Title        string  `json:"title" validate:"required"`
	Description  string  `json:"description" validate:"required"`
	Goals        *string `json:"goals"`
	CategoryId   int     `json:"category_id" validate:"required"`
	Stage        string  `json:"stage" validate:"required,oneof=Idea 'In Progress' Completed"`
	ProjectType  []int   `json:"project_type" validate:"required"`
	Technologies []int   `json:"technologies"`
	Languages    []int   `json:"languages"`
}

type ProjectResponse struct {
	Id           int          `json:"id" db:"id"`
	Title        string       `json:"title" db:"title"`
	Description  string       `json:"description" db:"description"`
	Goals        *string      `json:"goals,omitempty" db:"goals"`
	Stage        string       `json:"stage" db:"stage"`
	CreatedAt    time.Time    `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at" db:"updated_at"`
	Creator      UserResponse `json:"creator"`
	Category     Category     `json:"category"`
	Types        []Types      `json:"types"`
	Technologies []Technology `json:"technologies"`
	Languages    []Language   `json:"languages"`
}

type ProjectRepository interface {
	Create(ctx context.Context, project *CreateProjectRequest, creator_id int) (int, error)
	GetById(ctx context.Context, id int) (*ProjectResponse, error)
	List(ctx context.Context, filters map[string]any) ([]ProjectResponse, error)
	Update(ctx context.Context, req *CreateProjectRequest, id int) error
	Delete(ctx context.Context, id int) error
}

type ProjectUseCase interface {
	Create(ctx context.Context, req *CreateProjectRequest) (*ProjectResponse, error)
	GetById(ctx context.Context, id int) (*ProjectResponse, error)
	List(ctx context.Context, filters map[string]any) ([]ProjectResponse, error)
	Update(ctx context.Context, req *CreateProjectRequest, id int) error
	Delete(ctx context.Context, id int) error
}

func (pr *CreateProjectRequest) Validate() error {
	v := validator.New()
	err := v.Struct(pr)
	if err != nil {
		return err
	}
	return nil
}
