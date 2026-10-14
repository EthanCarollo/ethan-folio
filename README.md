# Ethan Carollo - Portfolio

A straightforward portfolio website built with Nuxt 4, with a separate chat interface at `/chat`.

## Tech Stack

- **Framework:** Nuxt 4
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Content:** Nuxt Content
- **Chat:** Server-side endpoint backed by OpenRouter
- **Deployment:** Static site generation; the chat API needs a server or serverless runtime

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The portfolio pages are generated as static files. The chat interface calls `server/api/chat.post.ts`, which builds a prompt from the portfolio content and sends it to OpenRouter. Configure `OPENROUTER_API_KEY` on the server and optionally set `OPENROUTER_MODEL` (default: `meta-llama/llama-3.3-70b-instruct`). The key stays on the server.

Deploy the API route to a Nuxt-compatible server or serverless runtime for chat responses. A static-only host can serve the `/chat` page, but cannot execute that API route.

---

Built with Nuxt 4 & TypeScript

## PS

> This can help you ;)

```sh
for f in *.mov *.mp4; do
    [ -e "$f" ] || continue
    ffmpeg -i "$f" \
        -c:v libvpx-vp9 \
        -crf 35 \
        -b:v 0 \
        -cpu-used 4 \
        -row-mt 1 \
        -threads 8 \
        -pix_fmt yuv420p \
        -c:a libopus -b:a 64k \
        "${f%.*}.webm"
done
```
