import { create } from "zustand";

const useDashboardStore = create((set) => ({
  userProjects: [],
  projectsLoading: true,
  updateUserProjects: (projects) => set({ userProjects: projects }),
  updateProjectsLoading: (update) => set({ projectsLoading: update }),
}));

export default useDashboardStore;
