# FandomHub - Core Game Mechanics & Architecture

## 1. Global Systems & State Management
* **PlayerContext (Global Economy):** Manages "Tickets" as a global state across the entire application. Every correct answer in the mini-games triggers the `addTickets()` function from the context, ensuring seamless cross-game progression. This state is also used to validate unlocking VIP content once the user reaches the required ticket threshold.
* **Smart Game Suggestions (`GameSuggestions.jsx`):** A global navigation component utilizing React Router's `useLocation` hook. It automatically filters out the currently active game path (preventing self-referential suggestions) and hides VIP games if the user account lacks the necessary unlock flag (`currentUser.vipUnlocked`).

## 2. Otaku Eye (Anime Synopsis Guesser)
* **Data Source:** Loads data locally from a static JSON dataset (`animeDB.js`).
* **Gameplay Loop:** Randomly selects 1 target anime and 3 dummy options, shuffling them into a grid. The player must guess the correct title based solely on the provided synopsis.
* **Dynamic Scoring:** The starting prize pool is 20 tickets. Each incorrect guess applies a 5-ticket penalty (with a minimum payout floor of 5 tickets).
* **UI/UX States:** 
  * Incorrect Guess: The button receives `opacity-50`, a `line-through` text decoration, and a `cursor-not-allowed` pointer.
  * Correct Guess: Incorrect options are locked, the correct option turns green, and the actual anime poster is revealed with a CSS fade-in animation alongside the "Next Anime" action button.

## 3. ShadowDex (Pokemon Silhouette)
* **API Integration:** Connects to the external PokeAPI. The initial fetch (`useEffect`) loads all 151 names from Generation 1 to populate the autocomplete array. A subsequent fetch pulls high-res artwork (`official-artwork`) based on a randomized ID (1-151).
* **Dynamic Visual Progression:** The image utilizes a dual-layer approach. The silhouette effect is achieved via the `brightness-0` CSS class. The target starts heavily zoomed in (scale 2.5) with a randomized `transformOrigin` offset. For every incorrect guess, the scale is dynamically reduced by 0.5, creating a "zoom out" effect that gradually reveals more visual context to the player.
* **Auto-Select Input:** The text input features live filtering. An auto-submit UX was implemented: if a player partially types a name, opens the suggestion dropdown, and presses "Enter", the application forces the selection of index `[0]` and immediately validates the guess.
* **Scoring:** Starts at 10 tickets. Each wrong guess subtracts 2 tickets (minimum payout of 2 tickets). 

## 4. BrainGlitch (Pop-Culture Trivia)
* **Data Handling & API Limits:** Integrates with the OpenTDB API, filtered specifically for pop-culture and anime categories (e.g., 11, 15, 31). To respect API rate limits (Response Code 429), a custom `fetchWithRetry` logic is implemented. Instead of fetching single questions, it pulls batches of 10 into a state queue (`questionsQueue`). The game asynchronously loads the next level from memory, preventing consecutive external API calls.
* **Difficulty-Based Scoring:** The API returns a difficulty rating. Hard = 30 points, Medium = 20 points, Easy = 10 points. Incorrect guesses apply a penalty equal to 1/3 of the base points.
* **String Decoding:** Features a `decodeHTML` helper function that processes the OpenTDB response through a virtual `<textarea>` to convert HTML entities (like `&quot;`, `&#039;`) into standard text characters.

## 5. VIP Blur Reveal
* **Progressive Reveal Logic:** The target poster is displayed using a dynamic inline CSS style: `filter: blur(${blurLevel}px)`. It initiates at a blur level of 25px. Each incorrect guess triggers `setBlurLevel(prev => prev - 5)`, fully unblurring the image (0px) after 5 failed attempts.
* **Risk vs Reward System:** Scoring is directly tied to the current difficulty level (`reward = blurLevel * 10`). A correct guess at the initial 25px blur yields 250 tickets, whereas guessing at 5px yields only 50 tickets.
* **Anti-Cheat Loading State:** Introduces an `isImageLoaded` state bound to the `onLoad` event of the `<img>` tag. While the image is fetching asynchronously, the input field is strictly disabled and covered by a loading spinner, preventing players from blind-guessing before the initial blurred frame is rendered.