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

        const gridSize = 45;
        let mouseX = 0;
        let mouseY = 0;

        p.draw = () => {
            p.clear();

            if (isMouseMoving || mouseSpeed > 0.1) {
                p.stroke(0, 0, 0, 30);
                p.strokeWeight(0.5);

                const cols = Math.ceil(canvasWidth / gridSize);
                const rows = Math.ceil(canvasHeight / gridSize); // Recalculate if needed, or store.
                // Actually particles array is flat, but constructed row-by-row.
                // index = row * cols + col

                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const i = r * cols + c;
                        const p1 = particles[i];
                        if (!p1 || p1.opacity < 0.1) continue; // Skip invisible
                        // Check only if near mouse (optimization)
                        const dxm = mouseX - p1.currentX;
                        const dym = mouseY - p1.currentY;
                        if (dxm * dxm + dym * dym > 200 * 200) continue; // Only draw lines near mouse region

                        // Check Right Neighbor
                        if (c < cols - 1) {
                            const p2 = particles[i + 1];
                            if (p2 && p2.opacity > 0.1) {
                                const d = Math.sqrt(Math.pow(p1.currentX - p2.currentX, 2) + Math.pow(p1.currentY - p2.currentY, 2));
                                if (d < gridSize * 1.5) {
                                    p.line(p1.currentX, p1.currentY, p2.currentX, p2.currentY);
                                }
                            }
                        }

                        // Check Bottom Neighbor
                        if (r < rows - 1) {
                            const p2 = particles[i + cols];
                            if (p2 && p2.opacity > 0.1) {
                                const d = Math.sqrt(Math.pow(p1.currentX - p2.currentX, 2) + Math.pow(p1.currentY - p2.currentY, 2));
                                if (d < gridSize * 1.5) {
                                    p.line(p1.currentX, p1.currentY, p2.currentX, p2.currentY);
                                }
                            }
                        }
                    }
                }

                p.noStroke();
            }
        };
        let prevMouseX = 0;
        let prevMouseY = 0;
        let isMouseMoving = false;
        let mouseMoveTimeout: ReturnType<typeof setTimeout> | null = null;
        let canvasWidth = 0;
        let canvasHeight = 0;

        const initializeParticles = () => {
            particles.length = 0;
            canvasWidth = window.innerWidth;
            // Utiliser la hauteur maximale entre la fenêtre et le contenu de la page
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight, 
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            canvasHeight = Math.max(window.innerHeight, documentHeight);

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
                // Recalculer la hauteur du document lors du redimensionnement
                const documentHeight = Math.max(
                    document.body.scrollHeight,
                    document.body.offsetHeight, 
                    document.documentElement.clientHeight,
                    document.documentElement.scrollHeight,
                    document.documentElement.offsetHeight
                );
                canvasHeight = Math.max(window.innerHeight, documentHeight);
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

        let scrollY = 0;

        const handleScroll = () => {
            scrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);

        p.draw = () => {
            p.clear();

            // Calculate mouse velocity for dynamic effects
            const mouseVelX = mouseX - prevMouseX;
            const mouseVelY = mouseY - prevMouseY;
            const mouseSpeed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);

            // Time variable for waves
            const time = p.millis() * 0.001;

            // Grid total height for wrapping
            const rows = Math.ceil(canvasHeight / gridSize);
            const totalGridHeight = rows * gridSize;

            particles.forEach((particle) => {
                // Calcul de la position avec wrapping fluide
                let rawY = particle.baseY - scrollY * 0.5;
                
                // Wrapping fluide : créer des copies virtuelles au-dessus et en-dessous
                let effectiveBaseY = rawY;
                let bestDistance = Math.abs(rawY - particle.currentY);
                
                // Tester différentes positions wrapped pour trouver la plus proche
                const testPositions = [
                    rawY,
                    rawY + totalGridHeight,
                    rawY - totalGridHeight,
                    rawY + totalGridHeight * 2,
                    rawY - totalGridHeight * 2
                ];
                
                // Choisir la position la plus proche de la position actuelle pour une transition fluide
                for (const testY of testPositions) {
                    const distance = Math.abs(testY - particle.currentY);
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        effectiveBaseY = testY;
                    }
                }
                const dx = mouseX - particle.baseX; // Interaction is based on screen coordinates vs original X? 
                // Wait, if the particle moves up, its X is same, but Y changes.
                // Interaction should be based on CURRENT position relative to mouse.

                // Let's use the effectiveBaseY for interaction calculation
                const particleScreenY = effectiveBaseY;
                const particleScreenX = particle.baseX;

                const dx_int = mouseX - particleScreenX;
                const dy_int = mouseY - particleScreenY;
                const distanceToMouse = Math.sqrt(dx_int * dx_int + dy_int * dy_int);

                const attractionRadius = 250; // Increased interaction radius
                const innerRadius = 40;

                // Automated Wave Logic (using the scrolling world coordinates for continuity)
                const worldY = particle.baseY - scrollY * 0.5; // Use unwrapped Y for wave continuity? 
                // proper wave continuity needs time + space. 
                // If we use screen Y (effectiveBaseY), the wave will stay static on screen while particles move through it?
                // If we use worldY, the wave moves with the particles.
                // User wants perspective of scrolling... so moving through the wave field.

                const waveX = particleScreenX * 0.01;
                const waveY = (worldY) * 0.01; // Use world Y for wave pattern

                // Complex wave pattern
                const wave1 = Math.sin(waveX * 5 + time) * Math.cos(waveY * 3 + time * 0.5) * 15;
                const wave2 = Math.sin(waveX * 2 - time * 1.5) * Math.sin(waveY * 2 + time * 1.2) * 10;
                const totalWaveOffset = wave1 + wave2;

                // Probability of wave appearing or intensifying (automated "sometimes")
                const globalWaveStrength = (Math.sin(time * 0.5) + 1) * 0.5; // 0 to 1

                let targetX = particleScreenX;
                // Apply wave offset to the calculated screen position
                let targetY = particleScreenY + totalWaveOffset * globalWaveStrength;

                if (isMouseMoving && distanceToMouse < attractionRadius) {
                    // Interaction Logic...
                    const attractionStrength = 1 - (distanceToMouse / attractionRadius);
                    const dirX = dx_int / (distanceToMouse || 1);
                    const dirY = dy_int / (distanceToMouse || 1);

                    if (distanceToMouse > innerRadius) {
                        const pullDistance = (distanceToMouse - innerRadius) * attractionStrength * 0.6;
                        targetX = targetX + dirX * pullDistance;
                        targetY = targetY + dirY * pullDistance;
                    } else {
                        const pushForce = (innerRadius - distanceToMouse) * 0.4;
                        targetX = targetX - dirX * pushForce;
                        targetY = targetY - dirY * pushForce;
                    }

                    const swirlFactor = mouseSpeed * 0.15 * attractionStrength;
                    targetX += -dirY * swirlFactor;
                    targetY += dirX * swirlFactor;

                    particle.opacity += (0.8 - particle.opacity) * 0.1;
                    particle.size += (4 - particle.size) * 0.1;

                } else {
                    if (distanceToMouse < attractionRadius * 0.8) {
                        const localDistFactor = 1 - (distanceToMouse / (attractionRadius * 0.8));
                        const dirX = dx_int / (distanceToMouse || 1);
                        const dirY = dy_int / (distanceToMouse || 1);

                        targetX -= dirX * 20 * localDistFactor;
                        targetY -= dirY * 20 * localDistFactor;

                        particle.opacity += (0.5 - particle.opacity) * 0.05;
                    } else {
                        const waveOpacity = Math.abs(totalWaveOffset) / 15 * globalWaveStrength * 0.5;
                        particle.opacity += (waveOpacity - particle.opacity) * 0.05;
                        particle.size += (2 - particle.size) * 0.1;
                    }
                }

                // Spring physics
                const spring = 0.1;
                const damping = 0.8;

                // NOTE: particle.currentX/Y are screen coordinates now for drawing
                // But we need to be careful if we are wrapping.
                // If a particle wraps, currentY needs to jump. 
                // Simplest: Just set currentY to targetY if distance is huge (wrap happened)

                if (Math.abs(targetY - particle.currentY) > totalGridHeight / 2) {
                    particle.currentY = targetY; // Snap on wrap
                }

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
                    p.fill(0, 0, 0, particle.opacity * 255);
                    p.circle(0, 0, particle.size);
                    p.pop();
                }
            });

            // Draw lines logic needs update to use current positions (which is already does)
            // But optimize to only check on screen particles
            if (isMouseMoving || mouseSpeed > 0.1) {
                p.stroke(0, 0, 0, 30);
                p.strokeWeight(0.5);

                // Filter optimization: Check if particle is actually on screen? 
                // Implicitly handled by distance check to mouse usually

                const nearParticles = particles.filter(part => {
                    // Quick bound check before distance
                    if (part.currentY < -50 || part.currentY > canvasHeight + 50) return false;

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
                            p.stroke(0, 0, 0, alpha);
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
            window.removeEventListener('scroll', handleScroll);
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
