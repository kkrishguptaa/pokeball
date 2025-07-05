/**
 * POKEBALL CANVAS
 */
const pokeball = document.getElementById("pokeball");
/**
 * @type {CanvasRenderingContext2D}
 */
const ctxPokeball = pokeball.getContext("2d");

let animationTime = 0;
let isAnimating = false;
let isOpen = false; // This variable is not used in the final code, but kept for reference

function drawPokeball(offsetY = 0) {
  const centerX = pokeball.width / 2;
  const centerY = pokeball.height / 2;

  const radius = Math.min(centerX, centerY) * 0.8;

  // Clear the canvas
  ctxPokeball.clearRect(0, 0, pokeball.width, pokeball.height);

  // Red top half
  ctxPokeball.beginPath();
  ctxPokeball.arc(centerX, centerY - offsetY, radius * 0.6, Math.PI, 0, false);
  ctxPokeball.lineTo(centerX - radius, centerY - offsetY);
  ctxPokeball.closePath();
  ctxPokeball.fillStyle = "#ff0000";
  ctxPokeball.fill();

  // White bottom half
  ctxPokeball.beginPath();
  ctxPokeball.arc(centerX, centerY + offsetY, radius * 0.6, 0, Math.PI, false);
  ctxPokeball.lineTo(centerX - radius, centerY + offsetY);
  ctxPokeball.closePath();
  ctxPokeball.fillStyle = "#ffffff";
  ctxPokeball.fill();

  // Top border
  ctxPokeball.beginPath();
  ctxPokeball.arc(centerX, centerY - offsetY, radius * 0.6, Math.PI, 0, false);
  ctxPokeball.strokeStyle = "#000000";
  ctxPokeball.lineWidth = 8;
  ctxPokeball.stroke();

  // Bottom border
  ctxPokeball.beginPath();
  ctxPokeball.arc(centerX, centerY + offsetY, radius * 0.6, 0, Math.PI, false);
  ctxPokeball.strokeStyle = "#000000";
  ctxPokeball.lineWidth = 8;
  ctxPokeball.stroke();

  // Draw center button line
  if (offsetY === 0) {
    // Only draw when closed
    ctxPokeball.beginPath();
    ctxPokeball.moveTo(centerX - radius * 0.6, centerY);
    ctxPokeball.lineTo(centerX + radius * 0.6, centerY);
    ctxPokeball.strokeStyle = "#000000";
    ctxPokeball.lineWidth = 8;
    ctxPokeball.stroke();
  }

  // Draw top half of center button
  ctxPokeball.beginPath();
  ctxPokeball.arc(centerX, centerY - offsetY, radius * 0.15, Math.PI, 0, false);
  ctxPokeball.lineTo(centerX - radius * 0.2, centerY - offsetY);
  ctxPokeball.closePath();
  ctxPokeball.fillStyle = "#000000";
  ctxPokeball.fill();

  ctxPokeball.beginPath();
  ctxPokeball.arc(centerX, centerY - offsetY, radius * 0.1, Math.PI, 0, false);
  ctxPokeball.lineTo(centerX - radius * 0.1, centerY - offsetY);
  ctxPokeball.closePath();
  ctxPokeball.fillStyle = "#ffffff";
  ctxPokeball.fill();

  // Draw bottom half of center button
  ctxPokeball.beginPath();
  ctxPokeball.arc(centerX, centerY + offsetY, radius * 0.15, 0, Math.PI, false);
  ctxPokeball.lineTo(centerX - radius * 0.2, centerY + offsetY);
  ctxPokeball.closePath();
  ctxPokeball.fillStyle = "#000000";
  ctxPokeball.fill();

  ctxPokeball.beginPath();
  ctxPokeball.arc(centerX, centerY + offsetY, radius * 0.1, 0, Math.PI, false);
  ctxPokeball.lineTo(centerX - radius * 0.1, centerY + offsetY);
  ctxPokeball.closePath();
  ctxPokeball.fillStyle = "#ffffff";
  ctxPokeball.fill();
}

/**
 * POKEMON CANVAS
 */

const pokemonCanvas = document.getElementById("pokemon");
/**
 * @type {CanvasRenderingContext2D}
 */
const ctxPokemon = pokemonCanvas.getContext("2d");

/**
 * pokemon is a image in the same directory as this file, pokemon.png
 */

const pokemonImage = new Image();
pokemonImage.src = "./pokemon.png";

function drawPokemon(animationProgress = 0) {
  const centerX = pokemonCanvas.width / 2;
  const centerY = pokemonCanvas.height / 2;

  // Clear the canvas
  ctxPokemon.clearRect(0, 0, pokemonCanvas.width, pokemonCanvas.height);

  // Only draw if animation has started and image is loaded
  if (
    animationProgress > 0 &&
    pokemonImage.complete &&
    pokemonImage.naturalWidth > 0
  ) {
    // Calculate scale: starts at 0, ends at 1
    const scale = animationProgress;

    // Calculate position: starts at left side, ends at center
    const startX = 0;
    const endX = centerX;
    const currentX = startX + (endX - startX) * animationProgress;

    // Calculate dimensions while maintaining aspect ratio
    const imageAspectRatio =
      pokemonImage.naturalWidth / pokemonImage.naturalHeight;
    const canvasAspectRatio = pokemonCanvas.width / pokemonCanvas.height;

    let width, height;

    if (imageAspectRatio > canvasAspectRatio) {
      // Image is wider than canvas - fit to width
      width = pokemonCanvas.width * scale;
      height = width / imageAspectRatio;
    } else {
      // Image is taller than canvas - fit to height
      height = pokemonCanvas.height * scale;
      width = height * imageAspectRatio;
    }

    // Draw the Pokemon image with animation
    ctxPokemon.drawImage(
      pokemonImage,
      currentX - width / 2,
      centerY - height / 2,
      width,
      height
    );
  }
}

/**
 * Animation
 */

function animate() {
  animationTime += 0.05; // Animation speed

  const maxOffset = 40;
  const progress = Math.min(animationTime / 2, 1); // 0 to 1 over 2 seconds
  const offset = progress * maxOffset;

  drawPokeball(offset);

  // Animate Pokemon appearance after pokeball starts opening
  const pokemonProgress = Math.max(0, Math.min((animationTime - 0.5) / 1.5, 1)); // Start after 0.5s, complete in 1.5s
  drawPokemon(pokemonProgress);

  // Stop animation when fully open
  if (progress >= 1) {
    isAnimating = false;
    return;
  }

  requestAnimationFrame(animate);
}

function openPokeball() {
  if (isAnimating) {
    return;
  }

  isAnimating = true;
  isOpen = true; // Set the open state

  const sound = document.getElementById("pokeballSound");
  if (sound) {
    sound.currentTime = 0; // Reset sound to start
    sound.volume = 0.25; // Set volume to 25%
    sound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }

  animationTime = 0;
  animate();
}

pokeball.addEventListener("click", () => {
  if (!isOpen) {
    openPokeball();
  }
});
pokeball.style.cursor = "pointer";

// Initial draw
drawPokeball();
drawPokemon(0);
