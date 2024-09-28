package task

import (
	"contest/internal/api"
	"contest/internal/db/models"
	"errors"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"log"
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

func (h *Handler) UpdateTaskHandler(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	if err := render.DecodeJSON(r.Body, &task); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Bad request"})
		return
	}
	id := chi.URLParam(r, "id")
	intid, converr := strconv.Atoi(id)
	task.ID = uint(intid)
	if err := h.service.UpdateTask(&task); err != nil {
		if errors.Is(err, api.ErrNothingToChange) {
			render.Status(r, http.StatusBadRequest)
			log.Println(err, converr)
			render.JSON(w, r, map[string]string{"error": "Nothing to change"})
			return
		}
		render.Status(r, http.StatusNotFound)
		log.Println(err)
		render.JSON(w, r, map[string]string{"error": "Project not found"})
		return
	}
	render.Status(r, http.StatusCreated)
	render.JSON(w, r, task)
}
func (h *Handler) DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		render.Status(r, http.StatusNotFound)
		log.Println(err)
		render.JSON(w, r, map[string]string{"error": "ID must be int"})
		return
	}
	err = h.service.DeleteTask(id)
	if err != nil {
		render.Status(r, http.StatusNotFound)
		log.Println(err)
		render.JSON(w, r, map[string]string{"error": "Project not found"})
		return
	}
	render.Status(r, http.StatusNoContent)
	render.JSON(w, r, struct{}{})
}
