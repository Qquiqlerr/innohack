package models

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Email    string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
}

// Модель проекта
type Project struct {
	ID           uint   `gorm:"primaryKey" json:"ID" `
	Name         string `gorm:"not null" json:"name"`
	Description  string `json:"description"`
	Participants []User `gorm:"many2many:project_participants;" json:"participants"`
	Tasks        []Task `json:"tasks" jsonschema:"required"` // Один проект может иметь несколько задач
}

// Модель задачи
type Task struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"not null"`
	Description string
	Status      string  `gorm:"type:varchar(50);not null"`
	ProjectID   uint    // Внешний ключ на проект
	Project     Project `gorm:"constraint:OnDelete:CASCADE;"` // Привязка к проекту
}
