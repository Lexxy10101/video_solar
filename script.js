// Cod pentru bara de navigare pe dispozitive de dimensiuni mici
document.addEventListener('DOMContentLoaded', function(){
    var navbarCollapse = document.getElementById('navbarNavAltMarkup');
    var body = document.body;
    if(navbarCollapse){
        navbarCollapse.addEventListener('shown.bs.collapse', function(){
            body.classList.add('navbar-open');
        });
        navbarCollapse.addEventListener('hidden.bs.collapse',function(){
            body.classList.remove('navbar-open');
        });
    }
});

// Cod pentru iconite
import { Ripple, initMDB } from "mdb-ui-kit";
initMDB({ Ripple });


// Cod pentru pagina de contact
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const alertMessage = document.getElementById('alertMessage');
    const termsCheckbox = document.getElementById('terms'); // Referință la checkbox

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Oprește trimiterea formularului inițial

        let formIsValid = true; // Flag pentru validarea generală a formularului

        // Verifică validarea HTML5 (câmpuri obligatorii etc.)
        if (!form.checkValidity()) {
            formIsValid = false;
        }

        // NOU: Validare pentru checkbox-ul de Termeni și Condiții
        if (!termsCheckbox.checked) {
            termsCheckbox.classList.add('is-invalid');
            formIsValid = false;
        } else {
            termsCheckbox.classList.remove('is-invalid');
        }

        // Validare personalizată pentru numărul de telefon (opțional)
        const phoneInput = document.getElementById('phone');
        const phonePattern = /^07[0-9]{8}$/; // Ex: 07xyyyyyyy (10 cifre, începe cu 07)
        if (phoneInput.value && !phonePattern.test(phoneInput.value)) {
            phoneInput.classList.add('is-invalid');
            phoneInput.nextElementSibling.textContent = 'Te rog introdu un număr de telefon valid (ex: 07xxxxxxxx).';
            formIsValid = false;
        } else {
            phoneInput.classList.remove('is-invalid');
        }

        if (!formIsValid) {
            form.classList.add('was-validated'); // Adaugă clasele de validare Bootstrap pentru a afișa erorile
            displayAlert('Te rog completează toate câmpurile obligatorii și acceptă Termenii și Condițiile.', 'danger');
            return; // Oprește execuția dacă formularul nu este valid
        }

        // Dacă toate validările au trecut, se procesează formularul
        form.classList.remove('was-validated'); // Elimină clasele de validare înainte de trimiterea AJAX

        const formData = new FormData(form);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        fetch('php/process_form.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayAlert(data.message, 'success');
                form.reset(); // Golește formularul
                form.classList.remove('was-validated'); // Elimină clasele de validare
                // Asigură-te că și checkbox-ul este resetat vizual
                termsCheckbox.checked = false;
                termsCheckbox.classList.remove('is-invalid');
            } else {
                displayAlert(data.message, 'danger');
                if (data.errors) {
                    for (const field in data.errors) {
                        const inputElement = document.getElementById(field);
                        if (inputElement) {
                            inputElement.classList.add('is-invalid');
                            inputElement.nextElementSibling.textContent = data.errors[field];
                        }
                    }
                    form.classList.add('was-validated');
                }
            }
        })
        .catch(error => {
            console.error('Eroare:', error);
            displayAlert('A apărut o eroare la trimiterea mesajului. Te rog încearcă din nou.', 'danger');
        });
    });

    // Funcție pentru afișarea mesajelor de alertă
    function displayAlert(message, type) {
        alertMessage.textContent = message;
        alertMessage.className = `alert alert-${type} mt-3`;
        alertMessage.classList.remove('d-none');
        // Se ascunde mesajul după 5 secunde
        setTimeout(() => {
            alertMessage.classList.add('d-none');
        }, 5000);
    }

    // Elimină clasele de validare la modificarea inputului, inclusiv pentru checkbox
    form.querySelectorAll('.form-control, .form-check-input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                input.classList.remove('is-invalid');
            }
        });
    });
});