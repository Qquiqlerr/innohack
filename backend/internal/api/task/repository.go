package task

import (
	"contest/internal/api"
	"contest/internal/db/models"
	"gorm.io/gorm"
)

type Repository interface {
	GetTasks(projectID *int, status *int) []models.Task
	CreateTask(task *models.Task) error
	UpdateTask(task *models.Task) error
	DeleteTask(ID int) error
}

type taskRepositoryImpl struct {
	db *gorm.DB
}

func (t taskRepositoryImpl) GetTasks(projectID *int, status *int) []models.Task {
	var tasks []models.Task
	query := t.db.Model(&models.Task{})
	if projectID != nil {
		query = query.Where("project_id = ?", projectID)
	}
	if status != nil {
		query = query.Where("status = ?", status)
	}
	if err := query.Find(&tasks).Error; err != nil {
		return nil
	}

	return tasks
}

func (t taskRepositoryImpl) CreateTask(task *models.Task) error {
	result := t.db.Create(&task)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (t taskRepositoryImpl) UpdateTask(task *models.Task) error {
	result := t.db.Model(&models.Task{}).Where("id = ?", task.ID).Updates(task)
	if result.Error != nil {
		return result.Error
	}
	err := t.db.First(task, task.ID).Error
	if err != nil {
		return err
	}
	if result.RowsAffected == 0 {
		return api.ErrNothingToChange
	}
	return nil
}

func (t taskRepositoryImpl) DeleteTask(ID int) error {
	result := t.db.Delete(&models.Task{}, ID)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return api.ErrNotFound
	}
	return nil
}

func NewTaskRepository(db *gorm.DB) Repository {
	return &taskRepositoryImpl{
		db: db,
	}
}
