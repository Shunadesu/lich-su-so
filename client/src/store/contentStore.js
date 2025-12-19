import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useContentStore = create(
  devtools(
    (set, get) => ({
      // Content list state
      contents: [],
      totalPages: 1,
      currentPage: 1,
      loading: false,
      error: null,
      
      // Filters
      filters: {
        category: null,
        subCategory: null,
        search: '',
        author: null,
        authorRole: null,
        isApproved: true,
      },
      
      // Recent activities
      recentActivities: [],
      activitiesLoading: false,
      
      // Selected content
      selectedContent: null,
      contentLoading: false,
      
      // My content
      myContents: [],
      myContentLoading: false,
      myContentTotalPages: 1,
      myContentCurrentPage: 1,
      
      // Actions
      setContents: (contents) => set({ contents }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      
      resetFilters: () => set({
        filters: {
          category: null,
          subCategory: null,
          search: '',
          author: null,
          authorRole: null,
          isApproved: true,
        }
      }),
      
      setPagination: (currentPage, totalPages) => set({
        currentPage,
        totalPages
      }),
      
      setRecentActivities: (activities) => set({ recentActivities: activities }),
      
      setActivitiesLoading: (loading) => set({ activitiesLoading: loading }),
      
      setSelectedContent: (content) => set({ selectedContent: content }),
      
      setContentLoading: (loading) => set({ contentLoading: loading }),
      
      setMyContents: (contents) => set({ myContents: contents }),
      
      setMyContentLoading: (loading) => set({ myContentLoading: loading }),
      
      setMyContentPagination: (currentPage, totalPages) => set({
        myContentCurrentPage: currentPage,
        myContentTotalPages: totalPages
      }),
      
      // Helper to get content by id
      getContentById: (id) => {
        const { contents, myContents, selectedContent } = get();
        return contents.find(c => c._id === id) ||
               myContents.find(c => c._id === id) ||
               (selectedContent?._id === id ? selectedContent : null);
      },
    }),
    { name: 'ContentStore' }
  )
);

export default useContentStore;

