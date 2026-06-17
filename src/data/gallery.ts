export interface GalleryItem {
  id: string;
  photo: string;
  caption: string;
  location: string;
  /** Tailwind row-span hint for the masonry layout. */
  tall?: boolean;
}

export const galleryItems: GalleryItem[] = [
  { id: "g1", photo: "photo-1514282401047-d79a71a590e8", caption: "Overwater serenity", location: "Maldives", tall: true },
  { id: "g2", photo: "photo-1512453979798-5ea266f8880c", caption: "City of gold", location: "Dubai" },
  { id: "g3", photo: "photo-1493976040374-85c8e12f0c0e", caption: "Neon nights", location: "Tokyo, Japan" },
  { id: "g4", photo: "photo-1530122037265-a5f1f91d3b99", caption: "Alpine mornings", location: "Switzerland", tall: true },
  { id: "g5", photo: "photo-1541432901042-2d8bd64b4a9b", caption: "Fairy chimneys", location: "Cappadocia, Turkey" },
  { id: "g6", photo: "photo-1502602898657-3e91760cbb34", caption: "City of light", location: "Paris, France" },
  { id: "g7", photo: "photo-1537996194471-e657df975ab4", caption: "Island of the gods", location: "Bali, Indonesia", tall: true },
  { id: "g8", photo: "photo-1552832230-c0197dd311b5", caption: "Eternal city", location: "Rome, Italy" },
  { id: "g9", photo: "photo-1539768942893-daf53e448371", caption: "Pharaoh's legacy", location: "Giza, Egypt" },
  { id: "g10", photo: "photo-1525625293386-3f8f99389edd", caption: "Garden city", location: "Singapore", tall: true },
  { id: "g11", photo: "photo-1543783207-ec64e4d95325", caption: "Gaudí dreams", location: "Barcelona, Spain" },
  { id: "g12", photo: "photo-1528181304800-259b08848526", caption: "Temple of dawn", location: "Bangkok, Thailand" },
  { id: "g13", photo: "photo-1565008576549-57569a49371d", caption: "Caucasus charm", location: "Tbilisi, Georgia" },
  { id: "g14", photo: "photo-1614531341773-3bff8b7cb3fc", caption: "Silk Road domes", location: "Samarkand, Uzbekistan", tall: true },
  { id: "g15", photo: "photo-1601581875309-fafbf2d3ed3a", caption: "Land of fire", location: "Baku, Azerbaijan" },
  { id: "g16", photo: "photo-1513635269975-59663e0ac1ad", caption: "Royal London", location: "London, UK" },
];
