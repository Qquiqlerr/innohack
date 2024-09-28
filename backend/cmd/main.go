package main

import (
	"contest/internal/api/project"
	"contest/internal/db"
	"contest/internal/db/models"
	"github.com/go-chi/chi/v5"
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

	router := chi.NewRouter()
	router.Get("/projects", projectHandler.GetProjectsHandler)
	router.Post("/projects", projectHandler.CreateProjectHandler)
	router.Post("/projects/{id}", projectHandler.UpdateProjectHandler)
	router.Delete("/projects/{id}", projectHandler.DeleteProjectHandler)

	serv := http.Server{
		Addr:    "0.0.0.0:80",
		Handler: router,
	}
	if err := serv.ListenAndServe(); err != nil {
		log.Fatal("Server stopped")
	}
}
