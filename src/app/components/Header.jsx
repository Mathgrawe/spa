"use client";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";

export default function Header({ onLoginClick, onRegisterClick }) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/logout",
        {},
        {
          headers: {
            Accept: "application/json",
          },
          withCredentials: true, 
        }
      );
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    setIsAuth(false);
    location.reload();
  };

  return (
    <header className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-white">
        Top 5 Músicas Mais Tocadas - Tião Carreiro & Pardinho
      </h1>
      <div className="flex gap-4">
        {isAuth ? (
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button variant="outlined" color="success" onClick={onLoginClick}>
              Login
            </Button>
            <Button variant="contained" color="primary" onClick={onRegisterClick}>
              Registrar
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
