import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
  id: number;
  name: string;
  description: string;
}

interface Project {
  id: number;
  name: string;
  tasks: Task[];
}

export interface ProjectsState {
  userProjects: Project[];
}

const initialState: ProjectsState = {
  userProjects: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.userProjects = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.userProjects.push(action.payload);
    },
    addTask: (
      state,
      action: PayloadAction<{ projectId: number; task: Task }>,
    ) => {
      const { projectId, task } = action.payload;
      const project = state.userProjects.find((proj) => proj.id === projectId);

      if (project) {
        project.tasks.push(task);
      }
    },
  },
});

export const { setProjects, addProject, addTask } = projectsSlice.actions;

export default projectsSlice.reducer;
