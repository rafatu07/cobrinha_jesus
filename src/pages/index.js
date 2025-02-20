import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const startGame = () => {
    if (name.trim()) {
      router.push(`/game?name=${name}`);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/fundo.jpg')" }}
    >

      <h1 className="text-3xl font-bold text-white">JESUS É O CAMINHO</h1>
      <input
        type="text"
        className="border p-2 mt-4"
        placeholder="Digite seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={startGame} className="bg-blue-500 text-white px-4 py-2 mt-2">
        Iniciar Jogo
      </button>
      <div className="absolute bottom-4">
       <img src="/assets/ti.jpeg" alt="Logo" className="w-24 h-auto" />
      </div>
    </div>
  );
}