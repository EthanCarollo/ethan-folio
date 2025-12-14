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
            baseX: number;
            baseY: number;
            currentX: number;
            currentY: number;
            vx: number;
            vy: number;
            opacity: number;
            size: number;
        }> = [];
        
        const gridSize = 35;
        let mouseX = 0;
        let mouseY = 0;
        let prevMouseX = 0;
        let prevMouseY = 0;
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
                    const x = col * gridSize + (gridSize / 2);
                    const y = row * gridSize + (gridSize / 2);
                    particles.push({
                        x: x,
                        y: y,
                        baseX: x,
                        baseY: y,
                        currentX: x,
                        currentY: y,
                        vx: 0,
                        vy: 0,
                        opacity: 0,
                        size: 2
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
            prevMouseX = mouseX;
            prevMouseY = mouseY;
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
            prevMouseX = mouseX;
            prevMouseY = mouseY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            const dx = mouseX - prevMouseX;
            const dy = mouseY - prevMouseY;
            const movement = Math.sqrt(dx * dx + dy * dy);
            
            if (movement > 1) {
                isMouseMoving = true;
                
                if (mouseMoveTimeout) {
                    clearTimeout(mouseMoveTimeout);
                }
                
                const timeoutDuration = Math.min(800, 300 + movement * 5);
                mouseMoveTimeout = setTimeout(() => {
                    isMouseMoving = false;
                }, timeoutDuration);
            }
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        
        p.draw = () => {
            p.clear();
            
            // Calculate mouse velocity for dynamic effects
            const mouseVelX = mouseX - prevMouseX;
            const mouseVelY = mouseY - prevMouseY;
            const mouseSpeed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);
            
            particles.forEach((particle) => {
                const dx = mouseX - particle.baseX;
                const dy = mouseY - particle.baseY;
                const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
                
                const attractionRadius = 200;
                const innerRadius = 40; // Particles form a ring around cursor
                
                if (isMouseMoving && distanceToMouse < attractionRadius) {
                    // Calculate attraction strength
                    const attractionStrength = 1 - (distanceToMouse / attractionRadius);
                    
                    // Direction towards mouse
                    const dirX = dx / (distanceToMouse || 1);
                    const dirY = dy / (distanceToMouse || 1);
                    
                    // Target position - particles gather around the cursor in a ring
                    let targetX, targetY;
                    
                    if (distanceToMouse > innerRadius) {
                        // Attract towards cursor but stop at inner radius
                        const pullDistance = (distanceToMouse - innerRadius) * attractionStrength * 0.6;
                        targetX = particle.baseX + dirX * pullDistance;
                        targetY = particle.baseY + dirY * pullDistance;
                    } else {
                        // Push away slightly if too close (creates the ring effect)
                        const pushForce = (innerRadius - distanceToMouse) * 0.3;
                        targetX = particle.baseX - dirX * pushForce;
                        targetY = particle.baseY - dirY * pushForce;
                    }
                    
                    // Add some swirl based on mouse velocity
                    const swirlFactor = mouseSpeed * 0.1 * attractionStrength;
                    targetX += -dirY * swirlFactor;
                    targetY += dirX * swirlFactor;
                    
                    // Spring physics to move towards target
                    const spring = 0.15;
                    const damping = 0.75;
                    
                    particle.vx += (targetX - particle.currentX) * spring;
                    particle.vy += (targetY - particle.currentY) * spring;
                    particle.vx *= damping;
                    particle.vy *= damping;
                    
                    particle.currentX += particle.vx;
                    particle.currentY += particle.vy;
                    
                    // Opacity based on distance and attraction
                    const targetOpacity = attractionStrength * 0.9;
                    particle.opacity += (targetOpacity - particle.opacity) * 0.2;
                    
                    // Size variation based on proximity
                    const targetSize = 2 + attractionStrength * 3;
                    particle.size += (targetSize - particle.size) * 0.15;
                    
                } else {
                    // Return to base position
                    const spring = 0.08;
                    const damping = 0.85;
                    
                    particle.vx += (particle.baseX - particle.currentX) * spring;
                    particle.vy += (particle.baseY - particle.currentY) * spring;
                    particle.vx *= damping;
                    particle.vy *= damping;
                    
                    particle.currentX += particle.vx;
                    particle.currentY += particle.vy;
                    
                    // Fade out
                    particle.opacity *= 0.95;
                    particle.size += (2 - particle.size) * 0.1;
                }
                
                // Draw particle only if visible
                if (particle.opacity > 0.02) {
                    p.push();
                    p.translate(particle.currentX, particle.currentY);
                    
                    // Subtle glow effect for particles near cursor
                    if (particle.opacity > 0.3) {
                        p.fill(255, 255, 255, particle.opacity * 100);
                        p.circle(0, 0, particle.size * 2);
                    }
                    
                    // Main particle
                    p.fill(255, 255, 255, particle.opacity * 255);
                    p.circle(0, 0, particle.size);
                    p.pop();
                }
            });
            
            // Draw subtle connection lines between close particles near cursor
            if (isMouseMoving) {
                p.stroke(255, 255, 255, 30);
                p.strokeWeight(0.5);
                
                const nearParticles = particles.filter(part => {
                    const d = Math.sqrt(
                        Math.pow(mouseX - part.currentX, 2) + 
                        Math.pow(mouseY - part.currentY, 2)
                    );
                    return d < 100 && part.opacity > 0.3;
                });
                
                for (let i = 0; i < nearParticles.length; i++) {
                    for (let j = i + 1; j < nearParticles.length; j++) {
                        const p1 = nearParticles[i];
                        const p2 = nearParticles[j];
                        const d = Math.sqrt(
                            Math.pow(p1.currentX - p2.currentX, 2) + 
                            Math.pow(p1.currentY - p2.currentY, 2)
                        );
                        
                        if (d < 60) {
                            const alpha = (1 - d / 60) * 40;
                            p.stroke(255, 255, 255, alpha);
                            p.line(p1.currentX, p1.currentY, p2.currentX, p2.currentY);
                        }
                    }
                }
                
                p.noStroke();
            }
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
