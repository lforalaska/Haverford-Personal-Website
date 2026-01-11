# Personal Writing Website

A modern, mobile-first personal website for publishing weekly essays. Built with Next.js, TypeScript, Tailwind CSS, and Markdown.

## Features

- **Weekly Essay Publishing**: Write essays in Markdown with frontmatter
- **Mobile-First Design**: Optimized reading experience on all devices
- **Multiple Discovery Mechanisms**:
  - Homepage with chronological essay list
  - Tag-based browsing
  - Full-text search with FlexSearch
- **User-Friendly URLs**: Clean slugs like `/essays/my-essay-title`
- **Static Site Generation**: Zero server costs, deploy anywhere
- **Fast Search**: Client-side search with build-time indexing

## Prerequisites

**Important**: This project requires Node.js >= 20.9.0. Your current version is 18.20.3.

To upgrade Node.js:
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Or download from nodejs.org
# https://nodejs.org/
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your site.

3. **Build for production**:
   ```bash
   npm run build
   ```

   The static site will be exported to the `/out` directory.

## Writing Essays

### Create a New Essay

1. Create a new `.md` file in `content/essays/`:
   ```bash
   touch content/essays/my-new-essay.md
   ```

2. Use the template structure:
   ```markdown
   ---
   title: "Your Essay Title"
   date: "2026-01-11"
   slug: "your-essay-title"
   tags: ["tag1", "tag2"]
   excerpt: "A brief summary (150-200 characters)"
   draft: false
   ---

   Your essay content here...
   ```

3. Preview locally:
   ```bash
   npm run dev
   ```

4. When ready to publish, set `draft: false` and commit.

### Essay Frontmatter Fields

- **title**: Essay title (required)
- **date**: Publication date in YYYY-MM-DD format (required)
- **slug**: URL slug for the essay (required, should match filename)
- **tags**: Array of topic tags for categorization (required)
- **excerpt**: Brief summary shown in previews and search (required)
- **draft**: Set to `true` to hide from production build (optional)

### Markdown Features

Your essays support:
- Headings, paragraphs, lists
- **Bold**, *italic*, and other formatting
- [Links](https://example.com)
- Code blocks with syntax highlighting
- Images (place in `/public/images/`)
- GitHub Flavored Markdown (tables, strikethrough, etc.)

## Project Structure

```
Haverford-Personal-Website/
├── src/
│   ├── app/                # Next.js pages
│   │   ├── page.tsx       # Homepage
│   │   ├── essays/        # Essay pages
│   │   ├── tags/          # Tag pages
│   │   └── search/        # Search page
│   ├── components/        # React components
│   ├── lib/              # Core logic
│   └── types/            # TypeScript types
├── content/
│   └── essays/           # Your markdown essays
├── public/               # Static assets
└── scripts/              # Build scripts
```

## Deployment

This site exports as static HTML and can be deployed anywhere:

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Deploy automatically on every push

### GitHub Pages

```bash
npm run build
# Deploy the /out directory to gh-pages branch
```

### Netlify

```bash
npm run build
# Drag and drop the /out directory
```

### Any Static Host

After running `npm run build`, upload the `/out` directory to any static hosting provider.

## Weekly Publishing Workflow

1. **Write** your essay in `content/essays/` with `draft: true`
2. **Preview** locally with `npm run dev`
3. **Finalize** by setting `draft: false`
4. **Commit** and push to trigger deployment
5. **Verify** the live site

## Customization

### Update Site Metadata

Edit `src/app/layout.tsx` to update:
- Site title and description
- Author name
- OpenGraph and Twitter metadata
- Domain URL

### Styling

The site uses Tailwind CSS. Customize:
- Colors and typography: `tailwind.config.ts`
- Global styles: `src/app/globals.css`
- Component styles: Update className props in components

### Search Configuration

Search is powered by FlexSearch with build-time indexing. Configuration in:
- Index generation: `scripts/generate-search-index.ts`
- Search settings: `src/lib/search.ts`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server (after build)
- `npm run lint` - Run ESLint
- `npm run generate-search-index` - Generate search index (runs automatically during build)

## Sample Essays

The project includes three sample essays to demonstrate features:
1. **Welcome to My Essays** - Introduction
2. **The Power of Weekly Habits** - On building sustainable practices
3. **Tools for Thinking** - About software and thought processes

Feel free to delete or replace these with your own content.

## Troubleshooting

### Build fails with Node.js version error

Upgrade to Node.js >= 20.9.0 (see Prerequisites section above).

### Search not working

Make sure the search index is generated:
```bash
npm run generate-search-index
```

The index should appear at `public/search-index.json`.

### Essays not appearing

1. Check that the file is in `content/essays/`
2. Ensure frontmatter is valid YAML
3. If in production, make sure `draft: false`

## Tech Stack

- **Framework**: Next.js 16 (React 19, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Typography plugin
- **Content**: Markdown + gray-matter
- **Markdown Processing**: unified + remark + rehype
- **Search**: FlexSearch
- **Syntax Highlighting**: Shiki via rehype-pretty-code

## License

MIT