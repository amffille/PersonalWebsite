# Anshuman Mohapatra's Portfolio - README

## Overview

This portfolio is a dynamic and interactive webpage showcasing the skills, projects, and experience of Anshuman Mohapatra. It is built using HTML, CSS, and JavaScript, incorporating Three.js for 3D scene rendering and Tone.js for sound effects.

## Key Features

* **Interactive 3D Scene**: A Three.js powered scene with a plane model that the user can control.
* **Dynamic Content**: Information cards appear dynamically based on user interaction with the 3D scene.
* **Sound Effects**: Rich sound effects using Tone.js to enhance user experience.
* **Responsive Design**: Adapts to various screen sizes.
* **On-Screen Controls**: Provides an alternative way to control the scene on touch devices.
* **Game-like Interactions**: Engaging interactions such as shooting and breaking sections.

## Technical Details

### HTML (`index.html`)

* Sets up the structure of the webpage.
* Includes a canvas element for the 3D scene.
* Contains information cards that are displayed dynamically.
* Links CSS (`style.css`) and JavaScript (`script.js`).
* Uses Google Fonts  (`'Press Start 2P'`) for a retro gaming style.
* Includes the Tone.js library for sound.

### CSS (`style.css`)

* Provides styling for the layout, animations, and interactive elements.
* Key animations include:
    * `pulseInsane`: Green shadow effect.
    * `pulseRed`: Red pulse effect.
    * `shakeEffect`: Shake animation.
* Styles for info cards, buttons, and the 3D scene container.
* Media queries for responsive design, ensuring proper layout and appearance on different screen sizes.

### JavaScript (`script.js`)

* **Libraries**:
    * Three.js: For rendering the 3D scene.
    * Tone.js: For managing and playing sound effects.
* **Core Functionality**:
    * **Scene Setup**: Initializes the Three.js scene, camera, and lighting.
    * **3D Model**: Creates and controls a 3D plane model.
    * **User Interaction**: Handles user input to control the plane and shoot.
    * **Collision Detection**: Detects collisions between bullets and interactive sections.
    * **Dynamic Content Display**: Manages the display of information cards based on user interaction.
    * **Sound Effects**: Plays sound effects for various interactions.
    * **Responsive Design**: Adjusts the scene and elements on window resize.

## How to Use

1.  **View the 3D Scene**: Upon loading the page, a 3D scene is displayed in the  `#scene-container`  element.
2.  **Interact with Sections**: Hover over the interactive sections in the 3D scene to view corresponding information in the info cards.
3.  **Control the Plane**:
    * Use the arrow keys or WASD keys to move the plane.
    * Use the spacebar to shoot.
4.  **On-Screen Controls**: Use the on-screen buttons on touch devices to control movement and shooting.
5.  **Game End**: The game ends when all sections are broken. A final message is displayed, and the game can be reset by pressing the ESC key.

##  Explanation of the Code

### 1. HTML (`index.html`)

* The  `<head>`  element:
    * Sets the character set to UTF-8.
    * Configures the viewport for responsiveness and disables zooming.
    * Sets the title of the webpage.
    * Links the external CSS stylesheet and imports the  'Press Start 2P'  font from Google Fonts.
    * Includes the Tone.js library.
* The  `<body>`  element:
    * Contains a title, the  `#main-container`  which holds the 3D scene, info cards, instructions, and on-screen controls.
    * The  `<canvas>`  element with id  `c`  is used by Three.js to render the 3D scene.
    * Info cards are  `div`  elements with class  `info-card`, containing information about different sections of the portfolio.
    * On-screen controls are buttons for  up, down, left, right,  and  shoot actions.
    * The  `<script>`  tag at the end of the body is used to link the  `script.js`  file and defer its execution until the HTML parsing is complete.

### 2. CSS (`style.css`)

* Global styles:
    * Resets default body margins and sets a default font and background color.
* Animations:
    * Defines keyframe animations for pulsing effects and shaking.
* Layout styles:
    * Styles the main container, scene container, and info cards for positioning and appearance.
* Responsive design:
    * Uses media queries to adjust layout and font size for smaller screens.
* Styles for interactive elements:
    * Styles buttons, and applies hover and active effects.

### 3. JavaScript (`script.js`)

* **One-time Refresh Logic**:
    * Uses  `sessionStorage`  to ensure the page refreshes only once per session.
* **Basic Setup**:
    * Gets HTML elements, sets up the Three.js renderer, scene, and camera.
* **3D Scene**:
    * Creates a simple plane model using  `THREE.BoxGeometry`  and  `THREE.MeshLambertMaterial`.
* **Sound Effects**:
    * Initializes Tone.js and defines sound effects for various interactions.
* **Text Labels**:
    * The  `createLabelSprite`  function creates  `THREE.Sprite`  objects to display text labels in the 3D scene.
* **Portfolio Sections**:
    * Defines sections of the portfolio and creates 3D representations using  `THREE.CylinderGeometry`.
* **Shooting Mechanics**:
    * Implements shooting functionality.
* **Plane Controls**:
    * Handles plane movement using keyboard input.
* **Event Listeners**:
    * Listens for keyboard events to control plane movement and shooting.
    * Listens for clicks to start audio context.
* **Section Interaction State**:
    * Manages the state of selected sections and card visibility.
* **Animation Loop**:
    * The  `animate`  function updates the scene and handles user interactions.
* **Helper Functions**:
    * `getScreenPosition`: Calculates 2D screen coordinates from 3D world coordinates.
* **Window Resize Handling**:
    * Adjusts the camera and renderer when the window is resized.
* **Start**:
    * Initializes the scene, loads fonts, and starts the animation loop when the window loads.

