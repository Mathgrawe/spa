import {
  Modal,
  Box,
  TextField,
  Button,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Cookies from "js-cookie";

export default function AuthModal({ open, onClose }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const csrfResponse = await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Erro ao carregar o token CSRF.");
      }

      const xsrfToken = Cookies.get("XSRF-TOKEN");
      if (!xsrfToken) {
        throw new Error("Token CSRF não encontrado.");
      }

      const url =
        tab === 0
          ? "http://localhost:8000/api/v1/login"
          : "http://localhost:8000/api/v1/register";

      const payload =
        tab === 0
          ? {
              email: form.email,
              password: form.password,
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              password_confirmation: form.password,
            };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro na autenticação.");
      }

      onClose();
      location.reload();
    } catch (err) {
      setError(err.message || "Erro inesperado. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          p: 4,
          width: 400,
          mx: "auto",
          mt: "10%",
        }}
      >
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="Entrar" />
          <Tab label="Registrar" />
        </Tabs>

        <Box mt={3}>
          {tab === 1 && (
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
            />
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Senha"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={loading || !form.email || !form.password || (tab === 1 && !form.name)}
          >
            {loading
              ? "Carregando..."
              : tab === 0
              ? "Entrar"
              : "Registrar"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
