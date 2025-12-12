<template>
    <div ref="p5Container" class="fixed inset-0 pointer-events-none -z-50"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const p5Container = ref<HTMLElement | null>(null);
let p5Instance: any = null;

onMounted(async () => {
    if (typeof window === 'undefined' || !p5Container.value) return;
    
    // Dynamically import p5.js
    const p5 = (await import('p5')).default;
    
    const sketch = (p: any) => {
        const particles: Array<{
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            lift: number;
            opacity: number;
            vx: number;
            vy: number;
        }> = [];
        
        const gridSize = 40;
        let mouseX = 0;
        let mouseY = 0;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let isMouseMoving = false;
        let isScrolling = false;
        let mouseMoveTimeout: ReturnType<typeof setTimeout> | null = null;
        let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
        let canvasWidth = 0;
        let canvasHeight = 0;
        
        const getDocumentSize = () => {
            if (typeof document === 'undefined') return { w: window.innerWidth, h: window.innerHeight };
            return {
                w: window.innerWidth, // Limiter à la largeur de la fenêtre pour éviter l'overflow horizontal
                h: Math.max(
                    document.documentElement.scrollHeight,
                    document.body.scrollHeight,
                    window.innerHeight
                )
            };
        };
        
        const initializeParticles = () => {
            particles.length = 0;
            const size = getDocumentSize();
            canvasWidth = size.w;
            canvasHeight = size.h;
            
            const cols = Math.ceil(canvasWidth / gridSize);
            const rows = Math.ceil(canvasHeight / gridSize);
            
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    particles.push({
                        x: col * gridSize + (gridSize / 2),
                        y: row * gridSize + (gridSize / 2),
                        baseX: col * gridSize + (gridSize / 2),
                        baseY: row * gridSize + (gridSize / 2),
                        lift: 0,
                        opacity: 0,
                        vx: 0,
                        vy: 0
                    });
                }
            }
        };
        
        p.setup = () => {
            const size = getDocumentSize();
            canvasWidth = size.w;
            canvasHeight = size.h;
            p.createCanvas(canvasWidth, canvasHeight);
            p.noStroke();
            
            initializeParticles();
            
            mouseX = window.innerWidth / 2;
            mouseY = window.innerHeight / 2;
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        };
        
        p.windowResized = () => {
            const size = getDocumentSize();
            if (size.w !== canvasWidth || size.h !== canvasHeight) {
                canvasWidth = size.w;
                canvasHeight = size.h;
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
                
                // Augmenter le timeout pour les mouvements rapides
                const timeoutDuration = movement > 50 ? 800 : 500;
                mouseMoveTimeout = setTimeout(() => {
                    isMouseMoving = false;
                }, timeoutDuration);
            }
        };
        
        const handleScroll = () => {
            const size = getDocumentSize();
            if (size.h !== canvasHeight) {
                canvasHeight = size.h;
                p.resizeCanvas(canvasWidth, canvasHeight);
                initializeParticles();
            }
            
            const scrollDelta = Math.abs(window.scrollY - lastMouseY);
            
            if (scrollDelta > 1) {
                isScrolling = true;
                
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 150);
            }
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('wheel', handleScroll, { passive: true });
        
        // Check document size periodically
        const sizeCheckInterval = setInterval(() => {
            const size = getDocumentSize();
            if (size.w !== canvasWidth || size.h !== canvasHeight) {
                canvasWidth = size.w;
                canvasHeight = size.h;
                p.resizeCanvas(canvasWidth, canvasHeight);
                initializeParticles();
            }
        }, 500);
        
        p.draw = () => {
            p.clear();
            p.fill(255, 255, 255);
            
            const isActive = isMouseMoving || isScrolling;
            const scrollY = window.scrollY;
            const viewportCenterY = scrollY + (window.innerHeight / 2);
            
            particles.forEach((particle) => {
                if (!isActive) {
                    // Return to base when inactive
                    const spring = 0.05;
                    const damping = 0.95;
                    
                    particle.lift += (0 - particle.lift) * spring;
                    particle.lift *= damping;
                    particle.opacity *= 0.995;
                    
                    if (Math.abs(particle.lift) < 0.1) {
                        particle.lift = 0;
                    }
                    if (particle.opacity < 0.01) {
                        particle.opacity = 0;
                    }
                } else {
                    // Calculate distance from mouse (accounting for scroll)
                    const mouseDx = mouseX - particle.x;
                    const mouseDy = (mouseY + scrollY) - particle.y;
                    const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                    
                    // Scroll effect
                    const scrollDy = particle.y - viewportCenterY;
                    const scrollDistance = Math.abs(scrollDy);
                    
                    const mouseActivationRadius = 180;
                    const scrollActivationRadius = 200;
                    
                    let targetLift = 0;
                    let targetOpacity = 0;
                    
                    // Mouse effect
                    if (isMouseMoving && mouseDistance < mouseActivationRadius) {
                        const mouseLift = (1 - mouseDistance / mouseActivationRadius) * 35;
                        const mouseOpacity = (1 - mouseDistance / mouseActivationRadius) * 0.9;
                        targetLift = Math.max(targetLift, -mouseLift);
                        targetOpacity = Math.max(targetOpacity, mouseOpacity);
                        
                        // Ajouter un effet de vitesse pour les mouvements rapides
                        const speed = Math.sqrt(
                            Math.pow(mouseX - lastMouseX, 2) + 
                            Math.pow(mouseY - lastMouseY, 2)
                        );
                        if (speed > 20) {
                            targetOpacity = Math.min(1.0, targetOpacity * 1.3);
                        }
                    }
                    
                    // Scroll effect
                    if (isScrolling && scrollDistance < scrollActivationRadius) {
                        const scrollLift = (1 - scrollDistance / scrollActivationRadius) * 20;
                        const scrollOpacity = (1 - scrollDistance / scrollActivationRadius) * 0.7;
                        targetLift = Math.max(targetLift, -scrollLift);
                        targetOpacity = Math.max(targetOpacity, scrollOpacity);
                    }
                    
                    if (targetLift < 0 || targetOpacity > 0) {
                        const spring = 0.25;
                        const damping = 0.88;
                        
                        const liftDiff = targetLift - particle.lift;
                        particle.lift += liftDiff * spring;
                        particle.lift *= damping;
                        
                        particle.opacity = Math.min(0.9, Math.max(particle.opacity * 0.96, targetOpacity));
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
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('wheel', handleScroll);
            if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
            if (scrollTimeout) clearTimeout(scrollTimeout);
            clearInterval(sizeCheckInterval);
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
