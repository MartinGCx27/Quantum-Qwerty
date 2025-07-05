export class animationsScroll {

  // Método estático que se puede llamar sin instanciar la clase
  static activate(sectionSelector, options = {}) {

    // 1. Seleccionamos la sección a la que se le aplicarán las animaciones
    const section = document.querySelector(sectionSelector);
    if (!section) return; // Si no se encuentra la sección, salimos de la función

    // 2. Obtenemos las animaciones que se van a aplicar (vienen en el objeto 'options')
    // Este objeto debe tener la forma: 'elemento' : 'animacion' ejemplo: { '.clase': 'fadeInLeft', 'h1': 'fadeInDown'}
    const animations = options.animations || {};

    // 3. Definimos qué tan visible debe estar la sección para activar las animaciones
    const threshold = options.threshold ?? 0.1;

    // 4. Creamos un objeto para guardar los elementos seleccionados dentro de la sección
    const elements = {};

    // 5. Recorremos cada selector dentro de 'animations' y buscamos el elemento correspondiente en la sección
    Object.keys(animations).forEach(key => {
      elements[key] = section.querySelector(key);
    });

    // 6. Función que quita las animaciones
    function resetAnimations() {
      Object.entries(animations).forEach(([key, animation]) => {
        const element = elements[key];
        if (element) {
          // Quitamos las clases de animación
          element.classList.remove('animate__animated', `animate__${animation}`);
          void element.offsetWidth; // Forzamos un refresh para que se pueda reiniciar la animación
        }
      });
    }

    // 7. Función que aplica las animaciones
    function playAnimations() {
      Object.entries(animations).forEach(([key, animation]) => {
        const element = elements[key];
        if (element) {
          // Añadimos las clases de animación de Animate.css
          element.classList.add('animate__animated', `animate__${animation}`);
        }
      });
    }

    // 8. Creamos un observador que detecta cuándo la sección entra o sale del viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Si la sección está visible en el viewport, aplicamos las animaciones
          playAnimations();
        } else {
          // Si deja de estar visible, las quitamos
          resetAnimations();
        }
      });
    }, { threshold }); // Usamos el nivel de visibilidad configurado

    // 9. Indicamos al observador que observe la sección que seleccionamos
    observer.observe(section);
  }
}