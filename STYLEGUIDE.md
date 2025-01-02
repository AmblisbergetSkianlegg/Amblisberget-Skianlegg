# Amblisberget-Skianlegg Website Styling Guide

This guide explains how to customize the look and feel of your website. Many styling changes can be made by editing values in the `src/styles/variables.css` file. Think of these variables as a control panel for your website's appearance.

## Quick Start

To make changes to the website's appearance:
1. Open the `src/styles/variables.css` file
2. Find the section you want to modify (colors, text sizes, spacing)
3. Change the values as needed
4. Save the file to see your changes

## Colors

### How to Change Colors

Colors are defined using RGB values (Red, Green, Blue). You can use any color picker tool to get these values.

```css
/* Original blue color */
--color-primary: 28 61 90;

/* Change to a dark green */
--color-primary: 0 100 60;
```

### Common Color Changes

1. **Main Brand Color**
   ```css
   --color-primary: 28 61 90;     /* Main blue color */
   --color-primary-hover: 44 90 143; /* Lighter blue for hover effects */
   ```
   This affects:
   - Header background
   - Buttons
   - Interactive elements

2. **Background Color**
   ```css
   --color-secondary: 232 240 247; /* Light blue-grey */
   ```
   This affects:
   - Page background
   - Content areas

3. **Highlight Color**
   ```css
   --color-accent: 255 77 77;      /* Bright red */
   ```
   This affects:
   - Important notifications
   - Error messages
   - Attention-grabbing elements

## Text Styling

### Font Sizes

Text sizes are defined in relative units (rem). Larger numbers mean bigger text.

```css
/* Change heading size from 1.5rem to 2rem to make it larger */
--font-size-2xl: 2rem;     /* Main headings */
--font-size-xl: 1.25rem;   /* Subheadings */
--font-size-base: 1rem;    /* Normal text */
```

Common use cases:
- `--font-size-2xl`: Main headings
- `--font-size-base`: Regular text
- `--font-size-sm`: Small text and labels

### Font Family

To change the website's font:
```css
/* Current font */
--font-family-primary: "Noto Sans", sans-serif;

/* Example: Change to Arial */
--font-family-primary: Arial, sans-serif;
```

## Spacing and Layout

### Header Size

Adjust the height of the header for different screen sizes:
```css
--spacing-header: 3.75rem;         /* Desktop header height */
--spacing-header-tablet: 3.125rem; /* Tablet header height */
--spacing-header-mobile: 2.8125rem; /* Mobile header height */
```

### General Spacing

Control the space between elements:
```css
--spacing-4: 1rem;  /* Normal spacing */
--spacing-8: 2rem;  /* Larger spacing */
```

## Visual Effects

### Shadows

Make elements appear raised or flat:
```css
/* Subtle shadow */
--shadow-sm: 0 0.125rem 0.25rem rgb(var(--color-black) / 0.1);

/* More pronounced shadow */
--shadow-md: 0 0.125rem 0.5rem rgb(var(--color-black) / 0.15);
```

### Animations

Control how fast elements animate:
```css
--transition-duration-fast: 150ms;    /* Quick animations */
--transition-duration-normal: 250ms;  /* Standard animations */
```

## Map Controls

Adjust the size and spacing of map controls:
```css
--map-control-size: 2.25rem;     /* Size of map buttons */
--map-control-spacing: 1rem;     /* Space between controls */
```

### Responsive Design

The website automatically adjusts for different screen sizes:
- Desktop: > 1024px (64em)
- Mobile: ≤ 480px (30em)

Each screen size can have different settings for:
- Header height
- Text sizes
- Spacing between elements

## Examples of Common Changes

### 1. Brand Color Update
To change the main color scheme:
```css
/* Before: Blue theme */
--color-primary: 28 61 90;      /* Dark blue */
--color-primary-hover: 44 90 143; /* Light blue */

/* After: Green theme */
--color-primary: 0 100 60;      /* Dark green */
--color-primary-hover: 0 120 70; /* Light green */
```

### 2. Larger Text
To make all text bigger:
```css
/* Before */
--font-size-base: 1rem;
--font-size-lg: 1.125rem;

/* After */
--font-size-base: 1.125rem;
--font-size-lg: 1.25rem;
```

### 3. Compact Layout
To reduce spacing throughout the site:
```css
/* Before */
--spacing-4: 1rem;
--spacing-8: 2rem;

/* After */
--spacing-4: 0.75rem;
--spacing-8: 1.5rem;
```

## Need Help?

If you're unsure about making changes:
1. Make one change at a time
2. Save the file and check the result
3. If something goes wrong, undo the change
4. Keep track of the original values in case you need to revert

Remember: All measurements using `rem` are relative to the base font size. A value of `1rem` equals 16 pixels by default.
