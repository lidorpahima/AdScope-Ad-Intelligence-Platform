import { useState } from "react";
import GalleryItem from "./GalleryItem";

const Gallery = () => {
  // Sample images - replace with your actual image URLs
  const [items] = useState([
    {
      id: 1,
      type: "image",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      title: "Mountain Landscape",
    },
    {
      id: 2,
      type: "image",
      url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
      title: "Ocean View",
    },
    {
      id: 3,
      type: "image",
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      title: "Forest Path",
    },
    {
      id: 4,
      type: "image",
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
      title: "Sunset",
    },
    {
      id: 5,
      type: "image",
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
      title: "Nature",
    },
    {
      id: 6,
      type: "image",
      url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
      title: "Cityscape",
    },
    {
      id: 7,
      type: "image",
      url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      title: "Mountain Peak",
    },
    {
      id: 8,
      type: "image",
      url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
      title: "Desert",
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
        <p className="text-gray-600">Photos and videos</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <GalleryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
