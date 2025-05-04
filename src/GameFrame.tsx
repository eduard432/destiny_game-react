import { useEffect, useState } from "react";
// import { experimental_generateSpeech } from 'ai';

import "./App.css";
import Deck from "./components/Deck";
import { generateObject } from "ai";
import { z } from "zod";
import { nativeOpenAi, openai, prompts } from "./openai";



export type Slide = {
  text: string;
  options: string[]; // ya no necesitamos coordenadas,
  selecOption?: number; // seleccion de la opcion
  bgImage?: string,
  audio?: string
};


type Message = {
  role: "user" | "assistant";
  content: string;
};

const getMessages = (slides: Slide[]): Message[] => {
  const messages: Message[] = [];

  for (const slide of slides) {
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

const getResponse = async (messages: Message[], objetivo: string) => {
  try {

    // TEXTO:
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        paths: z.array(
          z.object({
            text: z.string(),
            options: z.array(z.string()),
            imageDesc: z.string()
          })
        ),
      }),
      messages: [
        {
          role: "system",
          content: prompts.GENERATE_OBJECT,
        },
        {
          role: "system",
          content: "El objetivo de la historia para el jugador es: " + objetivo,
        },
        ...messages,
      ],
    });


    // IMAGENES:
    // const imageResPromise = object.paths.map(async (path) => {

    //    const imageRes = await nativeOpenAi.images.generate({
    //     model: 'dall-e-3',
    //     prompt: path.imageDesc,
    //     size: "1792x1024",
    //     quality: 'standard',
    //     response_format: 'url',
    //   })

    //   if(!imageRes.data) return ""

    //   const imageUrl = imageRes.data[0].url

      
    //   // console.log({dataImg: imageRes.data})
    //   return decodeURIComponent(imageUrl || "")
    // })

    // const images = await Promise.allSettled(imageResPromise)

    // AUDIO:
    // const audioResPromise = object.paths.map(async (path) => {
    //   const {audio} = await experimental_generateSpeech({
    //     model: openai.speech('tts-1'),
    //     text: path.text,
    //   });
  
    //   const audioURL = `data:audio/mpeg;base64,${audio.base64}`

    //   return audioURL
    // })

    // const audios = await Promise.allSettled(audioResPromise)

    const newObject = object.paths.map((path, index) => {
      return {
        text: path.text,
        options: path.options,
        // bgImage: images[index].status === "fulfilled" ? images[index].value : "",
        // audio: audios[index].status === "fulfilled" ? audios[index].value : "",
      }
    })


    return newObject;
  } catch (error) {
    console.log(error);
  }
};

function GameFrame({initialSlides, initialOptions, objetivo}: {objetivo: string, initialSlides: Slide[], initialOptions: Slide[]}) {
  const [slides, setSlides] = useState(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(initialSlides.length - 1);
  const [loading, setLoading] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if(slides.length > 6 ) {
      setFinished(true)
    }
  }, [slides])
  

  const [currentOptions, setCurrentOptions] = useState<Slide[]>(initialOptions);

  const saveOptions = async (
    response: Promise<
      | {
        text: string;
        options: string[];
        bgImage?: string;
    }[]
      | undefined
    >
  ) => {
    const paths = await response;
    if (paths) {
      setCurrentOptions(paths);
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
    const response = getResponse(messages, objetivo);
    saveOptions(response);
    setCurrentIndex(slides.length);
  };

  return (
    <main className={`${finished && "bg-zinc-950 flex justify-center items-center" } h-screen`}>
      {
        !finished ? (

        <Deck
          loading={loading}
          currentSlideIndex={currentIndex}
          handleOptionClick={handleOptionClick}
          slides={slides}
        />): (
          <div className="flex flex-col justify-center" >
            <h2 className="font-mono text-3xl text-center text-zinc-50" >Perdiste tu destino :(</h2>
            <button
            onClick={() => {
              setSlides(initialSlides);
              setCurrentOptions(initialOptions);
              setCurrentIndex(0);
              setFinished(false);
              setLoading(0);
            }}
            className="mt-12 text-zinc-950 bg-zinc-50 px-8 py-1 font-semibold text-xl cursor-pointer hover:bg-zinc-200 ease-in-out"
          >
            Volver a empezar
          </button>
          </div>
        )
      }
    </main>
  );
}

export default GameFrame;
