import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

beforeEach(() => {
    document.body.innerHTML = `
        <button class="header__menu_btn js-menu-btn" type="button" aria-expanded="false" aria-controls="main-menu" data-menu-target="main-menu"></button>
        <ul id="main-menu" class="header__menu_list js-menu-list"></ul>
        <button class="header__menu-about_btn js-menu-btn" type="button" aria-expanded="false" aria-controls="about-menu" data-menu-target="about-menu"></button>
        <ul id="about-menu" class="header__menu-about_list js-menu-list"></ul>
    `;
    vi.resetModules();
});

afterEach(() => {
    document.body.innerHTML = '';
});

describe('menu toggle behaviour', () => {
    it('toggles main navigation button and menu classes', async () => {
        await import('./script.js');
        const btn = document.querySelector('.header__menu_btn');
        const menu = document.getElementById('main-menu');

        btn.click();

        expect(btn.getAttribute('aria-expanded')).toBe('true');
        expect(menu.classList.contains('header__menu_list-active')).toBe(true);
    });

    it('toggles about page menu button and menu classes', async () => {
        await import('./script.js');
        const btn = document.querySelector('.header__menu-about_btn');
        const menu = document.getElementById('about-menu');

        btn.click();

        expect(btn.getAttribute('aria-expanded')).toBe('true');
        expect(menu.classList.contains('header__menu-about_list-active')).toBe(
            true
        );
    });
});
