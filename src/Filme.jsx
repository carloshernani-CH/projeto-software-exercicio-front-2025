import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function FilmesApp() {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [nota, setNota] = useState("");
  const [diretor, setDiretor] = useState("");

  const {
    user,
    isAuthenticated,
    getAccessTokenSilently
  } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        console.log("Access Token:", accessToken);
        setToken(accessToken);

        // Decodificar o token para verificar permissões
        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        console.log("Token Payload:", tokenPayload);

        // Verificar se o usuário tem permissão de admin
        const permissions = tokenPayload.permissions || [];
        setIsAdmin(permissions.includes('ADMIN') || permissions.includes('delete:filmes'));
      } catch (e) {
        console.error('Erro ao buscar token:', e);
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Catálogo de Filmes</h1>
          <p className="mb-6 text-gray-600">Faça login para gerenciar filmes</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  async function fetchFilmes() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/filmes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Erro ao carregar: ${res.status}`);
      const data = await res.json();
      setFilmes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);

    const dto = {
      nome: nome || null,
      descricao: descricao || null,
      nota: nota ? parseInt(nota) : null,
      diretor: diretor || null
    };

    try {
      const res = await fetch(`${BASE_URL}/filmes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dto)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ao criar: ${res.status} ${text}`);
      }

      const created = await res.json();
      setFilmes(prev => [created, ...prev]);

      setNome("");
      setDescricao("");
      setNota("");
      setDiretor("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Deseja realmente excluir este filme?")) return;

    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/filmes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ao excluir: ${res.status} ${text}`);
      }

      setFilmes(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 bg-white rounded-lg shadow p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full" />
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              {isAdmin && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>}
            </div>
          </div>
          <LogoutButton />
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-3xl font-bold mb-6">Catálogo de Filmes</h1>

          <form onSubmit={handleCreate} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome do Filme"
                required
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={diretor}
                onChange={e => setDiretor(e.target.value)}
                placeholder="Nome do Diretor"
                required
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Descrição do Filme"
              rows="3"
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center gap-4">
              <label className="font-medium">Nota (0-5):</label>
              <input
                type="number"
                min="0"
                max="5"
                value={nota}
                onChange={e => setNota(e.target.value)}
                required
                className="p-3 border rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Cadastrar Filme
              </button>
              <button
                type="button"
                onClick={fetchFilmes}
                className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Recarregar Lista
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold mb-4">Lista de Filmes</h2>

            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : filmes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum filme cadastrado. Clique em "Recarregar Lista" ou cadastre o primeiro filme!
              </div>
            ) : (
              <div className="grid gap-4">
                {filmes.map((filme) => (
                  <div key={filme.id} className="p-4 border rounded-lg hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{filme.nome}</h3>
                        <p className="text-gray-600 mt-1">{filme.descricao}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-700">
                            Diretor: {filme.diretor}
                          </span>
                          <span className="text-sm font-medium text-yellow-600">
                            ⭐ {filme.nota}/5
                          </span>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(filme.id)}
                          className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
