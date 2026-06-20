/* ===== form.js ===== */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rsvpForm');
    const submitBtn = document.getElementById('rsvpSubmit');
    const notification = document.getElementById('rsvpNotification');
    const comingAloneCheckbox = document.getElementById('comingAlone');
    const partnerField = document.getElementById('partnerField');
    const partnerInput = document.getElementById('partnerName');

    // Показать/скрыть поле спутника
    comingAloneCheckbox.addEventListener('change', function() {
        if (this.checked) {
            partnerField.style.display = 'block';
            partnerInput.setAttribute('required', '');
            partnerField.style.animation = 'fadeSlideIn 0.4s ease forwards';
        } else {
            partnerField.style.display = 'none';
            partnerInput.removeAttribute('required');
        }
    });

    // Отправка формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Имитация запечатывания конверта
        submitBtn.classList.add('rsvp__submit--sealing');

        setTimeout(() => {
            notification.classList.add('rsvp__notification--visible');
            submitBtn.classList.remove('rsvp__submit--sealing');
            submitBtn.classList.add('rsvp__submit--sealed');
        }, 800);

        setTimeout(() => {
            notification.classList.remove('rsvp__notification--visible');
            submitBtn.classList.remove('rsvp__submit--sealed');
        }, 4500);

        // Очистка формы (опционально)
        setTimeout(() => {
            form.reset();
            partnerField.style.display = 'none';
            partnerInput.removeAttribute('required');
        }, 2000);
    });
});