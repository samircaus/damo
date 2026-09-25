# Damo

Damo is a customized AEM Edge Delivery Services project with a clean, modern blue and white design system.

**Live Site:** [https://main--damo--samircaus.aem.page/](https://main--damo--samircaus.aem.page/)

## About This Project

This project features:

- **Modern Design System**: A focused white, blue, and slate palette
- **Enhanced UI Components**: Updated buttons, cards, hero sections, tables, header, and footer
- **Improved Light/Dark Mode**: Better contrast and consistent color tokens in both modes
- **Subtle Interaction Design**: Clear hover, focus, and active states without visual clutter
- **Refined Spacing**: Cleaner section rhythm and stronger visual hierarchy
- Built on AEM (Adobe Experience Manager) Edge Delivery Services

### Design Refresh Highlights

**Color Palette**:

- Primary Brand: Modern blue (`#2563eb`)
- Accent: Sky blue (`#0284c7`)
- Neutral Base: White, cool slate, and soft blue-tinted surfaces
- Full color spectrum tuned for accessible contrast

**Component Updates**:

- Buttons with pill corners, clear focus states, and tactile feedback
- Cards with clean borders, subtle tinted shadows, and consistent radius
- Hero sections with blue surface gradients and sharper typography
- Tables with readable spacing and calmer row states
- Header with a white/blue glass surface and single-line desktop rhythm
- Footer with improved contrast and simpler link styling

## Getting Started

### Prerequisites

- Node.js and npm installed
- Git installed

### Local Development

1. Clone this repository to your computer.
2. Install the AEM CLI: `sudo npm install -g @adobe/aem-cli`
3. Start the AEM CLI: `aem up`
4. Open the project folder in your favorite code editor.
5. **Recommended:** Install npm packages: `npm i`

### Content Management

- Content is managed through [DA.live](https://da.live)
- Changes sync automatically via AEM Code Sync

## Features

### Localization & globalization

- Language only support - Ex: en, de, hi, ja
- Region only support - Ex: en-us, en-ca, de-de, de-ch
- Hybrid support - Ex: en, en-us, de, de-ch, de-at
- Fragment-based localized 404s
- Localized Header & Footer
- Do not translate support (#_dnt)

### Flexible section authoring

- Optional containers to constrain content
- Grids: 1-6
- Color scheme: light, dark
- Gap: xs, s, m, l, xl, xxl
- Spacing: xs, s, m, l, xl, xxl
- Background: token / image / color / gradient

### Base content

- Universal buttons w/ extensive styles
- Images w/ retina breakpoint
- Color scheme support: light, dark
- Modern favicon support
- New window support
- Deep link support
- Modal support

### Header and footer content

- Brand - First link in header
- Main Menu - First list in header
- Actions - Last section of header
- Menu & mega menu support
- Disable header/footer via meta props

### Scheduled content

- Schedule content using spreadsheets

### Sidekick

- Extensible plumbing for plugins
- Schedule simulator

### Performance

- Extensible LCP detection

### Developer tools

- Environment detection
- Extensible logging (console, coralogix, splunk, etc.)
- Buildless reactive framework support (Lit)
- Hash utils patterns (#_blank, #_dnt, etc)
- Modern CSS scoping & nesting
- AEM Operational Telemetry

### Operations

- Cloudflare Worker reference implementation

## Design System Dimensions

### Spacing

- **XXL**: 64px (previously 48px)
- **XL**: 48px (previously 32px)
- **L**: 32px (previously 24px)
- **M**: 16px (previously 12px)
- **S**: 8px
- **XS**: 4px

### Emphasis

quiet, default, strong

### Container columns

1 - 12

### Color tokens

100-900 (full spectrum for each color)

### Color Schemes

light, dark (with improved contrast ratios)

---

## Recent Updates (v2.0.0)

### Visual Design Refresh

- Modernized color palette with a focused blue and white system
- Enhanced button styles with consistent pill radius and focus states
- Updated card components with cleaner borders and tinted shadows
- Improved hero section with blue-tinted surfaces and reduced clutter
- Enhanced table styling with better readability
- Updated header with a calmer backdrop and simplified navigation states
- Improved footer contrast and styling
- Enhanced spacing scale for better visual hierarchy
- Added restrained transitions throughout the UI
- Better font rendering with antialiasing

### Documentation

- Updated README with Damo project information
- Added concise design refresh highlights
- Updated package metadata with correct project details
