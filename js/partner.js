(function () {
    const track = document.querySelector('.carousel__track');
    const slides = Array.from(track.children);
    const dots = Array.from(document.querySelectorAll('.carousel__dot'));
    const btnLeft = document.querySelector('.carousel__btn--left');
    const btnRight = document.querySelector('.carousel__btn--right');
    let current = 0;
    let autoTimer;

    function goTo(index) {
        slides[current].classList.remove('is-selected');
        dots[current].classList.remove('is-active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('is-selected');
        dots[current].classList.add('is-active');
        track.style.transform = `translateX(-${current * 100}%)`;
    }

    btnLeft.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    btnRight.addEventListener('click', () => { goTo(current + 1); resetTimer(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));

    function resetTimer() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    resetTimer();
})();

// ─────────────────────────────────────────────────────────────
// IFRAME INVISIBLE — se crea al cargar la página
// El submit de Zoho ocurre aquí adentro, tu página no se mueve
// ─────────────────────────────────────────────────────────────
(function () {
    const iframe = document.createElement('iframe');
    iframe.name  = 'zf_submit_target';
    iframe.id    = 'zf_submit_target';
    iframe.style.cssText = 'display:none;width:0;height:0;border:none;';
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);
})();


// ─────────────────────────────────────────────────────────────
// RESTRICCIONES EN TIEMPO REAL - Frontend Validation
// ─────────────────────────────────────────────────────────────
(function () {
    // Inicializar filtros en tiempo real cuando el DOM cargue
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeInputFilters);
    } else {
        initializeInputFilters();
    }

    function initializeInputFilters() {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const phoneInput = document.getElementById('phone');

        // Permitir solo letras en Nombre y Apellido
        if (firstNameInput) {
            firstNameInput.addEventListener('input', filterLettersOnly);
            firstNameInput.addEventListener('keypress', preventNonLetters);
        }
        if (lastNameInput) {
            lastNameInput.addEventListener('input', filterLettersOnly);
            lastNameInput.addEventListener('keypress', preventNonLetters);
        }

        // Permitir solo números en Teléfono
        if (phoneInput) {
            phoneInput.addEventListener('input', filterNumbersOnly);
            phoneInput.addEventListener('keypress', preventNonNumbers);
        }
    }

    function filterLettersOnly(e) {
        // Mantener solo letras, espacios y guiones
        let value = e.target.value;
        let filtered = value.replace(/[^a-zA-Z\s\-]/g, '');
        if (value !== filtered) {
            e.target.value = filtered;
        }
    }

    function preventNonLetters(e) {
        const char = String.fromCharCode(e.which);
        if (!/[a-zA-Z\s\-]/.test(char)) {
            e.preventDefault();
        }
    }

    function filterNumbersOnly(e) {
        // Mantener solo números y algunos caracteres de teléfono
        let value = e.target.value;
        let filtered = value.replace(/[^0-9\s\-\(\)\+]/g, '');
        if (value !== filtered) {
            e.target.value = filtered;
        }
    }

    function preventNonNumbers(e) {
        const char = String.fromCharCode(e.which);
        if (!/[0-9\s\-\(\)\+]/.test(char)) {
            e.preventDefault();
        }
    }
})();


// ─────────────────────────────────────────────────────────────
// VALIDACIÓN
// ─────────────────────────────────────────────────────────────
function validateContactForm(event) {
    event.preventDefault();
    clearAllErrors();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const email     = document.getElementById('email').value.trim();
    const phone     = document.getElementById('phone').value.trim();
    const message   = document.getElementById('message').value.trim();

    let isValid = true;

    // Validar Nombre
    if (firstName === '') {
        showError('firstNameError', 'First name is required');
        isValid = false;
    } else if (firstName.length < 2) {
        showError('firstNameError', 'First name must be at least 2 characters');
        isValid = false;
    } else if (!/^[a-zA-Z\s\-]+$/.test(firstName)) {
        showError('firstNameError', 'First name can only contain letters, spaces and hyphens');
        isValid = false;
    }

    // Validar Apellido
    if (lastName === '') {
        showError('lastNameError', 'Last name is required');
        isValid = false;
    } else if (lastName.length < 2) {
        showError('lastNameError', 'Last name must be at least 2 characters');
        isValid = false;
    } else if (!/^[a-zA-Z\s\-]+$/.test(lastName)) {
        showError('lastNameError', 'Last name can only contain letters, spaces and hyphens');
        isValid = false;
    }

    // Validar Email
    if (email === '') {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    if (phone !== '') {
        if (!/^[0-9\s\-\(\)\+]*$/.test(phone)) {
            showError('phoneError', 'Phone number can only contain numbers, spaces, hyphens, parentheses and plus sign');
            isValid = false;
        }
    }

    if (message === '') {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    } else if (message.length > 1000) {
        showError('messageError', 'Message cannot exceed 1000 characters');
        isValid = false;
    }

    if (isValid) {
        submitForm(firstName, lastName, email, phone, message);
    }

    return false;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    const inputEl = document.getElementById(elementId.replace('Error', ''));
    if (errorEl) { errorEl.textContent = message; errorEl.style.display = 'block'; }
    if (inputEl) { inputEl.classList.add('input-error'); }
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    document.querySelectorAll('.connect-form__field input, .connect-form__field textarea').forEach(el => {
        el.classList.remove('input-error');
    });
}


// ─────────────────────────────────────────────────────────────
// ENVÍO A ZOHO
// Form oculto → iframe invisible → Zoho Forms → Google Sheets
// Tu página NO se redirige. Tu diseño se mantiene intacto.
// ─────────────────────────────────────────────────────────────
function submitForm(firstName, lastName, email, phone, message) {

    // Obtener código de país desde el input hidden
    const phoneCountry = document.getElementById('phoneCountry').value;
    
    // Combinar código + número
    const fullPhone = phone ? `${phoneCountry}${phone}` : '';

    // URL de submit real (del index.html descargado de Zoho Forms)
    const ZOHO_ACTION = 'https://forms.zohopublic.com/rodrtailergm1/form/ARCFORM/formperma/pc7O7Ffa-tzF1gtDxGy8KYwLUaRREggpMoofw0wE0XA/htmlRecords/submit';

    // Nombres de campo EXACTOS que Zoho espera
    const fields = {
        'Name_First'             : firstName,
        'Name_Last'              : lastName,
        'Email'                  : email,
        'PhoneNumber_countrycode': fullPhone,
        'MultiLine'              : message,
        'zf_referrer_name'       : window.location.href,
        'zf_redirect_url'        : '',
        'zc_gad'                 : ''
    };

    // Construir form oculto apuntando al iframe invisible
    const hiddenForm = document.createElement('form');
    hiddenForm.method  = 'POST';
    hiddenForm.action  = ZOHO_ACTION;
    hiddenForm.enctype = 'multipart/form-data';
    hiddenForm.target  = 'zf_submit_target'; // → va al iframe, no mueve la página

    Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type  = 'hidden';
        input.name  = name;
        input.value = value || '';
        hiddenForm.appendChild(input);
    });

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();
    document.body.removeChild(hiddenForm);

    // Mostrar confirmación visual
    showSuccessMessage();
    document.getElementById('connectForm').reset();
    clearAllErrors();
}


// ─────────────────────────────────────────────────────────────
// MODAL DE EXITO — Modal profesional
// ─────────────────────────────────────────────────────────────
function showSuccessMessage() {
    // Crear overlay del modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'zf_success_modal';

    // Crear contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <div class="modal-icon">✓</div>
        <h2 class="modal-title" data-i18n="pages_partner.modal_title">Thank You!</h2>
        <p class="modal-message" data-i18n="pages_partner.modal_message">Your message has been sent successfully. We will get back to you as soon as possible.</p>
        <button class="modal-button" onclick="closeSuccessModal()" data-i18n="pages_partner.modal_button">Close</button>
    `;

    overlay.appendChild(modalContent);
    document.body.appendChild(overlay);

    // Auto-cerrar después de 6 segundos
    setTimeout(() => {
        closeSuccessModal();
    }, 6000);
}

function closeSuccessModal() {
    const modal = document.getElementById('zf_success_modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function toggleDropdown() {
    document.getElementById('countryList').classList.toggle('open');
}

function selectCountry(code, iso) {
    const selected = document.querySelector('.phone-dropdown__selected');
    selected.innerHTML = `
        <span class="fi fi-${iso}"></span>
        <span id="countryDialCode">+${code}</span>
        <span class="phone-dropdown__arrow">▾</span>
    `;
    document.getElementById('phoneCountry').value = code;
    document.getElementById('countryList').classList.remove('open');
    // Re-attach onclick after innerHTML reset
    selected.onclick = toggleDropdown;
}

document.addEventListener('click', function(e) {
    const dd = document.getElementById('countryDropdown');
    if (dd && !dd.contains(e.target)) {
        document.getElementById('countryList').classList.remove('open');
    }
});