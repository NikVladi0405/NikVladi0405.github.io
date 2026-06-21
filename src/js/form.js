document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rsvpForm');
    if (!form) return;
    const submitBtn = document.getElementById('rsvpSubmit');
    const notification = document.getElementById('rsvpNotification');
    const comingAloneCheckbox = document.getElementById('comingAlone');
    const guestsContainer = document.getElementById('guestsContainer');
    const guestsList = document.getElementById('guestsList');
    const addGuestBtn = document.getElementById('addGuestBtn');

    let guestCount = 0;

    // Функция создания блока для одного гостя
    function createGuestBlock(index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'rsvp__guest-item';
        wrapper.style.marginBottom = '1.5rem';
        wrapper.style.paddingBottom = '1.5rem';
        wrapper.style.borderBottom = '1px solid #e5d5d9';
        wrapper.style.position = 'relative';

        wrapper.innerHTML = `
            <label class="rsvp__label">Имя гостя</label>
            <input type="text" name="guestName_${index}" class="rsvp__input" placeholder="Введите имя гостя" required />
            <div class="rsvp__drink-guest" style="margin-top:1rem;">
                <span class="rsvp__label">Будет ли пить гость?</span>
                <div class="rsvp__food-options">
                    <label class="rsvp__food-card">
                        <input type="radio" name="guestDrink_${index}" value="yes" required />
                        <span class="rsvp__food-circle"><span class="rsvp__food-emoji">🍷</span><span class="rsvp__food-name">Будет пить</span></span>
                    </label>
                    <label class="rsvp__food-card">
                        <input type="radio" name="guestDrink_${index}" value="no" required />
                        <span class="rsvp__food-circle"><span class="rsvp__food-emoji">🚫</span><span class="rsvp__food-name">Не будет пить</span></span>
                    </label>
                </div>
            </div>
            <button type="button" class="rsvp__remove-guest" style="position:absolute;top:0;right:0;background:none;border:none;color:#c9708a;cursor:pointer;font-size:1.2rem;">&times;</button>
        `;

        // Кнопка удаления
        wrapper.querySelector('.rsvp__remove-guest').addEventListener('click', () => {
            wrapper.remove();
            guestCount--;
            // Если не осталось гостей, скрываем контейнер и снимаем галочку
            if (guestCount === 0) {
                guestsContainer.style.display = 'none';
                comingAloneCheckbox.checked = false;
            }
        });

        return wrapper;
    }

    // Добавление первого гостя при активации чекбокса
    comingAloneCheckbox.addEventListener('change', function() {
        if (this.checked) {
            guestsContainer.style.display = 'block';
            // Если ещё нет гостей, добавляем одного автоматически
            if (guestCount === 0) {
                const block = createGuestBlock(guestCount + 1);
                guestsList.appendChild(block);
                guestCount++;
            }
        } else {
            // Удаляем всех гостей и скрываем контейнер
            guestsList.innerHTML = '';
            guestCount = 0;
            guestsContainer.style.display = 'none';
        }
    });

    // Кнопка "Добавить гостя"
    addGuestBtn.addEventListener('click', () => {
        const block = createGuestBlock(guestCount + 1);
        guestsList.appendChild(block);
        guestCount++;
        // Показываем контейнер на всякий случай
        guestsContainer.style.display = 'block';
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
            // Сброс формы
            form.reset();
            guestsList.innerHTML = '';
            guestCount = 0;
            guestsContainer.style.display = 'none';
        }, 4500);
    });
});