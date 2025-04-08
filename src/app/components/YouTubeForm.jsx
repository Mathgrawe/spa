"use client";
import { useState } from "react";
import { TextField, Button, Alert } from "@mui/material";

export default function YouTubeForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidYouTubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    if (!isValidYouTubeUrl(url)) {
      setError("Por favor, insira uma URL válida do YouTube.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar sugestão.");
      }

      setSuccessMsg(data.title ? `Música adicionada: ${data.title}` : "Sugestão enviada com sucesso!");
      setUrl("");
    } catch (err) {
      setError(err.message || "Erro ao processar a URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <TextField
          label="Cole a URL do YouTube aqui"
          variant="outlined"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          sx={{ height: "56px", minWidth: "120px" }}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </div>

      {successMsg && <Alert severity="success">{successMsg}</Alert>}
    </form>
  );
}
