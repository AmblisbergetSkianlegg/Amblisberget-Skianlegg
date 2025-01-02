# Amblisberget Skianlegg

Website source code and assets for Amblisberget Skianlegg.

Website, maps and media created by [MjøsDrone](https://mjosdrone.no).


## Getting Started

This guide will help you set up and customize your website. Don't worry if you're not familiar with web development - we've made it easy to make common changes!

### Setting Up Your Development Environment

1. **Install Required Software**
   - Install [Node.js](https://nodejs.org/) (LTS version)
   - Install [Visual Studio Code](https://code.visualstudio.com/) (recommended editor)

2. **Extract and Open the Website**
   - Extract the website to a folder on your computer
   - Start Visual Studio Code
   - Go to `File > Open Folder` and select the extracted website folder

3. **Start the Development Server**
   - In Visual Studio Code, open the terminal by going to `View > Terminal` in the top menu
   - In the terminal that appears at the bottom, type these commands:
     ```bash
     npm install
     npm run dev
     ```
   - Wait for the installation to complete
   - The website will automatically open at `http://localhost:5173`. If it doesn't, open your browser and navigate to `http://localhost:5173`
   - Keep Visual Studio Code open while working on the website

## Website Structure

The website is organized into different sections that control specific aspects of its appearance and functionality:

### 1. Visual Styling (`src/styles/`)
- `variables.css`: Control colors, fonts, sizes, and spacing
- `map.css`: Customize map controls and appearance
- See our [Style Guide](./STYLEGUIDE.md) for detailed instructions

### 2. Content
- `index.html`: Main webpage structure
- `src/`: JavaScript and Style files
- `assets/`: Images and other media files
- `components/`: Reusable website parts

### 3. Map Configuration (`src/main.ts`)
- Map settings and layers
- Buttons and controls
- POIs and trails

## Making Common Changes

Here's where to look for different types of changes:

### Colors and Branding
📁 `src/styles/variables.css`
- Website colors
- Font sizes
- Spacing between elements
- See the Style Guide for step-by-step instructions

### Content Updates
📁 `src/index.html`
- Website text
- Links
- Basic structure

### Images and Media
📁 `src/assets/`
- Replace images by adding new files here
- Use the same filenames as the existing images
- Supported formats: JPG, PNG, SVG

## Development Workflow

1. **Making Changes**
   - Open the project in Visual Studio Code
   - Start the development server: `npm run dev`
   - Make your changes
   - The website will automatically update

2. **Testing Changes**
   - View the website at `http://localhost:5173`
   - Test on different devices using the browser's device simulation
   - Check all features work as expected

3. **Publishing Changes**
   - Save all your changes
   - Contact MjøsDrone for deployment assistance

## Need Help?

1. **Style Changes**
   - Refer to our [Style Guide](./STYLEGUIDE.md) for detailed instructions
   - Make one change at a time
   - Keep note of original values in case you need to revert

2. **Technical Support**
   - Contact MjøsDrone for assistance
   - We're here to help with any questions!

## License

This project is licensed under The Affero General Public License (AGPL3), see the LICENSE file for more details.

This project is tested with BrowserStack.