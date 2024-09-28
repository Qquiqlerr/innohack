package main

import (
	"contest/internal/api/project"
	"contest/internal/api/task"
	"contest/internal/db"
	"contest/internal/db/models"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"log"
	"net/http"
)

func main() {
	connect, err := db.Connect()
	if err != nil {
		panic("Can't connect to database")
	}
	err = connect.AutoMigrate(&models.User{}, &models.Project{}, &models.Task{})
	if err != nil {
		log.Fatal("Миграция не удалась:", err)
	}
	log.Println("Миграции успешно выполнены")

	projectRepo := project.NewProjectRepository(connect)
	projectService := project.NewProjectService(projectRepo)
	projectHandler := project.NewProjectHandler(projectService)

	taskRepo := task.NewTaskRepository(connect)
	taskService := task.NewService(taskRepo)
	taskHandler := task.NewHandler(taskService)

	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://localhost:5173"},       // Разрешенные источники
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"}, // Разрешенные методы
		AllowedHeaders:   []string{"Content-Type"},                 // Разрешенные заголовки
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true, // Разрешить использование учетных данных
		MaxAge:           300,  // Максимальное время кэширования CORS
	}))
	router.Get("/projects", projectHandler.GetProjectsHandler)
	router.Post("/projects", projectHandler.CreateProjectHandler)
	router.Put("/projects/{id}", projectHandler.UpdateProjectHandler)
	router.Delete("/projects/{id}", projectHandler.DeleteProjectHandler)

	router.Get("/tasks", taskHandler.GetTasksHandler)
	router.Post("/tasks", taskHandler.CreateTaskHandler)
	router.Put("/tasks/{id}", taskHandler.UpdateTaskHandler)
	router.Delete("/tasks/{id}", taskHandler.DeleteTaskHandler)

	serv := http.Server{
		Addr:    "0.0.0.0:80",
		Handler: router,
	}
	if err := serv.ListenAndServe(); err != nil {
		log.Fatal("Server stopped")
	}
}
