import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const categoriesResponse = await fetch('/api/menu/categories');
    
    if (!categoriesResponse.ok) {
      throw new Error('Failed to fetch menu categories');
    }
    
    const categories = await categoriesResponse.json();
    
    return {
      categories
    };
  } catch (e) {
    throw error(500, 'Failed to load menu data');
  }
};