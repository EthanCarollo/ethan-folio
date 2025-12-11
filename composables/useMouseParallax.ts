export const useMouseParallax = () => {
    const mousePos = ref({ x: 0, y: 0 });
    const normalizedPos = ref({ x: 0, y: 0 });
    let animationFrameId: number | null = null;

    const updateNormalizedPos = () => {
        if (typeof window === 'undefined') return;
        
        // Normalize mouse position to -1 to 1 range
        normalizedPos.value = {
            x: (mousePos.value.x / window.innerWidth) * 2 - 1,
            y: (mousePos.value.y / window.innerHeight) * 2 - 1
        };

        // Apply spring physics for smooth movement
        const spring = 0.15;
        const currentX = normalizedPos.value.x;
        const currentY = normalizedPos.value.y;
        
        // This will be used by components to get smooth values
        animationFrameId = requestAnimationFrame(updateNormalizedPos);
    };

    const handleMouseMove = (e: MouseEvent) => {
        mousePos.value = { x: e.clientX, y: e.clientY };
    };

    onMounted(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', handleMouseMove);
            updateNormalizedPos();
        }
    });

    onUnmounted(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }
    });

    return {
        mousePos: readonly(mousePos),
        normalizedPos: readonly(normalizedPos)
    };
};

