import { useRouter } from "next/router";

export default function End() {
  const router = useRouter();
  const { win, score } = router.query;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center" 
    style={{ backgroundImage: "url('/assets/fundo.jpg')" }}>
      {win === "true" ? (
        <h1 className="text-4xl font-bold text-green-600">🏆 Parabéns! Você venceu! Jesus Escolheu 12 Apóstolos 🏆</h1>
      ) : (
        <h1 className="text-4xl font-bold text-red-600">💔 Você perdeu! 💔</h1>
      )}
        <p className="text-xl mt-2 text-white">Pessoas que seguiram Jesus: {score}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.push("/")}
      >
        Jogar Novamente
      </button>
      <div className="absolute bottom-4">
       <img src="/assets/ti.jpeg" alt="Logo" className="w-24 h-auto" />
      </div>
    </div>
  );
}
