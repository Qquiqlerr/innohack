package task

import (
	"contest/internal/db/models"
	"github.com/go-chi/render"
	"net/http"
	"strconv"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) GetTasksHandler(w http.ResponseWriter, r *http.Request) {
	var (
		projectID *int
		status    *int
	)
	val, err := strconv.Atoi(r.URL.Query().Get("projectID"))
	if err != nil {
		projectID = nil
	} else {
		projectID = &val
	}
	val, err = strconv.Atoi(r.URL.Query().Get("status"))
	if err != nil {
		status = nil
	} else {
		status = &val
	}
	tasks := h.service.GetTasks(projectID, status)
	if tasks == nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": "Internal Server Error"})
		return
	}
	render.JSON(w, r, tasks)
}

func (h *Handler) CreateTaskHandler(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	if err := render.DecodeJSON(r.Body, &task); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Bad request"})
		return
	}
	if err := h.service.CreateTask(&task); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Bad request"})
		return
	}
	render.Status(r, http.StatusCreated)
	render.JSON(w, r, task)
}
