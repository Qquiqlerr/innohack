import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createProject,
  createTask,
  getAllProjects,
  updateTask,
} from "../../../api/fetchers/projectManagerComponents";
import { Project, Task } from "../../../api/fetchers/projectManagerSchemas";

// Fetch all projects from the API
export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetchProjects",
  async (_, thunkAPI) => {
    try {
      const response = await getAllProjects();

      return response; // This should match the Project[] shape
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch projects");
    }
  },
);

// Create a new project
export const createNewProject = createAsyncThunk<Project, Project>(
  "projects/createProject",
  async ({ name, description }, thunkAPI) => {
    try {
      const response = await createProject({
        body: { name, description, tasks: [] },
      });

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to create project");
    }
  },
);

// Add a Task to an existing project
export const addTaskToProject = createAsyncThunk<
  Task,
  { projectId: number; task: Omit<Task, "project_id"> } // Task without `id` initially
>("projects/addTaskToProject", async ({ projectId, task }, thunkAPI) => {
  try {
    const response = await createTask({
      body: {
        project_id: projectId,
        name: task.name,
        description: task.description,
      },
    });

    return response; // Returns the updated project containing the new task
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to add task to project");
  }
});

// Add a Task to an existing project
export const updateTaskData = createAsyncThunk<
  Task,
  { taskId: number; newStatus: NonNullable<Task["status"]> }
>("projects/addTaskToProject", async ({ taskId, newStatus }, thunkAPI) => {
  try {
    const response = await updateTask({
      pathParams: { id: taskId },
      body: { status: newStatus },
    });

    return response; // Returns the updated project containing the new task
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to add task to project");
  }
});
