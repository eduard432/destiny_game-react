import { useEffect, useState } from "react";
import "./App.css";
import Deck from "./components/Deck";
import { generateObject } from "ai";
import { z } from "zod";
import { openai, prompts } from "./openai";

export type Slide = {
  text: string;
  options: string[]; // ya no necesitamos coordenadas,
  selecOption?: number; // seleccion de la opcion
};

const initialSlides: Slide[] = [
  {
    text: "Despiertas en un bosque oscuro. A lo lejos se escucha un grito.",
    options: ["Ir hacia el grito", "Alejarse lentamente"],
  },
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

const getMessages = (slides: Slide[]): Message[] => {
  const messages: Message[] = [];

  for (const slide of slides) {
    console.log({ slide });
    messages.push({
      role: "assistant",
      content: slide.text,
    });

    if (slide.selecOption || slide.selecOption === 0) {
      messages.push({
        role: "user",
        content: slide.options[slide.selecOption],
      });
    }
  }

  return messages;
};

const getResponse = async (messages: Message[]) => {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        paths: z.array(
          z.object({
            text: z.string(),
            options: z.array(z.string()),
          })
        ),
      }),
      messages: [
        {
          role: "system",
          content: prompts.GENERATE_OBJECT,
        },
        ...messages,
      ],
    });

    return object;
  } catch (error) {
    console.log(error);
  }
};

function App() {
  const [slides, setSlides] = useState(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(initialSlides.length - 1);
  const [loading, setLoading] = useState(0);

  const [currentOptions, setCurrentOptions] = useState<Slide[]>([
    {
      text: "Encuentras una figura encapuchada de pie junto a un árbol caído.",
      options: ["Hablarle", "Esconderse"],
    },
    {
      text: "La figura se da la vuelta y ves que es un anciano con una larga barba blanca.",
      options: ["Preguntarle sobre el bosque", "Atacarle"],
    },
  ]);

  const saveOptions = async (
    response: Promise<
      | {
          paths: {
            options: string[];
            text: string;
          }[];
        }
      | undefined
    >
  ) => {
    const data = await response;
    console.log({ data });
    if (data) {
      setCurrentOptions(data.paths);
    }
    setLoading(0);
  };

  const handleOptionClick = async (index: number) => {
    setLoading(slides.length);
    const lastItem = slides[slides.length - 1];
    const updatedLastItem = { ...lastItem, selecOption: index };
    const newSlides = [
      ...slides.slice(0, -1),
      updatedLastItem,
      currentOptions[index],
    ];

    setSlides(newSlides);

    const messages = getMessages(newSlides);
    console.log({ messages });
    const response = getResponse(messages);
    saveOptions(response);
    setCurrentIndex(slides.length);
  };

  return (
    <main className="h-screen">
      <Deck
        loading={loading}
        currentSlideIndex={currentIndex}
        handleOptionClick={handleOptionClick}
        slides={slides}
      />
    </main>
  );
}

export default App;
