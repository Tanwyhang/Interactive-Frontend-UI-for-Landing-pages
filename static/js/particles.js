// static/js/particles.js

// Get canvas and context
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Particle array
let particlesArray = [];
const particleCount = 60;
const repulsionRadius = canvas.width / 8; // Adjust this value as needed
const connectionDistance = canvas.width / 7; // Distance at which particles are connected by lines
const universal_offset = canvas.width / 20;

// Mouse object to track mouse position
const mouse = {
    x: null,
    y: null
};

// Update mouse position on mouse move
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Calculate the center of the canvas
const center = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 1.2;
        this.x_offset = this.x;
        this.y_offset = this.y;
        this.size = Math.random() * 5 + 1; // Particle size
        this.const_speed = canvas.width / 10000 * 1.4;

        this.x_actual = this.x;
        this.y_actual = this.y;
    }

    // Draw the particle
    draw() {
        const distance = this.getDistanceFromMouse();
        const color = this.getColorBasedOnDistance(distance);
        ctx.fillStyle = color; // Dynamic color based on distance
        // ctx.fillStyle = '#ffffff'; // White color for particles
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    // Update particle position with inverse mouse movement
    update() {
        // Keep particles within canvas bounds
        if (this.x > canvas.width + universal_offset) {
            this.x_offset -= canvas.width + universal_offset;
            this.x = 0 - universal_offset;
        }

        if (this.x < 0 - universal_offset) {
            this.x_offset += canvas.width;
            this.x = canvas.width;
        }

        // Update particle position based on modified formula
        this.x_actual = (mouse.x + (mouse.x - center.x)) * -1 * 0.02 * this.size + this.x_offset; // Modified X movement
        this.y_actual = (mouse.y + (mouse.y - center.y)) * -1 * 0.04 + this.y_offset; // Modified Y movement

        // Check distance from mouse
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repulsion effect
        if (distance < repulsionRadius) {
            const angle = Math.atan2(dy, dx); // Get angle from particle to mouse
            const force = (repulsionRadius - distance) / repulsionRadius * 70; // Calculate strength of repulsion based on distance

            // Update particle's position based on repulsion force
            this.x_actual += Math.cos(angle) * force * this.size; // Move particle away from mouse
            this.y_actual += Math.sin(angle) * force; // Move particle away from mouse
        }

        // Constant movement
        this.x_offset += this.const_speed * this.size;

        // Reposition xy final
        this.x += (this.x_actual - this.x) / 10;
        this.y += (this.y_actual - this.y) / 10;

        
    }

    // Calculate the distance between the particle and the mouse
    getDistanceFromMouse() {
        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
        return Infinity; // If mouse position is not available, return a large value
    }

    // Get color based on distance from the mouse
    getColorBasedOnDistance(distance) {
        const maxDistance = 200; // Maximum distance for full color transition
        const normalizedDistance = Math.min(distance / maxDistance, 1); // Normalize distance (0 to 1)

        // Interpolate between white and orange
        const red = Math.floor(255 - normalizedDistance * (255 - 255)); // Orange has red=255
        const green = Math.floor(255 - normalizedDistance * (255 - 87)); // Orange has green=87
        const blue = Math.floor(255 - normalizedDistance * (255 - 34)); // Orange has blue=34
        const trans = Math.floor(255 - normalizedDistance);

        return `rgba(${red}, ${green}, ${blue}, 0.75)`;
    }
}

// Function to draw lines between particles
function connectParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Draw line if particles are close enough
            if (distance < connectionDistance) {
                // Calculate transparency based on distance
                const transparency = 1 - (distance / connectionDistance) ** 2; // 1 (opaque) to 0 (transparent)
                ctx.strokeStyle = `rgba(255, 87, 24, ${transparency})`; // Set line color with transparency
                ctx.lineWidth = 1; // Line width
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

// Initialize particles
function initParticles() {
    particlesArray = [];
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}

// Animate particles
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });
    connectParticles(); // Call function to draw connections
    requestAnimationFrame(animateParticles);
}

// Initialize and animate particles
initParticles();
animateParticles();
