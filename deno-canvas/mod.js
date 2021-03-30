import * as lib from "./lib.js"; 

const Canvas = await lib.CanvasKitInit({}) ;

export async function loadImage(url ) {
    const resp = await fetch(url); 
    const buffer = await resp.arrayBuffer(); 
    const img = Canvas.MakeImageFromEncoded(new Uint8Array(buffer));
    if (!img) throw new Error("Invalid Image");
    return img;
}

export const createCanvas = Canvas.MakeCanvas

export default Canvas