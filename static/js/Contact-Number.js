function filterNumbers(input) {
    // Elimina cualquier carácter que no sea número
    input.value = input.value.replace(/\D/g, '');
    
    // Mostrar mensaje de conteo de dígitos
    const messageDiv = document.getElementById('phone-error-message');
    const digitCount = input.value.length;
    
    if (digitCount !== 10 && digitCount > 0) {
        messageDiv.textContent = `Has ingresado ${digitCount} dígitos. Deben ser 10.`;
        messageDiv.style.color = 'red';
    } else {
        messageDiv.textContent = ''; // Limpia mensaje si es correcto
    }
}
