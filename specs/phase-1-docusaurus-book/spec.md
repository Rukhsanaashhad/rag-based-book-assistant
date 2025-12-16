# Feature Specification: Phase 1 Docusaurus Book

**Feature Branch**: `feat/phase-1-docusaurus-book`  
**Created**: 2025-12-12
**Status**: Draft  
**Input**: User description: "Create the complete technical specification for Phase 1 Docusaurus book according to constitution v1.0.0. Include exact folder structure, file names, sidebar hierarchy, required npm packages, docusaurus.config.js settings. Output everything in executable format so the next /sp.plan can build the full skeleton instantly."

## User Scenarios & Testing

### User Story 1 - Reader Experience (Priority: P1)

As a student, I want to access a polished, easy-to-navigate, and searchable online book on Physical AI, so that I can learn effectively.

**Independent Test**: The Docusaurus site can be built and served locally, demonstrating the complete sidebar navigation, theme, and search functionality on all generated pages.

**Acceptance Scenarios**:
1.  **Given** I am on the book's website, **When** I view the sidebar, **Then** I see a navigation structure that exactly matches the 9 official book modules.
2.  **Given** I am on any page, **When** I use the search bar, **Then** I can find relevant sections by title or content.
3.  **Given** I am on a mobile device, **When** I browse the book, **Then** the content is responsive and readable.
4.  **Given** I prefer dark mode, **When** I toggle the theme, **Then** the entire site switches to a dark color scheme.

### User Story 2 - Authoring & Deployment (Priority: P1)

As the author, I want to initialize the Docusaurus project with a pre-defined structure and configuration, so that I can immediately start writing content and deploy it seamlessly.

**Independent Test**: After running the setup script, a complete file and folder skeleton is created, and the `npm run build` command executes successfully without errors.

**Acceptance Scenarios**:
1.  **Given** I have a clean repository, **When** the plan is executed, **Then** a Docusaurus v3 project is created with all folders and placeholder files as defined in the Functional Requirements.
2.  **Given** the project has been initialized, **When** I run `npm install`, **Then** all required dependencies are installed.
3.  **Given** the project is set up, **When** I run `npm run build`, **Then** the static site builds into the `build/` directory successfully.
4.  **Given** the `docusaurus.config.js` is correctly configured for GitHub Pages, **When** I run the deployment command, **Then** the book is published to the specified GitHub Pages URL.

## Requirements

### FR-001: Project Initialization
- The project MUST be a Docusaurus v3 project initialized with the `classic` preset.
- The command for initialization is `npx create-docusaurus@latest my-book classic`.

### FR-002: NPM Dependencies
- The project MUST include the standard Docusaurus `classic` preset dependencies.
- The `theme-mermaid` package MUST be added to support Mermaid diagrams.
  - Command: `npm install @docusaurus/theme-mermaid`

### FR-003: Root Directory Structure
- The root directory MUST contain the following files and folders:

```text
/my-book
├── .docusaurus/
├── blog/
├── docs/                 # All book content lives here
├── src/
│   ├── components/
│   ├── css/
│   │   └── custom.css
│   └── pages/
│       └── index.js
├── static/
│   └── img/
├── docusaurus.config.js  # Main config file
├── package.json
├── sidebars.js           # Sidebar configuration
└── README.md
```

### FR-004: `docs` Folder Structure (Strict)
- The `docs` folder MUST contain the exact structure and placeholder files corresponding to the 9-part book structure.

```text
/docs
├── 00-introduction/
│   ├── 01-why-physical-ai-matters.md
│   ├── 02-from-digital-ai-to-embodied-intelligence.md
│   └── 03-current-humanoid-landscape.md
├── 01-module-1-ros/
│   ├── 01-introduction.md
│   ├── 02-week-1.md
│   ├── 03-week-2.md
│   ├── 04-week-3.md
│   ├── 05-week-4.md
│   └── 06-week-5.md
├── 02-module-2-digital-twin/
│   ├── 01-introduction.md
│   ├── 02-week-6.md
│   └── 03-week-7.md
├── 03-module-3-nvidia-isaac/
│   ├── 01-introduction.md
│   ├── 02-week-8.md
│   ├── 03-week-9.md
│   └── 04-week-10.md
├── 04-module-4-vla-humanoid/
│   ├── 01-introduction.md
│   ├── 02-week-11.md
│   ├── 03-week-12.md
│   └── 04-week-13.md
├── 05-capstone-project/
│   └── 01-autonomous-humanoid.md
├── 06-assessments/
│   └── 01-grading-rubrics.md
├── 07-appendices/
│   ├── 01-hardware-requirements.md
│   ├── 02-lab-setups.md
│   ├── 03-jetson-student-kit.md
│   ├── 04-troubleshooting.md
│   └── 05-further-reading.md
└── _category_.json # For the root of the docs
```

### FR-005: `docusaurus.config.js`
- The `docusaurus.config.js` MUST be configured as follows. **Note**: `url` and `baseUrl` will need to be updated with the user's GitHub username.

```javascript
// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Bridging Digital Brains with Physical Bodies',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://<your-username>.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/physical-ai-book/',

  // GitHub pages deployment config.
  organizationName: '<your-username>',
  projectName: 'physical-ai-book',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/', // Serve the docs at the site's root
        },
        blog: false, // Disable the blog
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Physical AI & Humanoid Robotics',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            href: 'https://github.com/<your-username>/physical-ai-book',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
```

### FR-006: `sidebars.js`
- The `sidebars.js` file MUST define the navigation structure that perfectly mirrors the folder structure and the constitution's 9-part outline.

```javascript
// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  bookSidebar: [{type: 'autogenerated', dirName: '.'}],
};

export default sidebars;
```
*(Note: Using `autogenerated` is sufficient and robust as long as the folder/file naming convention in `FR-004` is strictly followed. The numbered prefixes ensure correct ordering.)*

### FR-007: Homepage (`src/pages/index.js`)
- The homepage should be a simple hero page introducing the book.

```javascript
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteCodefig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/introduction/why-physical-ai-matters">
            Start Reading
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome`}
      description="An interactive online book on Physical AI and Humanoid Robotics.">
      <HomepageHeader />
      <main>
        {/* You can add more sections here if needed */}
      </main>
    </Layout>
  );
}
```

## Success Criteria

- **SC-001**: The command `npm run build` completes with exit code 0.
- **SC-002**: A local development server (`npm start`) successfully serves the site, and the sidebar navigation matches the 9-part book structure perfectly.
- **SC-003**: All placeholder `.md` files exist and render as pages with their correct titles.
- **SC-004**: The website is successfully deployed and accessible at the target GitHub Pages URL.
- **SC-005**: All constitution v1.0.0 principles (Docusaurus v3, Structure, Phase 1 Scope) are met.
