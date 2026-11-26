import { useState } from "react";
import PhotosPage from "./pages/PhotosPage";
import ShowsPage from "./pages/ShowsPage";

export default function App() {
  const [page, setPage] = useState<"shows" | "photos">("shows");

  return (
    <div className="container">
      <h1>Picture TV-Show Database</h1>
      <nav>
        <button className={page === "shows" ? "active" : ""} onClick={() => setPage("shows")}>
          Shows
        </button>
        <button className={page === "photos" ? "active" : ""} onClick={() => setPage("photos")}>
          Flickr Photos
        </button>
      </nav>
      {page === "shows" ? <ShowsPage /> : <PhotosPage />}
    </div>
  );
}
