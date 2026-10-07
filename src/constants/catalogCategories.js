export const CLIENT_CATEGORIES = [
  {
    id: 'furniture-manufacturers-dealers',
    label: 'Furniture Manufacturers & Dealers',
    badge: '🛋️ Loose & Fixed Furniture',
    iconKey: 'home',
    objects: [
      'Sofa',
      'Bed',
      'Dining Table',
      'Dining Chair',
      'Coffee Table',
      'TV Unit',
      'Wardrobe',
      'Recliner',
      'Bookshelf',
      'Side Table'
    ]
  },
  {
    id: 'interior-design-companies-designers',
    label: 'Interior Design Companies & Designers',
    badge: '📐 Turnkey Spatial Concepts',
    iconKey: 'pen',
    objects: [
      'Sofa',
      'Curtains',
      'Wallpaper',
      'False Ceiling',
      'Wall Panel',
      'Flooring',
      'Lighting',
      'Rug',
      'Artwork',
      'Decorative Mirror'
    ]
  },
  {
    id: 'real-estate-developers-builders',
    label: 'Real Estate Developers & Builders',
    badge: '🏢 Model Suites & Turnkey Fit-Outs',
    iconKey: 'building',
    objects: [
      'Sofa',
      'Bed',
      'Modular Kitchen',
      'Wardrobe',
      'Dining Table',
      'TV Unit',
      'Bathroom Vanity',
      'Flooring',
      'Ceiling Design',
      'Balcony Furniture'
    ]
  },
  {
    id: 'home-decor-tiles-flooring',
    label: 'Home Décor, Tiles & Flooring Brands',
    badge: '🏺 Surfaces & Architectural Finishes',
    iconKey: 'layers',
    objects: [
      'Floor Tiles',
      'Wall Tiles',
      'Marble',
      'Wooden Flooring',
      'Wallpaper',
      'Wall Panels',
      'Rugs',
      'Curtains',
      'Decorative Lights',
      'Mirrors'
    ]
  },
  {
    id: 'modular-kitchen-wardrobe-companies',
    label: 'Modular Kitchen & Wardrobe Companies',
    badge: '🍳 Millwork & Cabinetry Systems',
    iconKey: 'utensils',
    objects: [
      'Kitchen Cabinets',
      'Island Counter',
      'Overhead Cabinets',
      'Base Cabinets',
      'Tall Unit',
      'Pantry Unit',
      'Wardrobe',
      'Sliding Wardrobe',
      'Walk-in Wardrobe',
      'Dressing Table'
    ]
  },
  {
    id: 'popular-items-tried-by-customers',
    label: 'Popular items tried by customers',
    badge: '⭐ Trending & Top Rated Choices',
    iconKey: 'sparkles',
    objects: [
      'Sofa',
      'Bed',
      'Dining Table',
      'Dining Chair',
      'Coffee Table',
      'Wardrobe',
      'Curtains',
      'Wallpaper',
      'Lighting',
      'Rug'
    ]
  }
];

export const getObjectsForClientCategory = (clientCategoryLabel) => {
  const matched = CLIENT_CATEGORIES.find(
    (c) => c.label === clientCategoryLabel || c.id === clientCategoryLabel
  );
  return matched ? matched.objects : [];
};

export const getClientCategoryMeta = (identifier) => {
  if (!identifier) return null;
  return (
    CLIENT_CATEGORIES.find(
      (c) => c.id === identifier || c.label === identifier || c.label.toLowerCase() === identifier.toLowerCase()
    ) || null
  );
};

// Returns all categories that can be assigned to Clients (the specialized sectors)
export const getAvailableClientCategories = () => {
  return CLIENT_CATEGORIES.filter((c) => c.id !== 'popular-items-tried-by-customers');
};
