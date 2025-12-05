# Solution for Broken Images on GitHub Pages with Next.js

## Problem Description

When deploying a Next.js application to GitHub Pages using static export (`output: 'export'`), images were broken after deployment. The images worked correctly in local development but failed to load in production.

### Root Cause

GitHub Pages serves the site from a subdirectory (e.g., `https://username.github.io/repository-name/`), which means all asset paths need to include the `basePath`. Next.js static export doesn't automatically handle this when using the `Image` component or static assets.

## Solution

### 1. Use `actions/configure-pages@v5` with `static_site_generator: next`

The GitHub Actions workflow should use the official Next.js configuration action that automatically handles `basePath` and `output: 'export'`.

**Workflow file (`.github/workflows/nextjs.yml`):**

```yaml
- name: Setup Pages
  uses: actions/configure-pages@v5
  with:
    static_site_generator: next
```

This action automatically:
- Injects `basePath` into `next.config.js`
- Sets `output: 'export'` for static export
- Disables server-side image optimization (`images.unoptimized: true`)

### 2. Simplify `next.config.js`

Remove manual `basePath` and `output: 'export'` configurations. Let the GitHub Actions handle it:

```javascript
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
```

### 3. Use Direct Image Paths

For static images in the `public` folder, use direct paths. The Next.js `Image` component will automatically handle the `basePath` when configured by the action:

```tsx
import Image from 'next/image';

<Image 
  src="/images/example.png" 
  alt="Example" 
  width={800} 
  height={600}
/>
```

### 4. Dynamic BasePath Utility (Optional)

If you need to handle `basePath` manually for dynamic paths, create a utility:

```typescript
// lib/getBasePath.ts
export function getBasePath(): string {
  if (typeof window !== 'undefined') {
    return window.location.pathname.split('/')[1] || '';
  }
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

export function withBasePath(path: string): string {
  const basePath = getBasePath();
  if (!basePath || path.startsWith('http')) return path;
  return `/${basePath}${path}`;
}
```

## Complete GitHub Actions Workflow Example

```yaml
name: Deploy Next.js site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Detect package manager
        id: detect-package-manager
        run: |
          if [ -f "${{ github.workspace }}/yarn.lock" ]; then
            echo "manager=yarn" >> $GITHUB_OUTPUT
            echo "command=install" >> $GITHUB_OUTPUT
            echo "runner=yarn" >> $GITHUB_OUTPUT
          elif [ -f "${{ github.workspace }}/package.json" ]; then
            echo "manager=npm" >> $GITHUB_OUTPUT
            echo "command=ci" >> $GITHUB_OUTPUT
            echo "runner=npx --no-install" >> $GITHUB_OUTPUT
          fi
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: ${{ steps.detect-package-manager.outputs.manager }}
      
      - name: Setup Pages
        uses: actions/configure-pages@v5
        with:
          static_site_generator: next
      
      - name: Install dependencies
        run: ${{ steps.detect-package-manager.outputs.manager }} ${{ steps.detect-package-manager.outputs.command }}
      
      - name: Build with Next.js
        env:
          NODE_ENV: production
        run: ${{ steps.detect-package-manager.outputs.runner }} next build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Key Points

1. **Never manually set `basePath` or `output: 'export'`** in `next.config.js` when using `actions/configure-pages@v5`
2. **Always use `static_site_generator: next`** in the Setup Pages step
3. **Images must be in the `public` folder** and referenced with paths starting with `/`
4. **Use `images.unoptimized: true`** for static exports (automatically set by the action)
5. **The action handles all path transformations** automatically

## Troubleshooting

### Images still broken?

1. Check if `actions/configure-pages@v5` is being used correctly
2. Verify `next.config.js` doesn't have manual `basePath` or `output` settings
3. Ensure images are in the `public` folder
4. Check browser console for 404 errors on image paths
5. Verify the `out` folder contains the images after build

### Alternative: Manual BasePath Handling

If you need more control, you can manually set `basePath`:

```javascript
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

Then set `NEXT_PUBLIC_BASE_PATH` in your workflow:

```yaml
- name: Build with Next.js
  env:
    NODE_ENV: production
    NEXT_PUBLIC_BASE_PATH: /repository-name
  run: npm run build
```

However, using `actions/configure-pages@v5` is the recommended approach as it handles all edge cases automatically.

