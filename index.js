console.log("wheel of fortune");
// --- JavaScript ---
// Sélection des éléments du DOM
const canvas = document.getElementById("wheelCanvas");

const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultDiv = document.getElementById("result");
// Segments par défaut (peuvent être modifiés par l'utilisateur)
let segments = ["Pizza", "Cinema", "Netflix", "Sports"];
// Tableau de couleurs avec leurs configurations
const colorSchemes = [
  {
    bg: "#0093D0",
    text: "#FFFFFF",
  }, // Primary blue
  {
    bg: "#E84F0E",
    text: "#fff",
  }, // White
];
// Dimensions du canvas
const width = canvas.width;
const height = canvas.height;
// Variables pour l'animation
let currentAngle = 0; // angle de départ
let spinVelocity = 0; // vitesse de rotation
let isSpinning = false; // indicateur d'animation en cours

console.log(
  canvas,
  ctx,
  spinButton,
  resultDiv,
  segments,
  colorSchemes,
  width,
  height,
  currentAngle,
  spinVelocity,
  isSpinning
);
// Fonction pour dessiner la roue
function drawWheel(segmentsArray) {
  console.log("drawWheel");
  // Nettoyage du canvas
  ctx.clearRect(0, 0, width, height);
  // Nombre de segments et angles
  const numSegments = segmentsArray.length;
  const anglePerSegment = (2 * Math.PI) / numSegments;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  // Boucle sur chaque segment
  for (let i = 0; i < numSegments; i++) {
    const startAngle = currentAngle + i * anglePerSegment - Math.PI / 2;
    const endAngle = startAngle + anglePerSegment;
    // Utiliser le schéma de couleur
    const colorScheme = colorSchemes[i % colorSchemes.length];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fillStyle = colorScheme.bg;
    ctx.fill();
    ctx.closePath();
    // Dessin du texte avec la couleur correspondante
    ctx.save();
    ctx.fillStyle = colorScheme.text;
    ctx.font = "bold 18px arial";
    ctx.translate(
      centerX + Math.cos(startAngle + anglePerSegment / 2) * (radius * 0.65),
      centerY + Math.sin(startAngle + anglePerSegment / 2) * (radius * 0.65)
    );
    ctx.rotate(startAngle + anglePerSegment / 2 + Math.PI / 2);
    const text = segmentsArray[i];
    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
    ctx.restore();
  }
  // Dessin du pointeur (triangle) à droite
  ctx.beginPath();
  ctx.moveTo(centerX + radius - 10, centerY);
  ctx.lineTo(centerX + radius + 15, centerY - 15);
  ctx.lineTo(centerX + radius + 15, centerY + 15);
  ctx.fillStyle = "#fff";
  ctx.fill();
}
// Animation de la roue
function spinWheel() {
  if (!isSpinning) return;
  // Mise à jour de l'angle et réduction de la vitesse
  currentAngle += spinVelocity;
  spinVelocity *= 0.98; // friction
  // Condition d'arrêt
  if (spinVelocity < 0.01) {
    spinVelocity = 0;
    isSpinning = false;
    findWinner();
  }
  // Redessiner la roue à chaque frame
  drawWheel(segments);
  requestAnimationFrame(spinWheel);
}
// Déterminer le segment gagnant en fonction de l'angle final
function findWinner() {
  const numSegments = segments.length;
  const anglePerSegment = (2 * Math.PI) / numSegments;
  let normalizedAngle = currentAngle % (2 * Math.PI);
  if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
  normalizedAngle =
    (normalizedAngle - Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
  const winningIndex =
    (numSegments - Math.floor(normalizedAngle / anglePerSegment) - 1) %
    numSegments;
  const winner = segments[winningIndex];
  const resultDiv = document.getElementById("result");
  resultDiv.classList.remove("show");
  // Utiliser le schéma de couleur du segment gagnant
  const colorScheme = colorSchemes[winningIndex % colorSchemes.length];
  setTimeout(() => {
    resultDiv.innerHTML = `
          <div>The result is:</div>
          <div class="result-content">
            <span>${winner}</span>
          </div>
        `;
    resultDiv.classList.add("show");
  }, 300);

  submitForm(winner);
}
// Bouton "Tourner la roue"
spinButton.addEventListener("click", () => {
  if (!isSpinning) {
    // Réinitialiser l'affichage du résultat
    const resultDiv = document.getElementById("result");
    resultDiv.classList.remove("show");
    // Donner une vitesse initiale aléatoire
    spinVelocity = Math.random() * 0.3 + 0.25;
    isSpinning = true;
    spinWheel();
  }
});
// Dessin initial de la roue

drawWheel(segments);

function submitForm(winner) {
  console.log("submitform called");

  const prize = document.querySelector('input[name="sm-form-street"]');

  prize.value = `Laimėjimas ${winner}`;

  console.log("prizevalue", prize.value);

  document.getElementById("submit").click();
}
