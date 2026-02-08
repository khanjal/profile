# Resume Site - Justin Harding

A modern, interactive resume/portfolio website built with Angular and Tailwind CSS, featuring dynamic skill filtering and a sleek dark theme.

## 🌟 Features

- **Interactive Skills Section** - Click any skill to filter relevant work experiences
- **Dynamic Years Calculation** - Automatically calculates years of experience per skill from job history
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Theme** - Professional dark mode with cyan accent colors and gradient effects
- **Timeline Experience View** - Clean chronological display of work history
- **Profile Integration** - Professional photo with gradient border effects
- **Smooth Animations** - Hover effects, transitions, and opacity changes for better UX

## 🛠️ Tech Stack

- **Framework**: Angular 19 with SSR (Server-Side Rendering)
- **Styling**: Tailwind CSS with custom configuration
- **TypeScript**: Strongly typed for better code quality
- **Standalone Components**: Modern Angular architecture
- **SCSS**: For additional styling flexibility

## 📋 Skills Showcased

The site demonstrates proficiency in:
- Modern JavaScript/TypeScript development
- Angular framework and reactive patterns
- Responsive design with Tailwind CSS
- Git version control
- Component-based architecture

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
# Run development server
npm start
# or
ng serve

# Navigate to http://localhost:4200/
```

### Build

```bash
# Production build
npm run build

# The build artifacts will be stored in the `dist/` directory
```

## 🌐 Deployment

### GitHub Pages

Yes! This site can be hosted on GitHub Pages. Since this is an Angular SSR app, you'll want to use the static build:

**Option 1: Manual Deployment**

```bash
# Build for production (browser only)
ng build --configuration production

# The output will be in dist/profile/browser/
# Deploy the contents of this folder to GitHub Pages
```

**Option 2: Using angular-cli-ghpages**

```bash
# Install the package
npm install -g angular-cli-ghpages

# Build and deploy
ng build --configuration production --base-href "https://YOUR_USERNAME.github.io/REPO_NAME/"
npx angular-cli-ghpages --dir=dist/profile/browser
```

**Option 3: GitHub Actions (Automated)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build -- --base-href "https://YOUR_USERNAME.github.io/REPO_NAME/"
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/profile/browser
```

### Other Hosting Options

- **AWS Amplify** - Supports SSR, great for full Angular features
- **Vercel** - Excellent Angular support with zero config
- **Netlify** - Simple deployment with drag-and-drop
- **AWS S3 + CloudFront** - Scalable static hosting

## 📁 Project Structure

```
profile/
├── src/
│   ├── app/
│   │   ├── home/           # Main page with skills & experience
│   │   ├── header/         # Navigation header
│   │   ├── footer/         # Footer component
│   │   ├── projects/       # Projects section
│   │   ├── about/          # About section
│   │   └── contact/        # Contact section
│   ├── styles.scss         # Global styles
│   └── index.html
├── public/
│   └── profile.jpg         # Profile image
├── tailwind.config.js      # Tailwind configuration
└── angular.json            # Angular configuration
```

## 🎨 Customization

### Update Personal Information

1. **Profile Image**: Replace `public/profile.jpg`
2. **Experience Data**: Edit the `experiences` array in `src/app/home/home.component.ts`
3. **Colors**: Modify `tailwind.config.js` theme colors
4. **Content**: Update component HTML templates

### Adding New Skills

Skills are auto-calculated from the `experiences` array. Just add the skill name to the relevant experience's `skills` array.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and customize it for your own resume site!

---

**Built with ❤️ using Angular and Tailwind CSS**
