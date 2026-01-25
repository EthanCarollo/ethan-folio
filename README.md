# Ethan Carollo - Portfolio

A minimalist terminal-style portfolio website built with Nuxt 4.

## Tech Stack

- **Framework:** Nuxt 4
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Canvas:** P5.js for animations
- **Deployment:** Static hosting

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

The site is optimized for static hosting and can be deployed to:

- Any static host (we don't really care in fact)

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
