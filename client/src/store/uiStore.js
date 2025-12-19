import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useUIStore = create(
  devtools(
    (set, get) => ({
      // Loading states
      globalLoading: false,
      loadingMessage: '',
      
      // Modal states
      isModalOpen: false,
      modalType: null,
      modalData: null,
      
      // Sidebar/Drawer states
      isSidebarOpen: false,
      
      // Toast queue (if needed)
      toastQueue: [],
      
      // Theme (if needed in future)
      theme: 'light',
      
      // Actions
      setGlobalLoading: (loading, message = '') => set({
        globalLoading: loading,
        loadingMessage: message
      }),
      
      openModal: (type, data = null) => set({
        isModalOpen: true,
        modalType: type,
        modalData: data
      }),
      
      closeModal: () => set({
        isModalOpen: false,
        modalType: null,
        modalData: null
      }),
      
      toggleSidebar: () => set((state) => ({
        isSidebarOpen: !state.isSidebarOpen
      })),
      
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'UIStore' }
  )
);

export default useUIStore;

