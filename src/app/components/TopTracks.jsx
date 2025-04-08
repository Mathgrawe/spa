"use client";

import { useEffect, useState } from "react";

export default function TopTracks() {
  const [tracks, setTracks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchUserAndTracks() {
      try {
        // Busca info do usuário
        const userRes = await fetch("http://localhost:8000/api/v1/me", {
          credentials: "include",
        });
        const userData = await userRes.json();
        setIsAdmin(userData.is_admin);

        // Busca músicas
        const musicRes = await fetch("http://localhost:8000/api/v1/musics");
        const musicData = await musicRes.json();
        setTracks(musicData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    fetchUserAndTracks();
  }, []);

  async function handleDelete(id) {
    const confirmDelete = confirm("Tem certeza que deseja deletar esta música?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/api/v1/musics/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erro ao deletar música.");
      }

      setTracks((prev) => prev.filter((track) => track.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Top 5 Músicas</h2>
      <ul className="space-y-4">
        {tracks.map((track, index) => (
          <li
            key={track.id}
            className="bg-neutral-900 px-5 py-4 rounded-2xl flex items-center justify-between hover:bg-neutral-800 transition duration-200 shadow-sm border border-neutral-800"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-green-400">{index + 1}.</span>
              <div>
                <p className="text-white font-semibold">{track.title}</p>
                <p className="text-sm text-gray-400">{track.artist}</p>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => handleDelete(track.id)}
                className="text-sm text-red-400 hover:text-red-500 transition"
              >
                Deletar
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
