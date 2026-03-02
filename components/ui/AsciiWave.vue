<template>
    <div ref="sketchContainer" class="ascii-wave-container w-full h-full select-none pointer-events-none"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const sketchContainer = ref(null)
let myP5 = null

onMounted(async () => {
    // Dynamically import p5 so it doesn't break Nuxt SSR
    const p5 = (await import('p5')).default
    
    // Configure ASCII characters to use from least to most dense
    const density = " _.,-=+:;cba!?0123456789$W#@Ñ";
    
    const sketch = (p) => {
        let cols, rows;
        const scl = 20; // Scale of each ASCII character
        let zoff = 0; // Z-offset for perlin noise evolution

        p.setup = () => {
            p.disableFriendlyErrors = true; // Disable FES for performance
            
            const container = sketchContainer.value;
            if (!container) return;
            
            const canvas = p.createCanvas(container.clientWidth, container.clientHeight);
            canvas.parent(container);
            p.textFont('monospace');
            p.textSize(scl);
            p.textAlign(p.CENTER, p.CENTER);
            
            cols = p.floor(p.width / scl) + 1;
            rows = p.floor(p.height / scl) + 1;
        }

        p.draw = () => {
            p.clear(); // Transparent background
            p.fill(255); // White text color

            let yoff = 0;
            for (let y = 0; y < rows; y++) {
                let xoff = 0;
                for (let x = 0; x < cols; x++) {
                    // Generate 3D perlin noise value
                    const noiseVal = p.noise(xoff, yoff, zoff);
                    // Map noise value to character index
                    const charIndex = p.floor(p.map(noiseVal, 0, 1, 0, density.length));
                    const char = density.charAt(charIndex);
                    
                    p.text(char, x * scl + scl / 2, y * scl + scl / 2);
                    xoff += 0.08;
                }
                yoff += 0.08;
            }
            zoff += 0.02; // Animate the wave
        }
        
        p.windowResized = () => {
            const container = sketchContainer.value;
            if (!container) return;
            p.resizeCanvas(container.clientWidth, container.clientHeight);
            cols = p.floor(p.width / scl) + 1;
            rows = p.floor(p.height / scl) + 1;
        }
    }
    
    myP5 = new p5(sketch)
})

onBeforeUnmount(() => {
    if (myP5) {
        myP5.remove()
    }
})
</script>

<style scoped>
.ascii-wave-container {
    overflow: hidden;
}
</style>
