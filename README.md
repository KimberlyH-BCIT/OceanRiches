# 🌊 Ocean Riches

**A sophisticated news-style portfolio website featuring advanced CSS animations, 3D transforms, and interactive JavaScript**

> Built as part of WebDevTNT A04 — Advanced CSS: News-Style Portfolio Homepage

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Development Journey](#development-journey)
- [AI-Assisted Development](#ai-assisted-development)
- [Team Contributions](#team-contributions)
- [Installation & Usage](#installation--usage)
- [Key Learning Outcomes](#key-learning-outcomes)
- [License](#license)

---

## 🎯 Overview

**Ocean Riches** is a content-rich, fully responsive landing page designed in the style of a modern news publication. The project showcases advanced CSS techniques including custom properties, animations, transforms, and complex layout systems. The site features a fantasy/ocean theme with satirical tech articles that blend humor with genuine web development insights.

**Live Demo:** [View Project][def] <!-- Add your deployed URL -->

---

## ✨ Features

### 🎨 Advanced CSS
- **30+ CSS Custom Properties** — Comprehensive design system with color palettes, spacing scales, gradients, and functional aliases
- **3D Tarot Card Flip Effect** — Perspective-based card flip animation with backface-visibility for featured articles
- **Ripple Effect System** — Directional wave animations on interactive elements (navigation, cards, tags)
- **Modal Zoom Animation** — Card-to-modal transform with origin-based scaling for seamless transitions
- **Custom Scrollbar** — Themed scrollbar with ocean-inspired colors and glow effects
- **Shimmer Animations** — Gradient-based shimmer effects on logo, title, and borders
- **Backdrop Filters** — Frosted glass effects on cards and overlays for depth

### 🎭 Interactive JavaScript (890+ lines)
- **Tarot Card System** — Random background image assignment on page load (29 unique tarot designs)
- **Modal Management** — Accessible modal with focus trapping, scroll locking, and keyboard navigation
- **Ripple Effect Engine** — Calculates entry points, ripple size, and push direction for realistic wave propagation
- **State Management** — Prevents race conditions with animation state tracking
- **Mobile Navigation** — Responsive hamburger menu with ARIA labels and smooth transitions

### ♿ Accessibility
- **ARIA Labels** — Comprehensive screen reader support throughout
- **Skip Links** — Keyboard navigation shortcuts to main content
- **Focus Management** — Proper focus trapping in modals and navigation
- **Semantic HTML** — Proper heading hierarchy and landmark regions
- **Touch Targets** — Minimum 44×44px touch targets for mobile users

### 📱 Responsive Design
- **Mobile-First Approach** — Fluid layouts from 320px to 1920px+ widths
- **Responsive Images** — srcset implementation with multiple image sizes for optimal performance
- **WebP Format** — Modern image format for reduced file sizes (48 optimized images)
- **Breakpoint System** — Seamless transitions between mobile, tablet, and desktop layouts

---

## 📂 Project Structure

```
OceanRiches/
├── index.html              # Main HTML document (1412 lines)
├── README.md               # Project documentation
├── LICENSE                 # MIT License
├── site.webmanifest        # PWA manifest
├── debug-info.txt          # Development troubleshooting guide
├── assets/
│   └── images/
│       ├── header/         # Logo and header backgrounds (multiple sizes)
│       ├── footer/         # Footer background images
│       ├── tarot-cards/    # 29 unique tarot card backgrounds (.webp)
│       └── article-*.png   # Article feature images
├── scripts/
│   └── script.js           # Interactive JavaScript (890 lines)
└── styles/
    ├── normalize-ssd.css   # CSS reset
    ├── styles.css          # Base styles (1727 lines)
    └── responsive.css      # Media queries and responsive overrides
```

---

## 🛠️ Technologies Used

### Frontend
- **HTML5** — Semantic markup with ARIA attributes
- **CSS3** — Advanced features including Grid, Flexbox, Custom Properties, Animations
- **Vanilla JavaScript (ES6+)** — Modern JavaScript with IIFE pattern, strict mode

### Development & Design Tools
- **ChatGPT** — Troubleshooting assistance and image editing guidance
- **Perchance AI Character Generator** — AI image generation for custom graphics
- **Pixelcut AI Image Editor** — Image upscaling and enhancement
- **Adobe Photoshop** — Advanced image editing and manipulation
- **Responsive Image Generator** ([johnfraney.ca](https://johnfraney.ca/tools/responsive-image-generator/)) — Creating multiple image sizes for srcset
- **ImageCompressor.com** — Image optimization and compression
- **W3C Markup Validator** — HTML validation and compliance checking
- **GitHub Copilot** — Code suggestions and documentation assistance

### Fonts
- **Google Fonts:**
  - Macondo Swash Caps — Decorative body text
  - Cinzel Decorative — Elegant headings
  - New Rocker — Bold emphasis

### Performance
- **WebP Images** — 48 optimized images
- **Responsive Images** — srcset with 7 breakpoints for header
- **Preconnect** — DNS prefetching for Google Fonts

---

## 🚀 Development Journey

### Git History Overview
**Total Commits:** 57 commits  
**Contributors:** 2 team members  
**Pull Requests:** 20 merged PRs  
**Development Period:** December 20, 2025 - January 18, 2026 (4 weeks)

### Development Timeline

#### **Week 1: Foundation (Dec 20-27)**
- Initial repository setup and project structure
- Team color palette and design system established
- Responsive image system with srcset implementation
- Basic layout structure with CSS Grid and Flexbox

#### **Week 2: Core Features (Dec 28 - Jan 3)**
- 3D tarot card flip effect implementation
- Featured modal overlay system
- Enhanced visual effects (backdrop filters, ornate borders)
- Hamburger menu navigation for mobile
- Custom scrollbar styling
- Article content creation (2 articles per team member)

#### **Week 3: Refinement (Jan 4-10)**
- Latest articles section with card effects
- Code review fixes and improvements
- Footer adjustments and disclaimer
- Navigation layout optimization
- Background color fine-tuning

#### **Week 4: Polish & Final Touches (Jan 11-18)**
- Complete documentation overhaul (890-line script.js with detailed comments)
- Modal animation improvements
- Article layout normalization and accessibility fixes
- Random tarot card background images (29 unique designs)
- Navigation positioning and font size adjustments
- Header responsiveness improvements
- Final image optimization and WebP conversion
- Quality assurance and bug fixes

### Key Milestones

| Date | Milestone | Description |
|------|-----------|-------------|
| Dec 20 | Initial commit | Project initialization |
| Dec 27 | Major refactor | Fixed critical bugs, enhanced responsive design |
| Jan 5 | Modal system | Card-to-modal zoom animation complete |
| Jan 9 | Documentation | Comprehensive code comments added |
| Jan 12 | Random tarot | Dynamic background image system |
| Jan 18 | Final polish | Header optimization and image quality improvements |

---

## 🤖 AI-Assisted Development

This project leveraged AI assistance (GitHub Copilot) throughout the development process, enhancing productivity and code quality while maintaining full developer understanding and control.

### How AI Was Used

#### 1. **Code Documentation & Comments**
- **Usage:** Generated comprehensive JSDoc-style comments for all JavaScript functions
- **Benefit:** 890 lines of well-structured documentation explaining algorithms, flow, and purpose
- **Human Oversight:** All comments reviewed and refined for accuracy and clarity
- **Example:** Detailed explanations of ripple effect calculations, modal state management, and accessibility features

#### 2. **CSS Architecture**
- **Usage:** Assisted in organizing 1727 lines of CSS with clear table of contents
- **Benefit:** Logical section grouping (custom properties, animations, selectors)
- **Human Oversight:** Design decisions, color choices, and layout strategies remained human-driven
- **Example:** CSS custom property naming conventions and functional aliases

#### 3. **Algorithm Implementation**
- **Usage:** Helped implement complex calculations (ripple positioning, entry point detection)
- **Benefit:** Mathematical accuracy in `calculateRippleSize()` and `calculateEntryPoint()` functions
- **Human Oversight:** Algorithm logic verified through testing and debugging
- **Example:** Hypot calculations for finding farthest corner in ripple sizing

#### 4. **Accessibility Features**
- **Usage:** Suggested ARIA attributes and keyboard navigation patterns
- **Benefit:** Screen reader support, focus management, and semantic HTML
- **Human Oversight:** Tested with actual accessibility tools to ensure compliance
- **Example:** Focus trapping in modals, skip links, proper ARIA labels

#### 5. **Debugging & Problem-Solving**
- **Usage:** Assisted in diagnosing issues (e.g., module type causing script failures)
- **Benefit:** Faster resolution of blocking issues
- **Human Oversight:** Root cause analysis and final fixes implemented by developers
- **Example:** Identified `type="module"` issue preventing script execution (documented in debug-info.txt)

#### 6. **Code Refactoring**
- **Usage:** Suggested improvements for code organization and performance
- **Benefit:** More maintainable codebase with clear separation of concerns
- **Human Oversight:** All refactoring decisions evaluated for project fit
- **Example:** CONFIG object for centralized timing and selector constants

#### 7. **Generative AI for Image Creation**
- **Usage:** All images (header backgrounds, footer, tarot cards, article images) were generated using Perchance AI Character Generator, edited with Photoshop and Pixelcut AI upscaling
- **Benefit:** Custom, cohesive visual assets that perfectly match the ocean/fantasy theme
- **Human Oversight:** Carefully crafted prompts, curated outputs, manual editing, and optimization/conversion to WebP format
- **Workflow:** Generation → Photoshop editing → Upscaling (Pixelcut) → Responsive sizing (Responsive Image Generator) → Compression (ImageCompressor.com)
- **Total Assets:** 48 AI-generated and optimized images for multiple screen sizes
- **Example:** 29 unique tarot card backgrounds, responsive header images (7 sizes), thematic article illustrations
- **Troubleshooting:** ChatGPT used for image editing guidance and problem-solving

### What AI Did NOT Do
- ❌ **Creative Design Decisions** — Theme, color palette, layout, and visual direction entirely human-designed by Kimberly
- ❌ **Content Creation** — All articles, headlines, and copy written by team members
- ❌ **Architecture Decisions** — Project structure, technology choices, and feature planning
- ❌ **Final Implementation** — All code was written, reviewed, and tested by human developers
- ❌ **Quality Control** — Code reviews, testing, and validation performed by team

**Note on Images:** While generative AI was used to create the images, all design direction, prompts, curation, and optimization were done by Kimberly Hilliker.

### AI Usage Philosophy
> "AI is a powerful tool, but the developer remains the architect, designer, and decision-maker. We used AI to enhance our productivity, not replace our thinking."

**Key Principle:** Every AI suggestion was evaluated, tested, and often modified before integration. The team maintained full understanding of every line of code, ensuring we could debug, extend, and explain all functionality.

---

## 👥 Team Contributions

### Team Members
- **Kimberly Hilliker (Velyene Tsang)** — Project Lead, Developer & Architect
- **Thinh Doan** — Feature Developer & Content Creator

### Contribution Breakdown

#### **Kimberly Hilliker (Velyene Tsang)**
- **Complete design direction** — Theme concept, color palette, layout design, and visual aesthetics
- **Image generation** — Created 48 custom images using generative AI (tarot cards, headers, articles)
- **Modal zoom animation** — Card-to-modal transform with origin-based scaling
- Repository management and PR reviews (20 merged PRs)
- Initial project setup and team coordination
- Major refactoring and responsive design implementation
- Header/footer layout and background systems
- Image assets, favicon implementation, and optimization
- Image optimization and WebP conversion (48 images)
- Tarot card image quality improvements
- Documentation and comprehensive code comments
- Accessibility improvements
- Quality assurance and final polish coordination

#### **Thinh Doan**
- 3D flip card effect implementation
- Modal overlay system
- Hamburger menu and navigation
- Custom scrollbar styling
- Visual effects (backdrop filters, shimmer animations)
- Article content creation and layout
- Feature development and bug fixes

### Collaboration Process
- **Version Control:** Git with feature branch workflow
- **Communication:** Regular check-ins and code reviews
- **PR Process:** All features merged via pull requests with peer review
- **Shared Ownership:** Both team members contributed to and understood the codebase

---

## 💻 Installation & Usage

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build process required — pure HTML/CSS/JavaScript

### Local Development

```bash
# Clone the repository
git clone https://github.com/KimberlyH-BCIT/OceanRiches.git

# Navigate to project directory
cd OceanRiches

# Open in browser
# Option 1: Double-click index.html
# Option 2: Use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000

# Or use VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

### Features to Explore
1. **Tarot Card Flip** — Click featured story cards to flip and reveal full content
2. **Modal Zoom** — Click again after flip to open full-screen modal with smooth zoom animation
3. **Ripple Effects** — Hover over navigation links, article cards, and tags
4. **Random Backgrounds** — Refresh page to see different tarot card backgrounds
5. **Mobile Menu** — Resize window below 768px to see hamburger navigation
6. **Custom Scrollbar** — Scroll the page to see themed scrollbar (Webkit browsers)

---

## 🎓 Key Learning Outcomes

### CSS Mastery
- ✅ **Custom Properties** — Created comprehensive design system with 30+ variables
- ✅ **Advanced Selectors** — Used descendant, child, adjacent sibling, attribute, and pseudo-selectors
- ✅ **Transforms** — 3D perspective, rotateY, scale, translate for card flips and zooms
- ✅ **Transitions** — Smooth state changes on hover, focus, and interactions
- ✅ **Animations** — Keyframe animations for shimmer, ripple, breathe, and zoom effects
- ✅ **Grid & Flexbox** — Complex responsive layouts with multiple breakpoints
- ✅ **Backdrop Filters** — Frosted glass effects for visual depth

### JavaScript Skills
- ✅ **DOM Manipulation** — Dynamic element creation and modification
- ✅ **Event Handling** — Mouse, keyboard, and focus events
- ✅ **State Management** — Tracking modal and animation states
- ✅ **Mathematical Calculations** — Geometry for ripple effects and positioning
- ✅ **Accessibility** — Focus trapping, scroll locking, ARIA attribute management
- ✅ **Code Organization** — IIFE pattern, configuration objects, clear function naming

### Professional Practices
- ✅ **Version Control** — Git workflow with feature branches and PRs
- ✅ **Code Documentation** — Comprehensive comments explaining logic and algorithms
- ✅ **Responsive Design** — Mobile-first approach with progressive enhancement
- ✅ **Performance Optimization** — Image optimization, efficient selectors, minimal reflows
- ✅ **Accessibility** — WCAG compliance with semantic HTML and ARIA
- ✅ **Team Collaboration** — Effective communication and code review process

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Copyright (c) 2026 Kimberly Hilliker (Velyene Tsang) & Thinh Doan**

---

## 🙏 Acknowledgments

- **BCIT WebDevTNT Program** — For providing the project requirements and learning framework
- **ChatGPT** — For troubleshooting assistance and image editing guidance
- **GitHub Copilot** — For AI assistance in documentation, code suggestions, and debugging support
- **Perchance AI Character Generator** — For AI-generated character images and visual assets
- **Pixelcut AI Image Editor** — For image upscaling and enhancement ([pixelcut.ai](https://www.pixelcut.ai/ai-image-editor?tool=upscale))
- **Adobe Photoshop** — For professional image editing and manipulation
- **Responsive Image Generator** — For creating multiple image sizes ([johnfraney.ca](https://johnfraney.ca/tools/responsive-image-generator/))
- **ImageCompressor.com** — For optimizing and compressing images ([imagecompressor.com](https://imagecompressor.com/))
- **W3C Markup Validator** — For HTML validation ([validator.w3.org](https://validator.w3.org/))
- **Google Fonts** — For beautiful typography (Macondo Swash Caps, Cinzel Decorative, New Rocker)

---

**Built with 💙 by the Ocean Riches Team**  
*Where magic meets code, and bugs become features.*


[def]: #