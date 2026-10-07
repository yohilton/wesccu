document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    const root = document.documentElement;
    const toggle = document.querySelector('.product-theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        root.setAttribute('data-theme', savedTheme);
    }

    toggle?.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    });
});
