const btn = document.querySelector('.js-menu-btn');
const menu = document.querySelector('.js-menu-list');

btn.addEventListener('click', function(){
    btn.classList.toggle('header__menu_btn-active'); 
    menu.classList.toggle('header__menu_list-active')
})