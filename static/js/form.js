document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('sendBtn');
    const form = document.querySelector('form');
    const alertContainer = document.getElementById('alert-container');

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        clearErrors();

        let hasErrors = false;

        // Nombres reales del formulario Django
        const fields = [
            { name: 'name_contact', message: 'Por favor ingresa tu nombre.' },
            { name: 'lastname_contact', message: 'Por favor ingresa tu apellido.' },
            { name: 'email_contact', message: 'Por favor ingresa tu correo electrónico.' },
            { name: 'phone_contact', message: 'Por favor ingresa tu teléfono.' },
            { name: 'comments_contact', message: 'Por favor escribe tu mensaje.' }
        ];

        fields.forEach(field => {
            const input = form.querySelector(`[name="${field.name}"]`);
            const errorDiv = document.getElementById(`${field.name}-error-message`);
            const value = input ? input.value.trim() : '';

            if (!value) {
                if (errorDiv) errorDiv.textContent = field.message;
                hasErrors = true;
            }

            if (field.name === 'email_contact' && value !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    if (errorDiv) errorDiv.textContent = 'Por favor introduce un correo electrónico válido.';
                    hasErrors = true;
                }
            }
        });

        if (hasErrors) {
            showAlert("Corrige los campos marcados antes de continuar ❌", 'danger');
            return;
        }

        const recaptchaValue = grecaptcha.getResponse();
        if (!recaptchaValue) {
            showAlert("Por favor confirma que no eres un robot ❌", 'danger');
            return;
        }

        btn.classList.add('loading');
        const formData = new FormData(form);

        setTimeout(() => {
            fetch("", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                clearErrors();

                if (data.success) {
                    showAlert("Formulario enviado correctamente ✅", 'success');
                    form.reset();
                    grecaptcha.reset();

                    const phoneMessage = document.getElementById('phone-count-message');
                    if (phoneMessage) phoneMessage.textContent = '';
                } else {
                    if (data.errors) {
                        for (const [field, messages] of Object.entries(data.errors)) {
                            const errorDiv = document.getElementById(`${field}-error-message`);
                            if (errorDiv) {
                                errorDiv.innerHTML = messages.map(m => m.message).join('<br>');
                            }
                        }
                        showAlert("Por favor corrige los campos marcados ❌", 'danger');
                    } else if (data.message) {
                        showAlert(data.message, 'danger');
                    } else {
                        showAlert("Ocurrió un error al enviar el formulario ❌", 'danger');
                    }
                }
            })
            .catch(() => {
                showAlert("Ocurrió un error al enviar el formulario ❌", 'danger');
            })
            .finally(() => {
                btn.classList.remove('loading');
            });
        }, 2800);
    });

    function showAlert(message, type) {
        if (!alertContainer) return;

        const existingAlert = alertContainer.querySelector('.alert');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        alertContainer.appendChild(alert);

        alert.style.opacity = '0';
        requestAnimationFrame(() => {
            alert.style.opacity = '1';
        });

        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }
});
