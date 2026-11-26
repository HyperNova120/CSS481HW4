import { FormEvent, useState } from "react";
import { useFetch } from "../useFetch";

const API = "https://api.tvmaze.com";

interface Show {
  id: number;
  name: string;
  image: { medium: string; original: string } | null;
  summary: string | null;
  genres: string[];
  premiered: string | null;
  language: string | null;
  rating: { average: number | null };
}
interface SearchResult {
  show: Show;
}

const stripHtml = (html: string | null) => (html ? html.replace(/<[^>]*>/g, "") : "No summary available.");

function ShowDetail({ id, onBack }: { id: number; onBack: () => void }) {
  const { data: show, loading, error } = useFetch<Show>(`${API}/shows/${id}`);

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {show && (
        <div className="detail">
          {show.image && <img src={show.image.original} alt={show.name} />}
          <div>
            <h1>{show.name}</h1>
            <p>Premiered: {show.premiered ?? "Unknown"}</p>
            <p>Genres: {show.genres.join(", ") || "None listed"}</p>
            <p>Language: {show.language ?? "Unknown"}</p>
            <p>Rating: {show.rating.average ?? "N/A"}</p>
            <p>{stripHtml(show.summary)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShowsPage() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const url = query ? `${API}/search/shows?q=${encodeURIComponent(query)}` : null;
  const { data: results, loading, error } = useFetch<SearchResult[]>(url);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setQuery(input.trim());
  };

  if (selectedId !== null) {
    return (
      <ShowDetail id={selectedId} onBack={() => setSelectedId(null)} />
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search shows, e.g. Batman" />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {results && results.length === 0 && <p>No results found.</p>}

      <div className="grid">
        {results?.map(({ show }) => (
          <div key={show.id} className="card" onClick={() => setSelectedId(show.id)}>
            {show.image ? <img src={show.image.medium} alt={show.name} /> : <div className="placeholder">No image</div>}
            <p>{show.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
