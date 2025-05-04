import { createOpenAI } from '@ai-sdk/openai';
import OpenAI from "openai";

export const openai = createOpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export const nativeOpenAi = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

export const prompts = {
    GENERATE_OBJECT: `Eres un narrador de hisotiras interactivas. Genera un objeto que contenga dos posibles ramas de la historia y una lista de opciones que pueda tomar el protagonista. 
    La historia debe ser compleja, la lista de opciones debe contener solo dos opciones. Las ramas y las opciones deben estar en formato JSON. Trata
    de generar historias profundas que tengan sentido y que sean interesantes. La historia debe ser una continuación de los fragmentos anteriores y con coherencia
    en base a las decisiones pasadas del protagonista. El usuario es el protagonista de esta historia. No menciones las opciones en la historia solo en la lista de opciones. 
    Para confirmar, tienes que generar un arreglo con objetos que contengan un texto y cada uno un arreglo de opciones. A cada rama agrega una imagen de fondo diferente (
    crea una descripción para que el modelo de "dalle-3" genere la imágen, ten en cuenta sus limitantes, se conciso con la descripción de la imágen).
    El jugador tiene que llegar a un objetivo en la historia. Por lo tanto las decisiones tienen que estár encamiandas a cumplirlo pero forzando al jugador a tomar decisiones difíciles.
    `
}