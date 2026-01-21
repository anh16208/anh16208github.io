# YOUWARE Project - Matrix Birthday Countdown

This project is a React-based "Happy Birthday" countdown website with a Matrix/Glitch theme, inspired by a user-provided video.

## Project Features

- **Matrix Rain Background**: A custom Canvas-based implementation of the classic digital rain effect.
- **Glitch Typography**: CSS-only glitch effects for text and countdown numbers.
- **Countdown Animation**: A 3-second countdown sequence using Framer Motion.
- **Responsive Design**: Works on desktop and mobile screens.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom CSS Animations
- **Animation**: Framer Motion

## Project Structure

- `src/components/MatrixRain.tsx`: The background effect component.
- `src/pages/BirthdayPage.tsx`: The main page logic (countdown + reveal).
- `src/index.css`: Contains the `@keyframes` for the glitch effects.

## Usage

The application starts with a countdown (3, 2, 1) and then reveals the "HAPPY BIRTHDAY" message with a "SYSTEM UNLOCKED" subtext.
