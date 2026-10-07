# WESCCU Website

Responsive static website for Western Chamber Co-operative Credit Union (WESCCU) Ltd.

## Run locally

No build step or package installation is required. From this folder, start a local web server with Python:

```powershell
py -m http.server 3000
```

Then open <http://localhost:3000> in your browser. Press `Ctrl+C` in the terminal to stop the server. Use the local server so the focused pages linked from the mobile menu can load their content correctly.

## Project structure

- `index.html` — homepage
- `products/` — savings, shares, loan, and business product pages
- `css/` — site styles
- `js/` — site interactions
- `assets/` — images and graphics
