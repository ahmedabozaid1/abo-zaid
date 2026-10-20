# Ahmed Abozaid — personal portfolio

A responsive, dependency-free CV website, built directly on the original `ahmedabozaid1/abo-zaid` repository. The existing A/Z logo, portrait, résumé PDF, career history, contact destinations and `CNAME` are preserved.

## Run locally

From this repository directory, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. No package installation or build is required. You can also open `index.html` directly, though an HTTP server is recommended.

## Deploy to GitHub Pages

1. Review the changes on `redesign/cv-portfolio`, then commit and push that branch to your repository.
2. Merge the reviewed changes into the branch used by GitHub Pages (the repository default branch was `master` when cloned).
3. In **Settings → Pages**, select **Deploy from a branch** and the publishing branch, folder **/ (root)**, if not already configured.
4. Keep `CNAME` set to `abozaid.dev`; retain the domain's existing GitHub Pages DNS configuration and HTTPS setting.
5. After GitHub Pages finishes publishing, verify https://abozaid.dev and its CV link.

The site also works on other static hosts: use the repository root as the publish directory, with no build command. Only publish site assets, not `.git` or editor metadata. `CNAME` is specific to GitHub Pages.

GitHub Pages publishes the repository root from `master` through the existing automatic pages build and deployment workflow. No build command is required.

## Editing content

- `index.html`: semantic, server-independent CV content, project summaries, metadata and links.
- `assets/css/portfolio.css`: colors, typography, desktop/mobile layouts, focus styles, reduced-motion support and print styling.
- `assets/js/portfolio.js`: mobile navigation, current section indicator and copyright year.
- `images/logo.jpg`, `images/me2.jpg`: original brand and portrait assets, used without modification.
- `uploads/media/Ahmed_Abozaid_Senior_Software_Engineer_CV.pdf`: downloadable résumé, replaced with the supplied `ahmed_abozaid_SE_CV.pdf` (October 2026 update).

Experience, education, specialties, project details and the IEEE publication are grounded in the supplied `ahmed_abozaid_SE_CV.pdf`. Selected projects summarize documented work at Rayobyte, AllUp.app and Caudex.ai / Comverse.ai; they do not imply public source code or demos. Employment dates follow the supplied CV, including AllUp.app’s June 2026 end date. Rayobyte responsibilities include cloud cost management, large-scale VPS fleet optimization, demand-based autoscaling, infrastructure right-sizing and capacity optimization. The downloadable PDF is an unchanged copy of the supplied file.

The old template assets and `old demo/` remain available for reference but are not loaded by the redesigned homepage. Legacy `#intro`, `#work`, `#cv`, and `#contact` anchors still work. The PDF uses a relative URL so it works on both custom domains and repository subpaths.

## Validation

JavaScript syntax, HTML structure, unique IDs, navigation targets and all local asset/PDF references were checked. Local HTTP responses were checked for the page, stylesheet, JavaScript, images and PDF. Responsive breakpoints cover small phones, tablets and desktop; mobile menu behavior and visual layouts should also receive a final browser review before production publishing.
