package domain

import (
	"context"
	"time"
)

type Technology struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	CategoryId int    `json:"category_id"`
}

type Language struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Project struct {
	Id            int       `json:"id"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	Goals         *string   `json:"goals,omitempty"`
	CategoryId    int       `json:"category_id"`
	ProjectTypeId int       `json:"project_type_id"`
	Stage         string    `json:"stage"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	CreatorId     int       `json:"creator_id"`
	Technologies  []int     `json:"technologies,omitempty"`
	Languages     []int     `json:"languages,omitempty"`
}

type CreateProjectRequest struct {
	Title         string  `json:"title" validate:"required"`
	Description   string  `json:"description" validate:"required"`
	Goals         *string `json:"goals"`
	CategoryId    int     `json:"category_id" validate:"required"`
	ProjectTypeId int     `json:"project_type_id" validate:"required"`
	Stage         string  `json:"stage" validate:"required,oneof=Idea 'In Progress' Completed"`
	Technologies  []int   `json:"technologies"`
	Languages     []int   `json:"languages"`
}

type ProjectResponse struct {
	Id            int          `json:"id"`
	Title         string       `json:"title"`
	Description   string       `json:"description"`
	Goals         *string      `json:"goals,omitempty"`
	CategoryId    int          `json:"category_id"`
	ProjectTypeId int          `json:"project_type_id"`
	Stage         string       `json:"stage"`
	CreatedAt     time.Time    `json:"created_at"`
	UpdatedAt     time.Time    `json:"updated_at"`
	Creator       User         `json:"creator"`
	Technologies  []Technology `json:"technologies"`
	Languages     []Language   `json:"languages"`
}

type ProjectRepository interface {
	Create(ctx context.Context, project *Project) error
	GetById(ctx context.Context, id int) (*ProjectResponse, error)
	List(ctx context.Context, filters map[string]interface{}) ([]ProjectResponse, error)
	Update(ctx context.Context, project *Project) error
	Delete(ctx context.Context, id int) error
}

type ProjectUseCase interface {
	Create(ctx context.Context, req *CreateProjectRequest) error
	GetById(ctx context.Context, id int) (*ProjectResponse, error)
	List(ctx context.Context, filters map[string]interface{}) ([]ProjectResponse, error)
	Update(ctx context.Context, project *Project) error
	Delete(ctx context.Context, id int) error
}
