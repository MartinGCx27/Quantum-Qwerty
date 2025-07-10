//  script para el degradado de las secciones -Memix 
function scrollToAboutIfOnFirstSection() {
    const firstSection = document.querySelector('.hyperjump-effect');
    const aboutSection = document.querySelector('#about-us');
    
    if (window.scrollY < firstSection.offsetHeight) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
    }
}

setTimeout(scrollToAboutIfOnFirstSection, 3000);
/* 3000 milliseconds = 3 seconds -Memix  */
