# WPSA_MK - React + TypeScript + Vite

This project is a React application built with Vite, TypeScript, and TailwindCSS.

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## GitHub Pages Deployment

This project is configured for deployment on GitHub Pages.

### Automatic Deployment

The project is set up with GitHub Actions to automatically deploy to GitHub Pages whenever changes are pushed to the main branch. The workflow file is located at `.github/workflows/deploy.yml`.

### Manual Deployment

To manually deploy the application to GitHub Pages, run:

```bash
npm run deploy
```

This will build the application and push it to the `gh-pages` branch of your repository.

### GitHub Repository Settings

To ensure your GitHub Pages deployment works correctly:

1. Go to your repository settings on GitHub
2. Navigate to Pages section
3. Under "Build and deployment", select:
   - Source: "GitHub Actions"
4. Wait for the workflow to complete and your site will be live at: https://petar-taneski.github.io/WPSA_MK/

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
