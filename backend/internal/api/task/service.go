package task

import "contest/internal/db/models"

type Service interface {
	GetTasks(projectID *int, status *int) []models.Task
	CreateTask(task *models.Task) error
	UpdateTask(task *models.Task) error
	DeleteTask(ID int) error
}

type serviceImpl struct {
	repo Repository
}

func (s serviceImpl) GetTasks(projectID *int, status *int) []models.Task {
	return s.repo.GetTasks(projectID, status)
}

func (s serviceImpl) CreateTask(task *models.Task) error {
	return s.repo.CreateTask(task)
}

func (s serviceImpl) UpdateTask(task *models.Task) error {
	return s.repo.UpdateTask(task)
}

func (s serviceImpl) DeleteTask(ID int) error {
	return s.repo.DeleteTask(ID)
}

func NewService(repo Repository) Service {
	return serviceImpl{
		repo: repo,
	}
}
