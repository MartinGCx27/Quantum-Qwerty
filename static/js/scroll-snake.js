const scrollSvg = document.querySelector('.svgscroll__svg path');
const aboutUs = document.querySelector('#about-us');
const strokeLength = scrollSvg.getTotalLength();

scrollSvg.style.strokeDasharray = strokeLength;
scrollSvg.style.strokeDashoffset = strokeLength;

function svgScroll() {
  // Posición de inicio: el top de #about-us
  const aboutUsTop = aboutUs.offsetTop;
  // Posición de final: bottom de la página - puedes ajustar si quieres que termine antes
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  // Progreso: solo cuenta el scroll a partir de aboutUs
  const scrollTop = window.scrollY;

  // Calcula el rango de scroll desde aboutUsTop hasta docHeight
  let percent = (scrollTop - aboutUsTop) / (docHeight - aboutUsTop);
  percent = Math.max(0, Math.min(percent, 1)); // Limita entre 0 y 1

  // Actualiza el trazo
  scrollSvg.style.strokeDashoffset = strokeLength - (strokeLength * percent);
}

window.addEventListener('scroll', svgScroll);
window.addEventListener('load', svgScroll);