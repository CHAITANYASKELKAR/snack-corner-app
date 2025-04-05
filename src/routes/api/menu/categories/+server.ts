import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const GET: RequestHandler = async () => {
  try {
    // Get distinct categories from menu items
    const menuItems = await prisma.menuItem.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    const categories = menuItems.map((item) => ({
      id: item.category,
      name: item.category,
    }));

    return json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return json({ error: "Failed to fetch categories" }, { status: 500 });
  }
};
