// static/js/intro.js

// Function to hide the intro screen by fading it out
function fadeOutIntroScreen() {
    const introScreen = document.getElementById('intro-screen');
    introScreen.style.opacity = 0; // Start fade-out effect

    // After fade-out, hide the intro screen completely
    setTimeout(function () {
        introScreen.style.display = 'none';
    }, 500); // Wait for the fade-out transition (0.5s)
}

// Function to show the main content with a fade-in effect
function showMainContent() {
    const mainContent = document.getElementById('main-content');
    mainContent.classList.add('show'); // Add 'show' class to trigger the fade-in
}

// Initialize the intro sequence, keeping it visible for 1 second
function initializeIntro() {
    // Show the intro for 1 second, then trigger fade-out
    setTimeout(function () {
        fadeOutIntroScreen(); // Fade out the intro

        // After the intro fades out, fade in the main content
        setTimeout(function () {
            showMainContent(); // Show the main content with fade-in
        }, 500); // Wait for the intro to finish fading out (0.5s)
    }, 1000); // Keep the intro visible for 1 second
}

// Trigger the intro sequence when the page finishes loading
window.onload = initializeIntro;
