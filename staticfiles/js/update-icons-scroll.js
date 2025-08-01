//  Actualiza íconos y logo del navbar según el scroll -Fer 

const icons = document.getElementsByClassName('navIcons');
const logo = document.getElementsByClassName('navbar-logo')[0];

function updateNavbarIL() {
    const useColorDark = window.scrollY >= window.innerHeight - 80;
    
    for (let i = 0; i < icons.length; i++) {
        icons[i].style.filter = useColorDark
        ? 'invert(0)'  // negro
        : 'invert(1)'; // blanco
    }
    
    // Cambiar imagen del logo si existe
    if (logo) {
        logo.src = useColorDark
        ? logo.dataset.srcNormal
        : logo.dataset.srcRosa;
    }
}

window.addEventListener('load', updateNavbarIL);
window.addEventListener('scroll', updateNavbarIL);

