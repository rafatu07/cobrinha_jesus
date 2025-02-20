import { useRouter } from "next/router";

export default function End() {
  const router = useRouter();
  const { win, score } = router.query;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {win === "true" ? (
        <h1 className="text-4xl font-bold text-green-600">🏆 Parabéns! Você venceu! Jesus Escolheu 12 Apóstolos 🏆</h1>
      ) : (
        <h1 className="text-4xl font-bold text-red-600">💔 Você perdeu! Tente novamente. 💔</h1>
      )}
        <p className="text-xl mt-2">Pessoas que seguiram Jesus: {score}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.push("/")}
      >
        Jogar Novamente
      </button>
    </div>
  );
}
