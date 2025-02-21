import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

const Game = () => {
  const router = useRouter();
  const { name } = router.query;
  const canvasRef = useRef(null);
  const [jesus, setJesus] = useState({ x: 10, y: 10 });
  const [followers, setFollowers] = useState([]);
  const [bible, setBible] = useState(generateRandomPosition());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const images = useRef({ jesus: null, follower: null, bible: null });

  useEffect(() => {
    if (typeof window === "undefined") return;

    images.current.jesus = new window.Image();
    images.current.follower = new window.Image();
    images.current.bible = new window.Image();

    images.current.jesus.src = "/assets/JESUS.png";
    images.current.follower.src = "/assets/1.png";
    images.current.bible.src = "/assets/biblia.png";

    let loadedCount = 0;
    const totalImages = Object.keys(images.current).length;

    Object.values(images.current).forEach((img) => {
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => console.error(`Erro ao carregar: ${img.src}`);
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawGame = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      if (images.current.jesus) {
        ctx.drawImage(images.current.jesus, jesus.x * CELL_SIZE, jesus.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      followers.forEach((f) => {
        if (images.current.follower) {
          ctx.drawImage(images.current.follower, f.x * CELL_SIZE, f.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      });

      if (images.current.bible) {
        ctx.drawImage(images.current.bible, bible.x * CELL_SIZE, bible.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    };

    const gameLoop = setInterval(() => {
      setFollowers((prev) => (prev.length > 0 ? [jesus, ...prev.slice(0, -1)] : prev));

      setJesus((prev) => {
        const newPosition = { x: prev.x + direction.x, y: prev.y + direction.y };

        if (newPosition.x === bible.x && newPosition.y === bible.y) {
          setFollowers((prev) => {
            const newFollowers = [...prev, bible];
            if (newFollowers.length === 12) {
              clearInterval(gameLoop);
              router.push(`/end?win=true&score=${newFollowers.length}`);
              return newFollowers;
            }
            return newFollowers;
          });
          setBible(generateRandomPosition());
        }

        if (newPosition.x < 0 || newPosition.y < 0 || newPosition.x >= GRID_SIZE || newPosition.y >= GRID_SIZE) {
          clearInterval(gameLoop);
          router.push(`/end?win=false&score=${followers.length}`);
        }

        return newPosition;
      });

      drawGame();
    }, 200);

    return () => clearInterval(gameLoop);
  }, [jesus, followers, bible, direction, imagesLoaded]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") setDirection({ x: 0, y: -1 });
      if (event.key === "ArrowDown") setDirection({ x: 0, y: 1 });
      if (event.key === "ArrowLeft") setDirection({ x: -1, y: 0 });
      if (event.key === "ArrowRight") setDirection({ x: 1, y: 0 });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function generateRandomPosition() {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center" 
    style={{ backgroundImage: "url('/assets/fundo-ti.png')" }}>
      <h1 className="text-3xl font-bold text-white">Jogador: {name}</h1>
      {!imagesLoaded && <p className="text-white">Carregando...</p>}
      <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="border mt-4"></canvas>

      <div className="mt-8 flex flex-col items-center relative w-32 h-32">
  <button
    className="absolute top-0 left-1/2 transform -translate-x-1/2 p-4 bg-red-500 text-white rounded-full shadow-lg active:scale-90"
    onClick={() => setDirection({ x: 0, y: -1 })}
  >
    ▲
  </button>

  <button
    className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 bg-red-500 text-white rounded-full shadow-lg active:scale-90"
    onClick={() => setDirection({ x: -1, y: 0 })}
  >
    ◀
  </button>

  <button
    className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 bg-red-500 text-white rounded-full shadow-lg active:scale-90"
    onClick={() => setDirection({ x: 1, y: 0 })}
  >
    ▶
  </button>

  <button
    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-4 bg-red-500 text-white rounded-full shadow-lg active:scale-90"
    onClick={() => setDirection({ x: 0, y: 1 })}
  >
    ▼
  </button>
</div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Game), { ssr: false });