
let animationStarted = false;
const canvas = document.getElementById('hyperCanvas');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 400;
let w, h;

function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    createStars(); // Importante: recalcula las estrellas para el nuevo tamaño
}

function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: (Math.random() - 0.5) * w,
            y: (Math.random() - 0.5) * h,
            z: Math.random() * w,
            color: `rgba(255,255,255,${Math.random() * 0.8 + 0.2})`,
        });
    }
}

function drawStars() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);
    
    for (let star of stars) {
        let sx = (star.x / star.z) * w + w / 2;
        let sy = (star.y / star.z) * h + h / 2;
        
        let px = (star.x / (star.z + 40)) * w + w / 2;
        let py = (star.y / (star.z + 40)) * h + h / 2;
        
        ctx.beginPath();
        ctx.strokeStyle = star.color;
        ctx.lineWidth = 1.5;
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
        
        star.z -= 25;
        if (star.z < 1) {
            star.z = w;
        }
    }
}

function animate() {
    drawStars();
    requestAnimationFrame(animate);
}

// impide reiniciar animación -LGS
function startAnimation() {
    if (animationStarted) return;
    animationStarted = true;
    resizeCanvas();
    createStars();
    animate();
}

window.addEventListener('resize', resizeCanvas);
document.addEventListener('DOMContentLoaded', startAnimation);
