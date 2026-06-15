# 🎨 CSS Gradient & Shadow Generator

> A powerful, free visual tool for designers and developers to generate production-ready CSS gradients, shadows, and color palettes — in real time.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Tool-blueviolet?style=for-the-badge)](https://your-domain.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://vitejs.dev)

---

## 🚀 What Is This?

CSS Gradient & Shadow Generator is a **free, browser-based design tool** that helps you:

- Build complex CSS gradients visually — no guessing hex codes or angles.
- Layer multiple box/text shadows with a clean interface.
- Explore color palettes (complementary, analogous, triadic) from any base color.
- Copy production-ready CSS with one click.

**Who is it for?** Frontend developers, UI/UX designers, indie hackers, students — anyone who wants to ship beautiful CSS fast.

---

## ✨ Features

### 🌈 Gradient Generator
- Linear and Radial gradient modes
- Angle control slider (0°–360°) for linear gradients
- Add unlimited color stops with color pickers + position sliders
- Live CSS output that updates as you type

### 🌑 Shadow Generator
- `box-shadow` and `text-shadow` support
- Sliders for X offset, Y offset, Blur radius, and Spread
- Color picker with opacity/alpha control
- Inset toggle for inner shadows
- **Layer multiple shadows** for rich, complex effects
- One-click copy of the complete shadow CSS string

### 🎨 Color Palette & Schema Generator
- Complementary, Analogous, and Triadic palette modes
- Generate shades and tints from any base color
- Click any swatch to copy its hex code instantly
- Export entire palettes as CSS variables

### ⚡ Live Preview
- Unified interactive preview area — see all changes (gradient, shadow, color) applied simultaneously to a preview element
- Toggle between light and dark backgrounds to test contrast

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (via Vite) |
| Styling | Vanilla CSS with CSS Variables |
| Icons | Lucide React |
| Build Tool | Vite |
| Deployment | Vercel / Netlify (recommended) |

---

## 📁 Project Structure

```
src/
├── App.jsx                  # Root layout, tab routing
├── App.css                  # Global design system & CSS variables
├── index.css                # Base resets and font imports
└── components/
    ├── GradientGenerator.jsx  # Gradient state + UI
    ├── ShadowGenerator.jsx    # Shadow layers state + UI
    ├── ColorPalette.jsx       # Color schema generation
    ├── Preview.jsx            # Live visual preview box
    └── CodeOutput.jsx         # Copy-to-clipboard CSS output
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/css-gradient-shadow-generator.git
cd css-gradient-shadow-generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 💰 Monetization & Growth Strategy

This tool is designed to grow into a sustainable, revenue-generating product. Here's the roadmap:

### Phase 1 — Launch & Traffic (Month 1–3)
- Launch on **Product Hunt**, **Hacker News (Show HN)**, and **Dev.to**
- Post tutorial content on YouTube ("How to make glassmorphism buttons with CSS") linking back to the tool
- Submit to directories: **Undesign**, **CSS-Tricks resources**, **Tiny Helpers**, **Free Design Tools**
- Answer relevant questions on Stack Overflow and Reddit (r/webdev, r/css) using the tool as a resource

### Phase 2 — Ad Revenue (Month 2+)
- Integrate **Google AdSense** in non-intrusive placements (sidebar, below-the-fold)
- Consider **Carbon Ads** — a developer-focused ad network with higher CPMs and better UX fit
- Target 10,000+ monthly visitors for meaningful ad revenue

### Phase 3 — Premium Features (Month 4–6)
| Feature | Free | Pro ($5/mo) |
|---|---|---|
| Gradient Generator | ✅ | ✅ |
| Shadow Generator | ✅ | ✅ |
| Color Palettes | Basic | Advanced (unlimited palettes, export) |
| Save & Share presets | ❌ | ✅ |
| Export as Tailwind config | ❌ | ✅ |
| CSS-in-JS / Styled Components output | ❌ | ✅ |
| Team workspace | ❌ | ✅ |

### Phase 4 — Competitive Differentiation
Key competitors include CSS Gradient (cssgradient.io), Coolors, and Neumorphism.io. We win by:

1. **Combining all tools in one** — gradient + shadow + palette, no switching tabs
2. **Better UX** — live preview with real element rendering, not just a color swatch
3. **Developer-first output** — clean, minimal CSS with copy-paste code blocks
4. **Free forever core** — no signup wall for basic features

---

## 🗺️ Roadmap

- [x] Gradient Generator (linear + radial)
- [x] Shadow Generator with layer stacking
- [x] Color Palette Generator
- [x] Live unified preview
- [ ] Save/share presets via URL (no login required)
- [ ] Tailwind CSS output mode
- [ ] CSS custom properties / design tokens export
- [ ] Figma plugin integration
- [ ] Dark/light mode toggle for the app itself
- [ ] Neumorphism / glassmorphism presets
- [ ] AI-powered palette suggestions

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

## 🙌 Acknowledgements

Inspired by the developer community's need for faster, more visual CSS tooling. Built with ❤️ using React and Vite.

---

*If this tool saves you time, consider sharing it with a friend or starring the repo. It helps more than you'd think.*
