# FandomHub 🎮

A React-based gaming platform featuring multiple anime and pop-culture mini-games. Players can play games, earn tickets, and unlock exclusive VIP content.

## 🕹️ Mini-Games Included

* **Otaku Eye**: Guess the anime based on its synopsis. Features custom UI states and poster reveals.
* **ShadowDex (Pokemon Shadow)**: Guess the Pokemon from its silhouette. The image dynamically zooms out with every wrong guess. Uses the PokeAPI.
* **BrainGlitch**: A fast-paced pop-culture and anime trivia game fetching data from the OpenTDB API.
* **VIP Blur Reveal**: An unlockable VIP game where players guess the anime from a blurred poster that progressively unblurs upon wrong guesses. Features dynamic image loading states.

## ✨ Core Features

* **Global Economy**: A custom React Context (`PlayerContext`) manages the player's tickets across all games.
* **Smart Navigation**: A "PLAY NEXT" suggestion grid that dynamically filters out the current game and hides locked VIP games.
* **Auto-Select Mechanics**: Optimized input forms that auto-select the top search suggestion upon pressing Enter for fast-paced gameplay.
* **Arcade UI/UX**: Cyberpunk/Arcade aesthetics built entirely with Tailwind CSS, featuring custom animations, glowing borders, and dynamic backgrounds.

## 🛠️ Tech Stack

* React (via Vite)
* Tailwind CSS for styling
* Context API for state management
* React Router for navigation

## 🚀 How to Run Locally

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.