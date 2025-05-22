// stores/processStore.js
import { create } from 'zustand';

export const useProcessStore = create((set) => ({
  processes: [],
  addProcess: (process) =>
    set((state) => ({
      processes: [...state.processes, process],
    })),
    
  removeProcess: (id) =>
    set((state) => ({
      processes: state.processes.filter((p) => p.id !== id),
    })),

  updateProcessStatus: (id, status, message) =>
    set((state) => ({
      processes: state.processes.map((process) =>
        process.id === id ? { ...process, status, message } : process
      ),
    })),
}));
