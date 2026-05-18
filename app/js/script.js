const menuButtons = document.querySelectorAll('.js-menu-btn');

menuButtons.forEach((btn) => {
    const menuId = btn.dataset.menuTarget;
    const menu = menuId ? document.getElementById(menuId) : null;

    btn.addEventListener('click', function () {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));

        if (btn.classList.contains('header__menu_btn')) {
            btn.classList.toggle('header__menu_btn-active');
        }
        if (btn.classList.contains('header__menu-about_btn')) {
            btn.classList.toggle('header__menu-about_btn-active');
        }

        if (menu) {
            if (menu.classList.contains('header__menu_list')) {
                menu.classList.toggle('header__menu_list-active');
            }
            if (menu.classList.contains('header__menu-about_list')) {
                menu.classList.toggle('header__menu-about_list-active');
            }
        }
    });
});

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            terms: formData.get('terms') === 'on',
        };

        const messageEl = document.getElementById('form-message');
        const submitBtn = contactForm.querySelector('.form-submit');

        try {
            submitBtn.disabled = true;
            messageEl.className = 'form-message';
            messageEl.textContent = 'Sending...';

            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                messageEl.className = 'form-message success';
                messageEl.textContent = result.message;
                contactForm.reset();

                // Clear message after 5 seconds
                setTimeout(() => {
                    messageEl.className = 'form-message';
                    messageEl.textContent = '';
                }, 5000);
            } else {
                messageEl.className = 'form-message error';
                messageEl.textContent = result.error || 'Error sending message';
            }
        } catch (error) {
            console.error('Error:', error);
            messageEl.className = 'form-message error';
            messageEl.textContent = 'Error sending message. Please try again.';
        } finally {
            submitBtn.disabled = false;
        }
    });
}

// Developer Profile Toggle
const btnYes = document.getElementById('btn-yes');
const btnBack = document.getElementById('btn-back');
const profileQuestion = document.getElementById('profile-question');
const profileInfo = document.getElementById('profile-info');

if (btnYes && profileQuestion && profileInfo) {
    btnYes.addEventListener('click', () => {
        profileQuestion.style.display = 'none';
        profileInfo.classList.add('active');

        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
}

if (btnBack && profileQuestion && profileInfo) {
    btnBack.addEventListener('click', () => {
        profileInfo.classList.remove('active');
        profileQuestion.style.display = 'block';

        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
}
