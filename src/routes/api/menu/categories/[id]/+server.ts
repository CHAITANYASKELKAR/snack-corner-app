import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        category: id,
        isAvailable: true
      }
    });
    
    return json(menuItems);
  } catch (error) {
    console.error(`Failed to fetch menu items for category ${id}:`, error);
    return json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
};