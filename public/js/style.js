// Animasi salju
const container = document.querySelector('.containerDas');

function createSnowflake() {
    const snowflake = document.createElement('span');
    snowflake.classList.add('snowflake');
    snowflake.textContent = '❄'; 
    snowflake.style.left = Math.random() * 100 + '%'; 
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px'; 
    container.appendChild(snowflake);


    setTimeout(() => {
        snowflake.remove();
    }, 5000); 
}
setInterval(createSnowflake, 300);


// Drop Dowwn Jawaban
const faqIcons = document.querySelectorAll('.faq-icon');

faqIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
        const answerId = icon.getAttribute('data-answer');
        const answerElement = document.querySelector(answerId);

        if (answerElement.classList.contains('hidden')) {
        answerElement.classList.remove('hidden');
        answerElement.classList.add('visible');
        } else {
        answerElement.classList.remove('visible');
        answerElement.classList.add('hidden');
        }
    });
});


// SCROLL CLICK TO PAGE ABOUT
function scrollToClass(className) {
    const target = document.querySelector(`.${className}`);
    if (target) {
        target.scrollIntoView({ behavior:'smooth' });
        target.style.marginTop = '200px';
    }
}

// EDIT ACCOUNT TOMBOL 
function openEditPopup(userId, email, role) {
    document.getElementById('userId-account').value = userId;
    document.getElementById('email-account').value = email;
    document.getElementById('password-account').value = ''; 

    const popup = document.querySelector('.account-popup-container-account');
    popup.classList.add('visible-account');
}

function closePopup() {
    const popup = document.querySelector('.account-popup-container-account');
    popup.classList.remove('visible-account');
}
