import { useEffect, useRef, useState } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import { Slide } from "../App";

const Deck = ({
  slides,
  handleOptionClick,
  currentSlideIndex,
  loading,
}: {
  slides: Slide[];
  handleOptionClick: (index: number) => void;
  currentSlideIndex: number;
  loading: number;
}) => {
  const deckDivRef = useRef<HTMLDivElement>(null); // reference to deck container div
  const deckRef = useRef<Reveal.Api | null>(null); // reference to deck reveal instance
  const [revealReady, setRevealReady] = useState(false);

  useEffect(() => {
    // Prevents double initialization in strict mode
    if (deckRef.current) return;

    deckRef.current = new Reveal(deckDivRef.current!, {
      transition: "slide",
      // other config options
    });

    deckRef.current
      .initialize({
        hash: true,
        embedded: true,
        controls: true,
        slideNumber: true,
      })
      .then(() => {
        // good place for event handlers and plugin setups
        setRevealReady(true); // <- Marca Reveal como listo
      });

    return () => {
      try {
        if (deckRef.current) {
          deckRef.current.destroy();
          deckRef.current = null;
        }
      } catch (e) {
        console.warn("Reveal.js destroy call failed.");
      }
    };
  }, []);

  useEffect(() => {
    if (revealReady && deckRef.current) {
      deckRef.current.sync(); // <- ¡Esto soluciona el problema!
    }
  }, [slides, revealReady]);

  useEffect(() => {
    if (deckRef.current) {
      // Avanza si no estamos ya en la slide actual
      const current = deckRef.current.getIndices().h;
      if (current < currentSlideIndex) {
        deckRef.current.slide(currentSlideIndex);
      }
    }
  }, [currentSlideIndex, slides.length]); // Dependencias importantes

  return (
    // Your presentation is sized based on the width and height of
    // our parent element. Make sure the parent is not 0-height.
    <div className="reveal" ref={deckDivRef}>
      <div className="slides">
        {slides.map((slide, index) => (
          <section data-background-image={slide.bgImage} key={index}>
            <p className="w-full text-sm">{slide.text}</p>
            {index !== slides.length - 1 ? (
              <p>{slide.options[slide.selecOption || 0]}</p>
            ) : (
              slide.options.map((option, i) => (
                <button
                  disabled={loading === index && index !== 0}
                  key={option}
                  onClick={() => {
                    handleOptionClick(i);
                  }}
                  className="disabled:cursor-default text-sm px-4 py-1 rounded-md bg-neutral-500 mx-2 cursor-pointer"
                >
                  {option}
                </button>
              ))
            )}
            {
                slide.audio && (
                    <audio controls className="w-full mt-4">
                        <source src={slide.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>

                )
            }
          </section>
        ))}
      </div>
    </div>
  );
};

export default Deck;
