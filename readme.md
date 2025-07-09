🧩 Project Plan: Kid’s Mini-Game Web App
🎯 Goal
Create a browser-based web app with simple, visual, offline-capable mini-games for a nearly 5-year-old child. The app must be fully usable without reading skills—interaction should rely on intuitive symbols, icons, and visual feedback. No accounts, logins, or external storage needed. All data is saved locally on the device.

🔧 Tech Stack
Framework: React + TypeScript + Vite

Graphics & Interactions: React Konva (Canvas-based)

Styling: Tailwind CSS

Persistence: localStorage for saving avatar and game progress

Routing: Internal game state management via useReducer (no external router)

🧱 Core Architecture
App Layout: Full-screen responsive UI with large icon-based navigation

Main Menu: Simple layout with 4 large buttons (each with an icon):

Character Creator

Maze Game

Coloring Book

Detective Game

State Management: Game state handled in a global context using useReducer. localStorage used for persist/restore.

🎭 Character Creator
Goal: Let the child assemble a character using a catalog of body parts.

Interface: Visual grid of selectable parts (feet, torso, eyes, ears, etc.), each with large click areas.

Canvas Use: Konva to overlay the parts into a full character on a preview area.

Save State: Selected parts are stored to localStorage and reused in other games.

🌀 Maze Game
Goal: Navigate a simple maze to reach a goal flag.

Control: Use arrow keys or on-screen arrow buttons.

Design: Hardcoded mazes as 2D grids, rendered in Konva with walls and a movable character.

Difficulty: Visual clarity prioritized—short paths, no dead ends at first.

Feedback: Audio/visual cue when goal is reached.

🎨 Coloring Book
Goal: Click-to-fill areas with the correct color based on a number shown in the area.

Design: SVG-based scenes (e.g., a child flying a kite).

Interaction:

A palette of numbered colors (1–7) shown visually.

Areas on the scene have large visible numbers.

Child clicks a color, then clicks on an area to apply it.

Visual Support: Use shape icons or color-coded tools so that number knowledge is optional.

Save State: Colored areas saved in localStorage.

🕵️ Detective Game
Goal: Find a hidden object in a room scene (e.g., "Find the sunglasses").

Design: A room with several visually distinct items (lamp, chair, rug, etc.).

Interaction:

Child clicks around the room to look for the item.

When the correct spot is clicked, visual highlight and animation play.

UI: No text clues—only a large image of the object to be found shown at the top.

Future Variation: Optionally increase difficulty with multiple hidden items or limited hints.

🎁 Extra Features (Optional Later)
PWA support for full offline usage and installable shortcut.

Sound effects for interaction feedback (e.g. success chime, click sounds).

Animated transitions between scenes using Konva or CSS.
