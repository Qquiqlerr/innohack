import { createSlice } from "@reduxjs/toolkit";
import { Project } from "api/fetchers/projectManagerSchemas";

import {
  addTaskToProject,
  createNewProject,
  fetchProjects,
  updateTaskData,
} from "./projectThunks";

// Define the ProjectsState interface for Redux storage
export interface ProjectsState {
  projectsList: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
// const initialState: ProjectsState = {
//   projectsList: [],
//   currentProject: null,
//   isLoading: false,
//   error: null,
// };

// Initial state
const initialState: ProjectsState = {
  projectsList: [
    {
      id: 2,
      name: "test",
      description: "fsldnfglsdngls",
      // participants: [],
      tasks: [
        {
          id: 1,
          name: "Set up environment",
          description: "Set up the development environment for the project",
          status: 0, // 0 - Pending
          project_id: 2,
        },
        {
          id: 2,
          name: "Create database schema",
          description: "Design the initial schema for the project's database",
          status: 1, // 1 - In progress
          project_id: 2,
        },
        {
          id: 3,
          name: "Implement authentication",
          description: "Implement user login and registration functionality",
          status: 2, // 2 - Completed
          project_id: 2,
        },
        {
          id: 4,
          name: "Set up CI/CD",
          description: "Configure continuous integration and deployment",
          status: 0, // 0 - Pending
          project_id: 2,
        },
      ],
    },
    {
      id: 3,
      name: "aefaefa",
      description: "fsldsfgsfs",
      // participants: [],
      tasks: [
        {
          id: 1,
          name: "Create project documentation",
          description: "Prepare the initial project documentation",
          status: 0, // 0 - Pending
          project_id: 3,
        },
        {
          id: 2,
          name: "Build front-end structure",
          description:
            "Start structuring the React front-end with basic components",
          status: 1, // 1 - In progress
          project_id: 3,
        },
        {
          id: 3,
          name: "Connect to API",
          description:
            "Connect the existing front-end structure to the back-end API",
          status: 1, // 1 - In progress
          project_id: 3,
        },
        {
          id: 4,
          name: "Test API Endpoints",
          description:
            "Ensure that all API endpoints are functioning as expected",
          status: 0, // 0 - Pending
          project_id: 3,
        },
        {
          id: 5,
          name: "Optimize routing",
          description:
            "Optimize the client-side routing for better performance",
          status: 2, // 2 - Completed
          project_id: 3,
        },
      ],
    },
  ],
  currentProject: null,
  isLoading: false,
  error: null,
};

// Create the projects slice
const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // Define local reducers if needed (such as clearing state)
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    // Fetching all projects
    builder.addCase(fetchProjects.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projectsList = action.payload; // Populate projects list
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Creating a new project
    builder.addCase(createNewProject.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createNewProject.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projectsList.push(action.payload); // Add new project to the list
    });
    builder.addCase(createNewProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Adding task to a project
    builder.addCase(addTaskToProject.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addTaskToProject.fulfilled, (state, action) => {
      state.isLoading = false;
      // Replace the updated project with the new one
      const updatedProject = action.payload;

      state.projectsList = state.projectsList.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      );
    });
    builder.addCase(addTaskToProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateTaskData.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTaskData.fulfilled, (state, action) => {
      state.isLoading = false;
      const updatedTask = action.payload;

      state.projectsList = state.projectsList.map((project) =>
        project.id === updatedTask.project_id
          ? {
              ...project,
              tasks:
                project.tasks?.map((task) =>
                  task.id === updatedTask.id ? updatedTask : task,
                ) ?? [],
            }
          : project,
      );
    });
    builder.addCase(updateTaskData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

// Export the actions created by createSlice
export const { clearCurrentProject } = projectsSlice.actions;

// Export the reducer to be included in the store
export default projectsSlice.reducer;
