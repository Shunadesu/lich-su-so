import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAdminStore = create(
  devtools(
    (set, get) => ({
      // Content management state
      contents: [],
      contentLoading: false,
      contentFilters: {
        category: null,
        subCategory: null,
        search: '',
        isApproved: null,
        author: null,
      },
      contentPagination: {
        currentPage: 1,
        totalPages: 1,
      },
      
      // User management state
      users: [],
      userLoading: false,
      userFilters: {
        search: '',
        role: null,
        isActive: null,
      },
      userPagination: {
        currentPage: 1,
        totalPages: 1,
      },
      
      // Selected items
      selectedContent: null,
      selectedUser: null,
      
      // Actions - Content
      setContents: (contents) => set({ contents }),
      setContentLoading: (loading) => set({ contentLoading: loading }),
      setContentFilters: (filters) => {
        // Replace entire filters object, not merge
        set({ contentFilters: filters });
      },
      setContentPagination: (currentPage, totalPages) => set({
        contentPagination: { currentPage, totalPages }
      }),
      setSelectedContent: (content) => set({ selectedContent: content }),
      
      // Actions - User
      setUsers: (users) => set({ users }),
      setUserLoading: (loading) => set({ userLoading: loading }),
      setUserFilters: (filters) => {
        // Replace entire filters object, not merge
        set({ userFilters: filters });
      },
      setUserPagination: (currentPage, totalPages) => set({
        userPagination: { currentPage, totalPages }
      }),
      setSelectedUser: (user) => set({ selectedUser: user }),
      
      // Reset filters
      resetContentFilters: () => set({
        contentFilters: {
          category: null,
          subCategory: null,
          search: '',
          isApproved: null,
          author: null,
        }
      }),
      resetUserFilters: () => set({
        userFilters: {
          search: '',
          role: null,
          isActive: null,
        }
      }),
    }),
    { name: 'AdminStore' }
  )
);

