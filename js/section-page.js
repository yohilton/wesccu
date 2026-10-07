document.addEventListener('DOMContentLoaded', async () => {
    const views = {
        about: { sections: ['about'], title: 'About WESCCU' },
        services: { sections: ['services'], title: 'WESCCU Services' },
        'why-us': { sections: ['why-us'], title: 'Why Choose WESCCU' },
        branches: { sections: ['branches', 'faq'], title: 'Branches and Frequently Asked Questions' },
        contact: { sections: ['contact'], title: 'Contact WESCCU' }
    };
    const view = new URLSearchParams(window.location.search).get('view') || 'about';
    const page = views[view] || views.about;
    const content = document.getElementById('section-page-content');

    try {
        const response = await fetch('index.html');
        if (!response.ok) throw new Error('Could not load WESCCU page content.');
        const source = new DOMParser().parseFromString(await response.text(), 'text/html');
        const sections = page.sections.map(id => source.getElementById(id));
        if (sections.some(section => !section)) throw new Error('This information page is unavailable.');
        content.replaceChildren(...sections.map(section => section.cloneNode(true)));
        document.title = `${page.title} | WESCCU`;
        document.querySelector('meta[name="description"]').content = `${page.title}. Information from Western Chamber Co-operative Credit Union.`;
        document.getElementById('page-year').textContent = new Date().getFullYear();

        content.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => el.classList.add('active'));
        if (window.lucide) lucide.createIcons();
        initializePageInteractions(content);
    } catch (error) {
        content.innerHTML = `<div class="section-page-error"><h1>${page.title}</h1><p>${error.message}</p><a class="btn btn-primary" href="index.html">Return to the homepage</a></div>`;
    }

    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', savedTheme || (systemDark ? 'dark' : 'light'));
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    const menu = document.querySelector('.mobile-menu');
    const menuButton = document.querySelector('.mobile-menu-btn');
    const closeMenu = () => {
        menu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
    };
    menuButton.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        menuButton.setAttribute('aria-expanded', String(open));
    });
    document.querySelector('.close-menu').addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
});

function initializePageInteractions(root) {
    root.querySelectorAll('.tab-btn').forEach(button => button.addEventListener('click', () => {
        root.querySelectorAll('.tab-btn').forEach(item => item.classList.toggle('active', item === button));
        root.querySelectorAll('.tab-pane').forEach(pane => pane.classList.toggle('active', pane.id === button.dataset.tab));
    }));

    root.querySelectorAll('.faq-btn').forEach(button => button.addEventListener('click', () => {
        const item = button.parentElement;
        const content = item.querySelector('.faq-content');
        const open = item.classList.toggle('active');
        content.style.maxHeight = open ? `${content.scrollHeight}px` : null;
    }));

    const map = root.querySelector('#branch-map');
    const mapTitle = root.querySelector('#branch-map-title');
    const mapLink = root.querySelector('#branch-map-open');
    root.querySelectorAll('.branch-map-select').forEach(button => button.addEventListener('click', () => {
        const location = button.dataset.location;
        const label = button.dataset.label;
        const encoded = encodeURIComponent(location);
        root.querySelectorAll('.branch-map-select').forEach(item => {
            const active = item === button;
            item.classList.toggle('active', active);
            item.setAttribute('aria-pressed', String(active));
        });
        mapTitle.textContent = label;
        map.title = `Map showing the ${label} area`;
        map.src = `https://www.google.com/maps?q=${encoded}&output=embed`;
        mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
    }));

    const form = root.querySelector('.contact-form');
    if (form) form.addEventListener('submit', event => {
        event.preventDefault();
        const data = new FormData(form);
        const subject = `WESCCU website enquiry from ${data.get('name')}`;
        const body = [`Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `Phone: ${data.get('phone')}`, '', 'Message:', data.get('message')].join('\n');
        window.location.href = `mailto:chambercreditunion@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}
