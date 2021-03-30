import Canvas, { loadImage } from './deno-canvas-3/mod.js'

addEventListener('fetch', async (event) => {
    const canvasSize = [2048, 1170]
    const defaultHeight = 300
    const defaultFontSize = 90
    const spacing = 200

    const canvas = Canvas.MakeCanvas(canvasSize[0], canvasSize[1])
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 2048, 1170)

    // draw bg dots
    ctx.fillStyle = '#cccccc'
    const g = 100
    for (let x = 0; x < Math.ceil(canvasSize[0] / g); x++) {
        for (let y = 0; y < 2 * Math.ceil(canvasSize[1] / g); y++) {
            let offsetX = 0
            if (y % 2 === 0) {
                offsetX = g / 2
            }
            ctx.fillRect(g / 2 + x * g + offsetX, g / 2 + y * g / 2, 4, 4)
        }
    }

    const url = new URL(event.request.url)
    const text = decodeURIComponent(url.pathname).slice(1)
    const imageSrc = url.searchParams.get('image') || url.searchParams.get('img') || 'https://deno.com/static/logo3.png'

    let imageWidth = parseInt(url.searchParams.get('width') || '0')
    let imageHeight = parseInt(url.searchParams.get('height') || '0')
    try {
        const img = await loadImage(imageSrc)
        const r = img.width() / img.height()
        if ((Number.isNaN(imageWidth) || imageWidth <= 0) && (Number.isNaN(imageHeight) || imageHeight <= 0)) {
            imageWidth = r * defaultHeight
            imageHeight = defaultHeight
        } else if (!Number.isNaN(imageWidth) && imageWidth > 0) {
            imageHeight = imageWidth / r
        } else if (!Number.isNaN(imageHeight) && imageHeight > 0) {
            imageWidth = r * imageHeight
        }
        ctx.drawImage(
            img,
            (canvasSize[0] - imageWidth) / 2,
            (canvasSize[1] - imageHeight) / 2 - (text ? spacing / 2 : 0),
            imageWidth,
            imageHeight
        )
    } catch (e) {
        console.log(e)
        event.respondWith(new Response(
            `invalid image: ${imageSrc}`,
            {
                status: 400,
                headers: { 'content-type': 'plain/text' },
            }
        ))
        return
    }

    if (text) {
        const fontSize = parseInt(url.searchParams.get('font-size') || '' + defaultFontSize)
        ctx.font = `italic bold ${fontSize}px Helvetica`
        ctx.fillStyle = '#111111'

        const t = ctx.measureText(text);
        ctx.fillText(text, (canvasSize[0] - t.width) / 2, (canvasSize[1] + imageHeight + spacing) / 2, canvasSize[0] - spacing * 2)
    }

    event.respondWith(new Response(
        canvas.toBuffer(),
        {
            headers: { 'content-type': 'image/png' },
        }
    ))
})