//  Script que agrega una clase al navbar cuando el usuario hace scroll para cambiar su estilo -Fer 

window.addEventListener("scroll", function () {
    const navbar = document.getElementById("menu");
    if (window.scrollY > window.innerHeight - 80) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});
