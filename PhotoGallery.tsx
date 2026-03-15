import React, { useEffect, useState } from 'react';
import { GalleryImage, User } from './types';
import { db } from './db';

interface PhotoGalleryProps {
  user: User;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ user }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadGallery().catch(error => {
      console.error('Failed to load gallery', error);
    });
  }, []);

  const loadGallery = async () => {
    const galleryImages = await db.getGallery();
    setImages(galleryImages);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageUrl.trim()) {
      return;
    }

    await db.addImage({
      id: Date.now(),
      title: caption || 'Campus memory',
      caption: caption || 'Campus memory',
      image_url: imageUrl,
      url: imageUrl,
      uploaded_by: Number(user.id),
      created_at: new Date().toISOString(),
    });

    setCaption('');
    setImageUrl('');
    await loadGallery();
  };

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Photo Gallery</h2>
        <p className="mt-2 text-sm text-slate-500">Share campus moments with the alumni community.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="url"
            value={imageUrl}
            onChange={event => setImageUrl(event.target.value)}
            placeholder="Image URL"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
            required
          />
          <input
            type="text"
            value={caption}
            onChange={event => setCaption(event.target.value)}
            placeholder="Caption"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
          />
          <button
            type="submit"
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Add Photo
          </button>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {images.map(image => (
          <article key={image.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-[4/3] bg-slate-100">
              <img
                src={image.url || image.image_url}
                alt={image.caption || image.title || 'Gallery image'}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-sm font-bold text-slate-900">{image.caption || image.title || 'Campus memory'}</p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(image.date || image.created_at).toLocaleDateString()}
              </p>
            </div>
          </article>
        ))}

        {images.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
            No photos uploaded yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default PhotoGallery;
