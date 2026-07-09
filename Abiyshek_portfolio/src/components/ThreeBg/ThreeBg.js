import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ThreeBg.css';

function ThreeBg() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        
        // Perspective Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 120;
        camera.position.y = 80;
        camera.rotation.x = -Math.PI / 4;

        // WebGL Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // --- CREATE PARTICLE WAVE ---
        const SEPARATION = 8;
        const AMOUNTX = 60;
        const AMOUNTY = 60;
        const numParticles = AMOUNTX * AMOUNTY;

        const positions = new Float32Array(numParticles * 3);
        const scales = new Float32Array(numParticles);

        let i = 0, j = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
                positions[i + 1] = 0;                                          // y
                positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z

                scales[j] = 1;

                i += 3;
                j++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        // Create a circular glowing particle texture programmatically
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
        const particleTexture = new THREE.CanvasTexture(canvas);

        // Material using active yellow theme color #FFC107
        const material = new THREE.PointsMaterial({
            color: 0xFFC107,
            size: 2.2,
            map: particleTexture,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // --- MOUSE TRACKING ---
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const onMouseMove = (event) => {
            mouseX = (event.clientX - window.innerWidth / 2);
            mouseY = (event.clientY - window.innerHeight / 2);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // --- RESIZE HANDLING ---
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', onWindowResize, { passive: true });

        // --- ANIMATION LOOP ---
        let count = 0;
        let animationFrameId;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Interpolate mouse targets (smooth lag effect)
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            // Shift camera rotation slightly based on mouse
            camera.position.x = (targetX * 0.08);
            camera.position.y = 80 + (-targetY * 0.08);
            camera.lookAt(scene.position);

            const positionAttribute = geometry.getAttribute('position');
            const scaleAttribute = geometry.getAttribute('scale');

            let index = 0;
            let scaleIndex = 0;

            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    // Update Y coordinates to generate flowing wave patterns
                    positionAttribute.array[index + 1] = 
                        (Math.sin((ix + count) * 0.3) * 12) +
                        (Math.sin((iy + count) * 0.5) * 12);

                    // Update scales dynamically for organic blinking/pulsing
                    scaleAttribute.array[scaleIndex] = 
                        (Math.sin((ix + count) * 0.3) + 1) * 1.5 +
                        (Math.sin((iy + count) * 0.5) + 1) * 1.5;

                    index += 3;
                    scaleIndex++;
                }
            }

            positionAttribute.needsUpdate = true;
            scaleAttribute.needsUpdate = true;

            renderer.render(scene, camera);
            count += 0.03; // speed of the wave flow
        };

        animate();

        // --- CLEANUP ---
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onWindowResize);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            particleTexture.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} className="three-bg-canvas" />;
}

export default ThreeBg;
