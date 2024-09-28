package project

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
	service ProjectService
}

func NewProjectHandler(service ProjectService) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) GetProjectsHandler(w http.ResponseWriter, r *http.Request) {
	resp, err := h.service.GetProjects()
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": "Internal Server Error"})
		return
	}
	render.JSON(w, r, resp)
}

func (h *Handler) CreateProjectHandler(w http.ResponseWriter, r *http.Request) {
	var project models.Project
	if err := render.DecodeJSON(r.Body, &project); err != nil {
		render.Status(r, http.StatusBadRequest)
		log.Println(err)
		render.JSON(w, r, map[string]string{"error": "Bad Request"})
	}
	if err := h.service.CreateProject(&project); err != nil {
		render.Status(r, http.StatusBadRequest)
		log.Println(err)
		render.JSON(w, r, map[string]string{"error": "Bad Request"})
	}
	render.Status(r, http.StatusCreated)
	render.JSON(w, r, project)
}

func (h *Handler) UpdateProjectHandler(w http.ResponseWriter, r *http.Request) {
	var project models.Project
	id := chi.URLParam(r, "id")
	intid, converr := strconv.Atoi(id)
	if err := render.DecodeJSON(r.Body, &project); err != nil || converr != nil {
		render.Status(r, http.StatusBadRequest)
		log.Println(err, converr)
		render.JSON(w, r, map[string]string{"error": "Bad Request"})
		return
	}

	project.ID = uint(intid)
	if err := h.service.UpdateProject(&project); err != nil {
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
	render.JSON(w, r, project)
}

func (h *Handler) DeleteProjectHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		render.Status(r, http.StatusNotFound)
		log.Println(err)
		render.JSON(w, r, map[string]string{"error": "ID must be int"})
		return
	}
	err = h.service.DeleteProject(id)
	if err != nil {
		render.Status(r, http.StatusNotFound)
		log.Println(err)
		render.JSON(w, r, map[string]string{"error": "Project not found"})
		return
	}
	render.Status(r, http.StatusNoContent)
	render.JSON(w, r, struct{}{})
}
