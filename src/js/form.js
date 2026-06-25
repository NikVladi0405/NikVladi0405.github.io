document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rsvpForm');
    if (!form) return;
    const submitBtn = document.getElementById('rsvpSubmit');
    const notification = document.getElementById('rsvpNotification');
    const comingAloneCheckbox = document.getElementById('comingAlone');
    const guestsContainer = document.getElementById('guestsContainer');
    const guestsList = document.getElementById('guestsList');
    const addGuestBtn = document.getElementById('addGuestBtn');

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1mmr6KNrpRi8kwUBQs3_vM0pcRAjf37NRMo8KKyve6JL4bnTHaSWts4Ct2gF0vaiH/exec';

    let guestCount = 0;

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

        wrapper.querySelector('.rsvp__remove-guest').addEventListener('click', () => {
            wrapper.remove();
            guestCount--;
            if (guestCount === 0) {
                guestsContainer.style.display = 'none';
                comingAloneCheckbox.checked = false;
            }
        });

        return wrapper;
    }

    comingAloneCheckbox.addEventListener('change', function() {
        if (this.checked) {
            guestsContainer.style.display = 'block';
            if (guestCount === 0) {
                const block = createGuestBlock(guestCount + 1);
                guestsList.appendChild(block);
                guestCount++;
            }
        } else {
            guestsList.innerHTML = '';
            guestCount = 0;
            guestsContainer.style.display = 'none';
        }
    });

    addGuestBtn.addEventListener('click', () => {
        const block = createGuestBlock(guestCount + 1);
        guestsList.appendChild(block);
        guestCount++;
        guestsContainer.style.display = 'block';
    });

    function collectFormData() {
        const mainName = document.getElementById('guestName').value.trim();
        const mainDrink = document.querySelector('input[name="drinkChoice"]:checked')?.value || '';
        const message = document.getElementById('message').value.trim();

        const guests = [];
        const guestItems = guestsList.querySelectorAll('.rsvp__guest-item');
        guestItems.forEach((item) => {
            const nameInput = item.querySelector('input[type="text"]');
            const drinkYes = item.querySelector('input[value="yes"]');
            const drinkNo = item.querySelector('input[value="no"]');
            const guestName = nameInput?.value.trim() || '';
            const guestDrink = drinkYes?.checked ? 'yes' : (drinkNo?.checked ? 'no' : '');
            if (guestName) {
                guests.push({ name: guestName, drink: guestDrink });
            }
        });

        return {
            guestName: mainName,
            drinkChoice: mainDrink,
            message: message,
            guests: guests
        };
    }

    async function submitToGoogleSheets(data) {
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify(data)
            });
            return true;
        } catch (error) {
            console.error('Ошибка отправки:', error);
            return false;
        }
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const mainName = document.getElementById('guestName').value.trim();
        if (!mainName) {
            alert('Пожалуйста, введите ваше имя');
            return;
        }

        const formData = collectFormData();

        submitBtn.classList.add('rsvp__submit--sealing');

        const success = await submitToGoogleSheets(formData);

        setTimeout(() => {
            if (success) {
                notification.classList.add('rsvp__notification--visible');
                notification.querySelector('.rsvp__notification-text').textContent = 'Мы будем вас ждать!';
            } else {
                notification.classList.add('rsvp__notification--visible');
                notification.querySelector('.rsvp__notification-text').textContent = 'Ошибка, попробуйте позже';
            }
            submitBtn.classList.remove('rsvp__submit--sealing');
            submitBtn.classList.add('rsvp__submit--sealed');
        }, 800);

        setTimeout(() => {
            notification.classList.remove('rsvp__notification--visible');
            submitBtn.classList.remove('rsvp__submit--sealed');
            form.reset();
            guestsList.innerHTML = '';
            guestCount = 0;
            guestsContainer.style.display = 'none';
        }, 4000);
    });
});