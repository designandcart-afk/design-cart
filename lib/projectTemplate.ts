// Project template system to give new projects the same rich structure as demo projects

import type { DemoProject, DemoRender, DemoProjectProduct } from './demoData';
import { extraDemoProducts } from './demoData';

// Default areas that every new project should have
export const DEFAULT_AREAS = [
  "Living Room",
  "Dining",
  "Bedroom", 
  "Kitchen",
  "Master Bedroom",
  "Bathroom"
];

// Generate template renders for a project
export function generateTemplateRenders(projectId: string): DemoRender[] {
  const renders: DemoRender[] = [];
  
  // Living Room renders
  renders.push(
    {
      id: `${projectId}_lr_1`,
      imageUrl: "https://images.unsplash.com/photo-1514517220035-0001f84778f5?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Living Room",
    },
    {
      id: `${projectId}_lr_2`, 
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Living Room",
    }
  );
  
  // Dining renders
  renders.push(
    {
      id: `${projectId}_dr_1`,
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
      status: "pending", 
      projectId,
      area: "Dining",
    },
    {
      id: `${projectId}_dr_2`,
      imageUrl: "https://images.unsplash.com/photo-1617098720902-24f16669c9cb?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Dining",
    }
  );
  
  // Bedroom renders
  renders.push(
    {
      id: `${projectId}_br_1`,
      imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Bedroom",
    },
    {
      id: `${projectId}_br_2`,
      imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Bedroom",
    }
  );
  
  // Kitchen renders
  renders.push(
    {
      id: `${projectId}_kr_1`,
      imageUrl: "https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Kitchen",
    },
    {
      id: `${projectId}_kr_2`,
      imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Kitchen",
    }
  );
  
  // Master Bedroom renders
  renders.push(
    {
      id: `${projectId}_mbr_1`,
      imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Master Bedroom",
    },
    {
      id: `${projectId}_mbr_2`,
      imageUrl: "https://images.unsplash.com/photo-1616594266889-f99f76596aa2?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Master Bedroom",
    }
  );
  
  // Bathroom renders
  renders.push(
    {
      id: `${projectId}_bath_1`,
      imageUrl: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Bathroom",
    },
    {
      id: `${projectId}_bath_2`,
      imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
      status: "pending",
      projectId,
      area: "Bathroom",
    }
  );
  
  return renders;
}

// Generate template product associations for a project  
export function generateTemplateProductLinks(projectId: string): DemoProjectProduct[] {
  const links: DemoProjectProduct[] = [];
  let linkId = 1;
  
  // Living Room products
  const livingRoomProducts = ["prod_1", "prod_3", "prod_105", "prod_104", "prod_110", "prod_111", "prod_112"];
  livingRoomProducts.forEach(productId => {
    links.push({
      id: `${projectId}_link_${linkId++}`,
      projectId,
      productId,
      area: "Living Room"
    });
  });
  
  // Dining products
  const diningProducts = ["prod_109", "prod_2", "prod_122", "prod_123", "prod_124"];
  diningProducts.forEach(productId => {
    links.push({
      id: `${projectId}_link_${linkId++}`,
      projectId,
      productId,
      area: "Dining"
    });
  });
  
  // Bedroom products
  const bedroomProducts = ["prod_106", "prod_118", "prod_119", "prod_120"];
  bedroomProducts.forEach(productId => {
    links.push({
      id: `${projectId}_link_${linkId++}`,
      projectId,
      productId,
      area: "Bedroom"
    });
  });
  
  // Kitchen products
  const kitchenProducts = ["prod_107", "prod_132", "prod_133", "prod_135"];
  kitchenProducts.forEach(productId => {
    links.push({
      id: `${projectId}_link_${linkId++}`,
      projectId,
      productId,
      area: "Kitchen"
    });
  });
  
  // Master Bedroom products
  const masterBedroomProducts = ["prod_117", "prod_121", "prod_119", "prod_110"];
  masterBedroomProducts.forEach(productId => {
    links.push({
      id: `${projectId}_link_${linkId++}`,
      projectId,
      productId,
      area: "Master Bedroom"
    });
  });
  
  // Bathroom products
  const bathroomProducts = ["prod_137", "prod_138", "prod_139", "prod_141"];
  bathroomProducts.forEach(productId => {
    links.push({
      id: `${projectId}_link_${linkId++}`,
      projectId,
      productId,
      area: "Bathroom"
    });
  });
  
  return links;
}

// Initialize project template data
export function initializeProjectTemplate(projectId: string, userId: string) {
  // Create renders for the project
  const renders = generateTemplateRenders(projectId);
  const userRendersKey = `dc:renders:${userId}`;
  const existingRenders = JSON.parse(localStorage.getItem(userRendersKey) || '[]');
  localStorage.setItem(userRendersKey, JSON.stringify([...existingRenders, ...renders]));
  
  // Create product links for the project
  const productLinks = generateTemplateProductLinks(projectId);
  const userLinksKey = `dc:projectProducts:${userId}`;
  const existingLinks = JSON.parse(localStorage.getItem(userLinksKey) || '[]');
  localStorage.setItem(userLinksKey, JSON.stringify([...existingLinks, ...productLinks]));
}

// Get areas for a project (will return default areas for template)
export function getProjectAreas(projectId: string, userId: string): string[] {
  const userLinksKey = `dc:projectProducts:${userId}`;
  const productLinks: DemoProjectProduct[] = JSON.parse(localStorage.getItem(userLinksKey) || '[]');
  
  const projectLinks = productLinks.filter(link => link.projectId === projectId);
  const linkedAreas = Array.from(new Set(projectLinks.map(link => link.area)));
  
  // If no linked areas found, return default areas
  return linkedAreas.length > 0 ? linkedAreas : DEFAULT_AREAS;
}

// Get renders for a specific project and area
export function getProjectRenders(projectId: string, area: string, userId: string): DemoRender[] {
  const userRendersKey = `dc:renders:${userId}`;
  const renders: DemoRender[] = JSON.parse(localStorage.getItem(userRendersKey) || '[]');
  
  return renders.filter(render => render.projectId === projectId && render.area === area);
}

// Get product links for a specific project and area
export function getProjectProducts(projectId: string, area: string, userId: string): DemoProjectProduct[] {
  const userLinksKey = `dc:projectProducts:${userId}`;
  const productLinks: DemoProjectProduct[] = JSON.parse(localStorage.getItem(userLinksKey) || '[]');
  
  return productLinks.filter(link => link.projectId === projectId && link.area === area);
}

// Generate screenshot placeholders for an area
export function generateScreenshotsForArea(area: string): Array<{ id: string; imageUrl: string }> {
  return [1, 2].map((n) => ({
    id: `${area}-screenshot-${n}`,
    imageUrl: `https://picsum.photos/seed/${encodeURIComponent(area + n + 'template')}/1200/800`,
  }));
}