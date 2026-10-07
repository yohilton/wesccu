# WESCCU Website

Responsive static website for Western Chamber Co-operative Credit Union (WESCCU) Ltd.

## Run locally

No build step or package installation is required. From this folder, start a local web server with Python:

```powershell
py -m http.server 3000
```

Then open <http://localhost:3000> in your browser. Press `Ctrl+C` in the terminal to stop the server.

You can also open `index.html` directly, though a local server is recommended for consistent asset loading.

## Project structure

- `index.html` — homepage
- `products/` — savings, shares, loan, and business product pages
- `css/` — site styles
- `js/` — site interactions
- `assets/` — images and graphics
