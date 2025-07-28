
  document.querySelectorAll('.desafio-item').forEach(item => {
    const img = item.querySelector('img');

    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      img.style.clipPath = `circle(80px at ${x}px ${y}px)`;
      img.style.filter = 'none'; // revela a color
    });

    item.addEventListener('mouseleave', () => {
      img.style.clipPath = `circle(0% at 0 0)`;
      img.style.filter = 'grayscale(100%)';
    });
  });

 document.querySelectorAll('.button-challenges').forEach(button => {
    button.addEventListener('touchstart', () => {
      button.classList.add('hover');

      // Quitar la clase después de un tiempo (por ejemplo, 1 segundo)
      setTimeout(() => button.classList.remove('hover'), 1000);
    });
  });

