
  function getRandom(min, max, decimals = 2) {
    const rand = Math.random() * (max - min) + min;
    return parseFloat(rand.toFixed(decimals));
  }

  function createBubbles(count = 128) {
    const container = document.getElementById('bubble-container');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const size = getRandom(2, 6); // 2 + 0~4
      const distance = getRandom(6, 10); // 6 + 0~4
      const position = getRandom(-5, 110); // -5 + 0~115
      const time = getRandom(2, 4); // 2 + 0~2
      const delay = getRandom(-4, -2); // -1 * (2 + 0~2)

      const bubble = document.createElement('div');
      bubble.classList.add('bubble');

      // Puedes adaptar estas variables a tu animación CSS
      bubble.style.setProperty('--size', `${size}rem`);
      bubble.style.setProperty('--distance', `${distance}rem`);
      bubble.style.setProperty('--position', `${position}%`);
      bubble.style.setProperty('--time', `${time}s`);
      bubble.style.setProperty('--delay', `${delay}s`);

      container.appendChild(bubble);
    }
  }
// Ejecutar al cargar la página
  
  document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
  });

