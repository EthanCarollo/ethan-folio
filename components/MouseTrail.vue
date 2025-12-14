<template>
    <div ref="p5Container" class="fixed inset-0 pointer-events-none -z-50 overflow-hidden"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const p5Container = ref<HTMLElement | null>(null);
let p5Instance: any = null;

onMounted(async () => {
    if (typeof window === 'undefined' || !p5Container.value) return;
    
    const p5 = (await import('p5')).default;
    
    const sketch = (p: any) => {
        const particles: Array<{
            x: number;
            y: number;
            lift: number;
            opacity: number;
        }> = [];
        
        const gridSize = 40;
        let mouseX = 0;
        let mouseY = 0;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let isMouseMoving = false;
        let mouseMoveTimeout: ReturnType<typeof setTimeout> | null = null;
        let canvasWidth = 0;
        let canvasHeight = 0;
        
        const initializeParticles = () => {
            particles.length = 0;
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            
            const cols = Math.ceil(canvasWidth / gridSize);
            const rows = Math.ceil(canvasHeight / gridSize);
            
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    particles.push({
                        x: col * gridSize + (gridSize / 2),
                        y: row * gridSize + (gridSize / 2),
                        lift: 0,
                        opacity: 0
                    });
                }
            }
        };
        
        p.setup = () => {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            p.createCanvas(canvasWidth, canvasHeight);
            p.noStroke();
            
            initializeParticles();
            
            mouseX = canvasWidth / 2;
            mouseY = canvasHeight / 2;
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        };
        
        p.windowResized = () => {
            if (window.innerWidth !== canvasWidth || window.innerHeight !== canvasHeight) {
                canvasWidth = window.innerWidth;
                canvasHeight = window.innerHeight;
                p.resizeCanvas(canvasWidth, canvasHeight);
                initializeParticles();
            }
        };
        
        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - lastMouseX;
            const dy = e.clientY - lastMouseY;
            const movement = Math.sqrt(dx * dx + dy * dy);
            
            if (movement > 2) {
                isMouseMoving = true;
                mouseX = e.clientX;
                mouseY = e.clientY;
                lastMouseX = mouseX;
                lastMouseY = mouseY;
                
                if (mouseMoveTimeout) {
                    clearTimeout(mouseMoveTimeout);
                }
                
                const timeoutDuration = movement > 50 ? 800 : 500;
                mouseMoveTimeout = setTimeout(() => {
                    isMouseMoving = false;
                }, timeoutDuration);
            }
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        
        p.draw = () => {
            p.clear();
            p.fill(255, 255, 255);
            
            particles.forEach((particle) => {
                if (!isMouseMoving) {
                    // Return to base when inactive
                    const spring = 0.05;
                    const damping = 0.95;
                    
                    particle.lift += (0 - particle.lift) * spring;
                    particle.lift *= damping;
                    particle.opacity *= 0.99;
                    
                    if (Math.abs(particle.lift) < 0.1) {
                        particle.lift = 0;
                    }
                    if (particle.opacity < 0.01) {
                        particle.opacity = 0;
                    }
                } else {
                    // Calculate distance from mouse
                    const mouseDx = mouseX - particle.x;
                    const mouseDy = mouseY - particle.y;
                    const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                    
                    const mouseActivationRadius = 180;
                    
                    if (mouseDistance < mouseActivationRadius) {
                        const mouseLift = (1 - mouseDistance / mouseActivationRadius) * 35;
                        const mouseOpacity = (1 - mouseDistance / mouseActivationRadius) * 0.9;
                        
                        const spring = 0.25;
                        const damping = 0.88;
                        
                        const liftDiff = -mouseLift - particle.lift;
                        particle.lift += liftDiff * spring;
                        particle.lift *= damping;
                        
                        particle.opacity = Math.min(0.9, Math.max(particle.opacity * 0.96, mouseOpacity));
                    } else {
                        const spring = 0.15;
                        const damping = 0.92;
                        
                        particle.lift += (0 - particle.lift) * spring;
                        particle.lift *= damping;
                        particle.opacity *= 0.96;
                    }
                }
                
                // Draw particle only if visible
                if (particle.opacity > 0.01) {
                    p.push();
                    p.translate(particle.x, particle.y + particle.lift);
                    p.fill(255, 255, 255, particle.opacity * 255);
                    p.circle(0, 0, 2);
                    p.pop();
                }
            });
        };
        
        // Cleanup function
        p.remove = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
        };
    };
    
    p5Instance = new p5(sketch, p5Container.value);
});

onUnmounted(() => {
    if (p5Instance) {
        p5Instance.remove();
    }
});
</script>

<style scoped>
/* Component styles */
</style>
