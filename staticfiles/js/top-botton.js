// Script para mostrar un botón que permite volver al inicio al hacer scroll -Fer

// Obtener el botón
let scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Cuando el usuario se desplaza 20px desde la parte superior de la página, mostrar el botón
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "flex";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

// Cuando el usuario hace clic en el botón, desplazar a la parte superior de la página
scrollToTopBtn.addEventListener("click", backToTop);

function backToTop() {
    document.body.scrollTop = 0; // Para navegadores Safari
    document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE y Opera
}
