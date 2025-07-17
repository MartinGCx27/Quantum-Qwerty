const strokeLength = 8959;
const scrollSvg = document.querySelector('.svgscroll__svg path');
const scrollElem = document.documentElement;

const triggerStart = document.querySelector('#about-us').offsetTop - 550; // 👈 se activa un poco antes
const triggerEnd = scrollElem.scrollHeight - window.innerHeight;

function svgScroll() {
  const scrollY = window.scrollY;

  // Calculamos porcentaje RELATIVO solo si estamos cerca de la sección
  let percent = (scrollY - triggerStart) / (triggerEnd - triggerStart);
  percent = Math.max(0, Math.min(percent, 1)); // Clamp entre 0 y 1 SIEMPRE

  scrollSvg.style.strokeDashoffset = strokeLength - (strokeLength * percent);

  const red = Math.floor(255 * percent);
  const blue = 255 - red;
  scrollSvg.setAttribute('stroke', `rgb(${red},50,${blue})`);
}

window.addEventListener('scroll', svgScroll);
window.addEventListener('load', svgScroll);
