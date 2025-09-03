# create-ally-app

This is a CLI tool built to help you spin up new projects super quickly using the Ally template. No more copy-pasting and manual setup - just one command and you're ready to code!

## Quick Start

The easiest way to get going:

```bash
npx create-ally-app my-awesome-project
```

That's it! The tool will walk you through the rest ✨

## Accessibility Features

This template comes with a full suite of accessibility (a11y) features to ensure your application meets WCAG standards and provides an inclusive user experience. It includes:

- **Scripts for accessibility testing** using [Axe](https://github.com/dequelabs/axe-core), [Pa11y](https://pa11y.org/) and [Lighthouse](https://github.com/GoogleChrome/lighthouse-ci), integrated with GitHub Actions
- **Static accessibility checks** via the `eslint-plugin-jsx-a11y` ESLint plugin
- **Example code** demonstrating accessible components, end-to-end accessibility testing, and color palettes with WCAG-compliant contrast ratios for both light and dark modes

## Want to Tinker?

If you'd like to contribute or just see how it works:

```bash
git clone https://github.com/lucjastozek/create-ally-app
cd create-ally-app
npm install
npm link
```

Now you can test changes with `create-ally-app test-project`

## About the Template

Curious what you're getting? Check out the [Ally template](https://github.com/lucjastozek/ally-template) to see all the things included.

---

_Built with a focus on accessibility 🩷_
