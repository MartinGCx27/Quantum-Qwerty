document.addEventListener('DOMContentLoaded', function () {
    // Se ejecuta cuando todo el DOM está cargado y listo

    const btn = document.getElementById('sendBtn'); // Botón para enviar el formulario
    const form = document.querySelector('form');    // El formulario en sí
    const alertContainer = document.getElementById('alert-container'); // Contenedor para mostrar alertas

    // === Evento de click para enviar formulario ===
    btn.addEventListener('click', function (e) {
        e.preventDefault(); // Evita que el formulario se envíe tradicionalmente (recarga) -LGS

        // Validar recaptcha en frontend
        const recaptchaValue = grecaptcha.getResponse(); // Obtiene la respuesta del recaptcha -LGS
        if (!recaptchaValue) { // Si el usuario no validó el recaptcha
            showAlert("Por favor confirma que no eres un robot ❌", 'danger'); // Mostrar alerta de error -LGS
            return; // Sale sin enviar nada -LGS
        }

        btn.classList.add('loading'); // Añade clase para animar el botón mientras se procesa -LGS

        // Simula una espera de 2.8 segundos antes de enviar (puede ser para animación o esperar algo) -LGS
        setTimeout(() => {
            const formData = new FormData(form); // Recopila los datos del formulario -LGS

            // Enviar formulario con fetch al mismo URL (""), método POST y encabezados para CSRF y AJAX -LGS
            fetch("", {
                method: "POST",
		credentials: "include",
                headers: {
                    "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: formData
            })
            .then(res => res.json()) // Se espera respuesta JSON del servidor -LGS
            .then(data => {
                clearErrors(); // Limpia errores previos en el formulario -LGS

                if (data.success) { // Si el backend dice que fue exitoso
                    showAlert("Formulario enviado correctamente ✅", 'success'); // Muestra alerta éxito
                    form.reset(); // Limpia el formulario -LGS
                    grecaptcha.reset(); // Resetea el recaptcha -LGS

                    // Limpia contador o mensaje de teléfono si existe -LGS
                    const phoneMessage = document.getElementById('phone-count-message');
                    if (phoneMessage) phoneMessage.textContent = '';
                } else {
                    // Si hay errores específicos de campos -LGS
                    if (data.errors) {
                        // Itera cada campo con error -LGS
                        for (const [field, messages] of Object.entries(data.errors)) {
                            const errorDiv = document.getElementById(field + '-error-message'); // Div para mostrar error -LGS
                            if (errorDiv) {
                                // Muestra los mensajes de error concatenados con saltos de línea -LGS
                                errorDiv.innerHTML = messages.map(m => m.message).join('<br>');
                            }
                        }
                        showAlert("Por favor corrige los campos marcados ❌", 'danger'); // Alerta general de error -LGS
                    } else if (data.message) {
                        // Si hay un mensaje general de error -LGS
                        showAlert(data.message, 'danger');
                    } else {
                        // Error no esperado -LGS
                        showAlert("Ocurrió un error al enviar el formulario ❌", 'danger');
                    }
                }
            })
            .catch(() => {
                // Si la petición falla (error de red, servidor, etc) -LGS
                showAlert("Ocurrió un error al enviar el formulario ❌", 'danger');
            })
            .finally(() => {
                btn.classList.remove('loading'); // Quita la animación de carga del botón -LGS
            });
        }, 2800);
    });

    // === Función para mostrar alertas dentro del contenedor específico ===
    function showAlert(message, type) {
        if (!alertContainer) return; // Si no existe el contenedor, no hace nada -LGS

        // Elimina la alerta previa si existe para no acumular varias -LGS
        const existingAlert = alertContainer.querySelector('.alert');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`; // Clase bootstrap o similar según tipo (danger, success) -LGS
        alert.textContent = message; // Texto del mensaje -LGS

        alertContainer.appendChild(alert); // Agrega la alerta al contenedor -LGS

        // Animación de entrada con opacidad -LGS
        alert.style.opacity = '0';
        requestAnimationFrame(() => {
            alert.style.opacity = '1';
        });

        // Después de 5 segundos se oculta y elimina la alerta -LGS
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    }

    // === Función para limpiar mensajes de error de campos individuales ===
    function clearErrors() {
        // Busca todos los elementos con clase 'error-message' y los limpia -LGS
        document.querySelectorAll('.error-message').forEach(el => el.innerHTML = '');
    }

   
});
