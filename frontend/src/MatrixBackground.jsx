import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
const canvasRef = useRef();

useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = Array(256).join('1').split('');
    const fontSize = 16;

    function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff'; // white text
    ctx.font = `${fontSize}px monospace`;

    letters.forEach((y_pos, index) => {
        const text = String.fromCharCode(33 + Math.random() * 94);
        const x = index * fontSize;
        const y = letters[index] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height + Math.random() * 10000) {
        letters[index] = 0;
        } else {
        letters[index]++;
        }
    });
    }

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
}, []);

return (
    <canvas
    ref={canvasRef}
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
        background: '#000',
    }}
    />
);
};

export default MatrixBackground;
