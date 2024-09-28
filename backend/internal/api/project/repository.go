package project

import (
	"contest/internal/db/models"
	"gorm.io/gorm"
	"log"
)

type ProjectRepository interface {
	GetProjects() ([]models.Project, error)
	CreateProject(project *models.Project) error
	UpdateProject(project *models.Project) error
	DeleteProject(ID int) error
}

type projectRepositoryImpl struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) ProjectRepository {
	return &projectRepositoryImpl{
		db: db,
	}
}
func (repo *projectRepositoryImpl) GetProjects() ([]models.Project, error) {
	var projects []models.Project
	err := repo.db.Preload("Participants").Preload("Tasks").Find(&projects).Error
	if err != nil {
		log.Fatal("Ошибка при получении проектов:", err)
	}
	return projects, err
}

func (repo *projectRepositoryImpl) CreateProject(project *models.Project) error {
	result := repo.db.Create(&project)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
func (repo *projectRepositoryImpl) UpdateProject(project *models.Project) error {
	result := repo.db.Model(&models.Project{}).Where("id = ?", project.ID).Updates(project)
	if result.Error != nil {
		return result.Error
	}
	err := repo.db.First(project, project.ID).Error
	if err != nil {
		return err
	}
	return nil
}
func (repo *projectRepositoryImpl) DeleteProject(ID int) error {
	result := repo.db.Delete(&models.Project{}, ID)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errNotFound
	}
	return nil
}
