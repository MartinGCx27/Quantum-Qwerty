// Función que filtra y cuenta dígitos en campo teléfono en vivo -LGS
    function filterNumbers(input) {
        // Limpiar todo menos números -ÑLGS
        input.value = input.value.replace(/\D/g, '');

        const messageDiv = document.getElementById('phone-count-message');
        const digitCount = input.value.length;

        if (digitCount > 0 && digitCount < 10) {
            messageDiv.textContent = `Has ingresado ${digitCount} dígitos. Deben ser 10.`;
            messageDiv.style.color = 'red';
            // Estructura else que indica que completaste los 10 numeros
        // } else if (digitCount === 10) {
        //     messageDiv.textContent = 'Número completo ✓';
        //     messageDiv.style.color = 'green';
        } else {
            messageDiv.textContent = '';
        }
    }