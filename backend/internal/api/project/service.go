package project

import (
	"contest/internal/db/models"
)

type ProjectService interface {
	GetProjects() ([]models.Project, error)
	CreateProject(project *models.Project) error
	UpdateProject(project *models.Project) error
	DeleteProject(ID int) error
}

type projectService struct {
	repo ProjectRepository
}

func (p *projectService) GetProjects() ([]models.Project, error) {
	return p.repo.GetProjects()
}

func (p *projectService) CreateProject(project *models.Project) error {
	return p.repo.CreateProject(project)
}

func (p *projectService) UpdateProject(project *models.Project) error {
	if project.Description == "" && project.Name == "" {
		return errNothingToChange
	}
	return p.repo.UpdateProject(project)
}

func (p *projectService) DeleteProject(ID int) error {
	return p.repo.DeleteProject(ID)
}

func NewProjectService(repo ProjectRepository) ProjectService {
	return &projectService{repo: repo}
}
