const scrollSvg = document.querySelector('.svgscroll__svg path');
const footer = document.querySelector('.footer');
const strokeLength = scrollSvg.getTotalLength();

scrollSvg.style.strokeDasharray = strokeLength;
scrollSvg.style.strokeDashoffset = strokeLength;

function svgScroll() {
  const scrollY = window.scrollY;
  const footerStart = footer.offsetTop;
  const maxScroll = footerStart - window.innerHeight; // 👈 scroll máximo sin incluir footer

  const percent = Math.max(0, Math.min(scrollY / maxScroll, 1));

  scrollSvg.style.strokeDashoffset = strokeLength - (strokeLength * percent);
}

window.addEventListener('scroll', svgScroll);
window.addEventListener('load', svgScroll);
