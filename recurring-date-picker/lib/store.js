import { create } from 'zustand'

export const useDateStore = create((set) => ({
  startDate: undefined,
  endDate: undefined,
  recurrenceType: 'daily',
  interval: 1,
  selectedDays: [],
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setRecurrenceType: (type) => set({ recurrenceType: type }),
  setInterval: (interval) => set({ interval }),
  toggleDay: (day) => set((state) => ({
    selectedDays: state.selectedDays.includes(day)
      ? state.selectedDays.filter((d) => d !== day)
      : [...state.selectedDays, day]
  }))
}))