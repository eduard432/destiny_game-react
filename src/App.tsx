import { useEffect, useRef, useState } from "react";
import GameFrame, { Slide } from "./GameFrame";
import bgImage1 from "./assets/bosque.png";
import bgImage2 from "./assets/figura.png";
import bgImage3 from "./assets/anciano.png";

const stories: {
    [key: string]: {
      initialSlides: Slide[];
      initialOptions: Slide[];
      label: string;
      objetivo: string;
    };
  } = {
    terror: {
      initialSlides: [
        {
          text: "Despiertas en un bosque oscuro. A lo lejos se escucha un grito.",
          options: ["Ir hacia el grito", "Alejarse lentamente"],
          bgImage: bgImage1,
        },
      ],
      initialOptions: [
        {
          text: "Encuentras una figura encapuchada de pie junto a un árbol caído.",
          options: ["Hablarle", "Esconderse"],
          bgImage: bgImage2,
        },
        {
          text: "La figura se da la vuelta y ves que es un anciano con una larga barba blanca.",
          options: ["Preguntarle sobre el bosque", "Atacarle"],
          bgImage: bgImage3,
        },
      ],
      label: "Un destino escalofriante 🕷",
      objetivo: "Escapar del bosque con vida antes del amanecer.",
    },
  
    aventura: {
      initialSlides: [
        {
          text: "Te despiertas en un globo aerostático flotando sobre una jungla.",
          options: ["Descender con la cuerda", "Seguir volando"],
          bgImage: "",
        },
      ],
      initialOptions: [
        {
          text: "Encuentras un antiguo templo cubierto por la vegetación.",
          options: ["Entrar al templo", "Rodearlo con precaución"],
          bgImage: "",
        },
        {
          text: "Dentro del templo, un mecanismo se activa al pisar una baldosa.",
          options: ["Detenerte inmediatamente", "Seguir caminando con cuidado"],
          bgImage: "",
        },
      ],
      label: "La jungla olvidada 🌿",
      objetivo: "Descubrir el tesoro ancestral y salir del templo sano y salvo.",
    },
  
    cienciaFiccion: {
      initialSlides: [
        {
          text: "Despiertas en una cápsula criogénica a bordo de una nave espacial.",
          options: ["Explorar la nave", "Buscar otros tripulantes"],
          bgImage: "",
        },
      ],
      initialOptions: [
        {
          text: "La nave está vacía, pero escuchas un pitido proveniente de la sala de control.",
          options: ["Investigar el sonido", "Ignorarlo y seguir explorando"],
          bgImage: "",
        },
        {
          text: "Descubres un mensaje en una lengua desconocida en el monitor.",
          options: ["Intentar descifrarlo", "Llamar a la IA de la nave"],
          bgImage: "",
        },
      ],
      label: "Eco en el vacío 🚀",
      objetivo: "Reactivar los sistemas de la nave y establecer contacto con la Tierra.",
    },
  
    fantasia: {
      initialSlides: [
        {
          text: "Despiertas en una pradera con un libro flotando frente a ti.",
          options: ["Tocar el libro", "Ignorarlo y caminar"],
          bgImage: "",
        },
      ],
      initialOptions: [
        {
          text: "El libro se abre y una voz susurra antiguos hechizos.",
          options: ["Leer en voz alta", "Cerrar el libro rápidamente"],
          bgImage: "",
        },
        {
          text: "Un portal brillante se abre ante ti.",
          options: ["Entrar al portal", "Esperar a ver qué sucede"],
          bgImage: "",
        },
      ],
      label: "Hechizo del alba ✨",
      objetivo: "Despertar al guardián mágico y restaurar el equilibrio del reino.",
    },
  };
  
  

const App = () => {
  const [execute, setExecute] = useState(false);
  const [initialStory, setInitialStory] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    divRef.current?.focus();
  }, []);

  if (!initialStory) {
    return (
      <main className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
        {!execute ? (
          <div
            tabIndex={0}
            ref={divRef}
            onKeyDown={() => {
              setExecute(true);
            }}
            className="text-zinc-50 font-mono text-center focus:outline-none"
          >
            <h1 className="text-9xl my-2">Destinity</h1>
            <p className="animate-pulse">
              (Presiona cualquier tecla para empezar)
            </p>
          </div>
        ) : (
          <div className="text-center my-4 mx-auto w-12/12 md:w-10/12 p-4 text-zinc-50 font-mono">
            <p className="text-xl">
              El objetivo es sencillo, cumplir tu destino... elige tu historia:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 mt-12 gap-4">
              {Object.entries(stories).map(
                ([key, {initialSlides, label }]) => (
                  <div
                    className={` ${
                      key === selectedStory ? "border-2 border-amber-500" : "border border-zinc-50"
                    }  p-4`}
                    onClick={() => setSelectedStory(key)}
                    key={key}
                  >
                    <h5 className="text-xl font-semibold">{label}</h5>
                    <p>{initialSlides[0].text}...</p>
                  </div>
                )
              )}
            </div>
            <button
              onClick={() => {
                setInitialStory(selectedStory);
              }}
              className="mt-12 text-zinc-950 bg-zinc-50 px-8 py-1 font-semibold text-xl cursor-pointer hover:bg-zinc-200 ease-in-out"
            >
              Empezar
            </button>
          </div>
        )}
      </main>
    );
  } else {
    return (
      <GameFrame
        initialSlides={stories[initialStory].initialSlides}
        initialOptions={stories[initialStory].initialOptions}
        objetivo={stories[initialStory].objetivo}
      />
    );
  }
};

export default App;
