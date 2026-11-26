import { FormEvent, useState } from "react";
import { useFetch } from "../useFetch";

interface FlickrPhoto {
  title: string;
  link: string;
  media: { m: string };
  author: string;
}
interface FlickrFeed {
  items: FlickrPhoto[];
}

export default function PhotosPage() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const tags = query.replace(/\s+/g, ",");
  const url = query ? `/flickr/photos_public.gne?format=json&nojsoncallback=1&tagmode=all&tags=${encodeURIComponent(tags)}` : null;
  const { data, loading, error } = useFetch<FlickrFeed>(url);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setQuery(input.trim());
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search Flickr photos, e.g. sunset beach" />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {data && data.items.length === 0 && <p>No photos found.</p>}

      <div className="grid photos">
        {data?.items.map((photo) => (
          <a key={photo.link} href={photo.link} target="_blank" rel="noreferrer" className="card">
            <img src={photo.media.m} alt={photo.title || "Flickr photo"} />
          </a>
        ))}
      </div>
    </div>
  );
}
