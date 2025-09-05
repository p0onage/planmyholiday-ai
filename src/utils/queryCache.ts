/**
 * Query Cache Utilities
 * 
 * This file provides utilities for managing the React Query cache persistence.
 * The cache is automatically persisted to localStorage and will survive page reloads.
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Clear all cached queries from localStorage
 * Useful for debugging or when you want to force fresh data
 */
export const clearQueryCache = (queryClient: QueryClient) => {
  queryClient.clear();
  localStorage.removeItem('planmyholiday-query-cache');
};
