export const CLIENT_CATEGORIES = [
  {
    id: 'furniture-manufacturers-dealers',
    label: 'Furniture Manufacturers & Dealers',
    badge: '🛋️ Loose & Fixed Furniture',
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
