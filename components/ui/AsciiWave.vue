<template>
    <div ref="sketchContainer" class="ascii-wave-container w-full h-full select-none pointer-events-none"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const sketchContainer = ref(null)
let myP5 = null

const handleScroll = () => {
    if (!myP5) return;
    
    const scrollY = window.scrollY;
    // Hero section height is roughly 100vh
    const vh = window.innerHeight;
    
    if (scrollY > vh) {
        // Pauses all canvas calculations and renders
        myP5.noLoop();
    } else {
        // Slow down framerate proportionally to scroll depth (max 24fps, min 2fps)
        const progress = scrollY / vh;
        const fps = Math.max(2, Math.floor(24 * (1 - progress)));
        
        myP5.frameRate(fps);
        
        // Ensure looping resumes if scrolling back up
        if (!myP5.isLooping()) {
            myP5.loop();
        }
    }
};

onMounted(async () => {
    // Dynamically import p5 so it doesn't break Nuxt SSR
    const p5 = (await import('p5')).default
    
    // Configure ASCII characters to use from least to most dense
    const density = " _.,-=+:;cba!?0123456789$W#@Ñ";
    
    const sketch = (p) => {
        let cols, rows;
        // Increase scale to reduce the number of characters computed and drawn
        const scl = 25; 
        let zoff = 0; 
        
        p.setup = () => {
            p.disableFriendlyErrors = true; 
            
            const container = sketchContainer.value;
            if (!container) return;
            
            // Limit pixel density so high-DPI screens don't choke
            p.pixelDensity(1);
            
            const canvas = p.createCanvas(container.clientWidth, container.clientHeight);
            canvas.parent(container);
            p.textFont('monospace');
            p.textSize(scl);
            p.textAlign(p.CENTER, p.CENTER);
            
            // Limit frame rate to save battery and CPU on mobile/low-end PCs
            p.frameRate(24);
            
            cols = p.floor(p.width / scl) + 1;
            rows = p.floor(p.height / scl) + 1;
        }

        p.draw = () => {
            p.clear(); 
            p.fill(255); 

            const centerX = p.width / 2;
            const centerY = p.height / 2;
            const maxDist = p.dist(0, 0, centerX, centerY);

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const posX = x * scl + scl / 2;
                    const posY = y * scl + scl / 2;
                    
                    // Calculate distance from center for radial effect
                    const d = p.dist(posX, posY, centerX, centerY);
                    // Normalize distance
                    const normD = d / maxDist;
                    
                    // Use radial distance and angle for noise
                    const angle = p.atan2(posY - centerY, posX - centerX);
                    
                    // The "expansion" comes from subtracting zoff from the distance component
                    // Adjusting the multipliers (0.5, 2, 0.5) to fine-tune the "fluidity"
                    const noiseVal = p.noise(
                        normD * 2 - zoff * 0.5, 
                        p.cos(angle) * 0.5 + 0.5, 
                        p.sin(angle) * 0.5 + zoff * 0.2
                    );
                    
                    const charIndex = (p.map(noiseVal, 0.2, 0.8, 0, density.length, true)) >> 0;
                    
                    if (charIndex >= 0 && charIndex < density.length) {
                        const char = density.charAt(charIndex);
                        p.text(char, posX, posY);
                    }
                }
            }
            zoff += 0.01; // Slower, smoother progression
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
    
    // Bind scroll handler
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial call to set correct framerate or pause state
    handleScroll()
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
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
