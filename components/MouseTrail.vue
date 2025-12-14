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

            // Time variable for waves
            const time = p.millis() * 0.001;

            particles.forEach((particle) => {
                const dx = mouseX - particle.baseX;
                const dy = mouseY - particle.baseY;
                const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

                const attractionRadius = 250; // Increased interaction radius
                const innerRadius = 40;

                // Automated Wave Logic
                // Create a wave that moves through the grid
                // Use perlin noise or sin waves based on position and time
                const waveX = particle.baseX * 0.01;
                const waveY = particle.baseY * 0.01;

                // Complex wave pattern
                const wave1 = Math.sin(waveX * 5 + time) * Math.cos(waveY * 3 + time * 0.5) * 15;
                const wave2 = Math.sin(waveX * 2 - time * 1.5) * Math.sin(waveY * 2 + time * 1.2) * 10;
                const totalWaveOffset = wave1 + wave2;

                // Probability of wave appearing or intensifying (automated "sometimes")
                // We'll use a slow moving noise/sine to modulate the overall wave strength
                const globalWaveStrength = (Math.sin(time * 0.5) + 1) * 0.5; // 0 to 1

                let targetX = particle.baseX;
                let targetY = particle.baseY + totalWaveOffset * globalWaveStrength;

                if (isMouseMoving && distanceToMouse < attractionRadius) {
                    // Calculate attraction strength
                    const attractionStrength = 1 - (distanceToMouse / attractionRadius);

                    // Direction towards mouse
                    const dirX = dx / (distanceToMouse || 1);
                    const dirY = dy / (distanceToMouse || 1);

                    if (distanceToMouse > innerRadius) {
                        // Attract towards cursor but stop at inner radius
                        const pullDistance = (distanceToMouse - innerRadius) * attractionStrength * 0.6;
                        targetX = targetX + dirX * pullDistance; // Blend with wave position
                        targetY = targetY + dirY * pullDistance;
                    } else {
                        // Push away slightly if too close (creates the ring effect)
                        const pushForce = (innerRadius - distanceToMouse) * 0.4; // Stronger push
                        targetX = targetX - dirX * pushForce;
                        targetY = targetY - dirY * pushForce;
                    }

                    // Add some swirl based on mouse velocity
                    const swirlFactor = mouseSpeed * 0.15 * attractionStrength;
                    targetX += -dirY * swirlFactor;
                    targetY += dirX * swirlFactor;

                    // Interaction intensifies partcile
                    particle.opacity += (0.8 - particle.opacity) * 0.1;
                    particle.size += (4 - particle.size) * 0.1;

                } else {
                    // Interaction when mouse is static but close (hovering near wave)
                    if (distanceToMouse < attractionRadius * 0.8) {
                        const localDistFactor = 1 - (distanceToMouse / (attractionRadius * 0.8));

                        // Gentle push away from mouse to create a disturbance in the wave
                        const dirX = dx / (distanceToMouse || 1);
                        const dirY = dy / (distanceToMouse || 1);

                        targetX -= dirX * 20 * localDistFactor;
                        targetY -= dirY * 20 * localDistFactor;

                        particle.opacity += (0.5 - particle.opacity) * 0.05;
                    } else {
                        // Return to base wave state
                        const waveOpacity = Math.abs(totalWaveOffset) / 15 * globalWaveStrength * 0.5;
                        particle.opacity += (waveOpacity - particle.opacity) * 0.05;
                        particle.size += (2 - particle.size) * 0.1;
                    }
                }

                // Spring physics to move towards target
                const spring = 0.1;
                const damping = 0.8;

                particle.vx += (targetX - particle.currentX) * spring;
                particle.vy += (targetY - particle.currentY) * spring;
                particle.vx *= damping;
                particle.vy *= damping;

                particle.currentX += particle.vx;
                particle.currentY += particle.vy;

                // Draw particle only if visible
                if (particle.opacity > 0.01) {
                    p.push();
                    p.translate(particle.currentX, particle.currentY);

                    // Main particle
                    p.fill(255, 255, 255, particle.opacity * 255);
                    p.circle(0, 0, particle.size);
                    p.pop();
                }
            });

            // Draw lines for interconnection - only near mouse for performance
            if (isMouseMoving || mouseSpeed > 0.1) {
                p.stroke(255, 255, 255, 30);
                p.strokeWeight(0.5);

                const nearParticles = particles.filter(part => {
                    const d = Math.sqrt(
                        Math.pow(mouseX - part.currentX, 2) +
                        Math.pow(mouseY - part.currentY, 2)
                    );
                    return d < 120 && part.opacity > 0.2;
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
                            const alpha = (1 - d / 60) * 50;
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
