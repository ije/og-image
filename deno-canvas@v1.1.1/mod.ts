import * as lib from "./lib.js";
import { CanvasKit } from "./types.ts";

const Canvas = await lib.CanvasKitInit({}) as CanvasKit;

export async function loadImage(url: string) {
    const resp = await fetch(url); 
    const buffer = await resp.arrayBuffer(); 
    const img = Canvas.MakeImageFromEncoded(new Uint8Array(buffer));
    if (!img) throw new Error("Invalid Image");
    return img;
}

export const createCanvas = Canvas.MakeCanvas

export * from "./types.ts"
export default Canvas