/* ============================================
   script.js
   Interactive JavaScript for OceanRiches site.
   Handles ripple effects, card flips, and modal interactions.
   ============================================

   TABLE OF CONTENTS:

   1. CONFIGURATION
      - Timing constants (animation durations, delays)
      - CSS class names for state management
      - DOM selectors for elements
      - Modal state tracking object

   2. HELPER UTILITIES
      - lockBodyScroll() - Prevents scroll, compensates for scrollbar
      - unlockBodyScroll() - Restores scroll capability
      - getModalParts() - Validates and returns modal DOM elements
      - isInteractiveTarget() - Checks if click target is interactive element

   3. RIPPLE EFFECT SYSTEM
      - removeExistingRipple() - Cleans up old ripples
      - calculateEntryPoint() - Finds where hover entered element
      - calculateRippleSize() - Computes ripple diameter to cover element
      - setRipplePosition() - Positions ripple with CSS custom properties
      - createRipple() - Main ripple creation logic
      - initializeRippleEffects() - Attaches hover listeners

   4. MODAL TRANSFORM CALCULATIONS
      - setModalFromCardTransform() - Calculates zoom animation coordinates

   5. MODAL OPEN/CLOSE SYSTEM
      - openFeaturedModalFromCard() - Animates card → modal zoom
      - closeFeaturedModalToCard() - Animates modal → card zoom
      - initializeFeaturedModal() - Sets up modal event listeners

   6. TAROT CARD FLIP SYSTEM
      - scheduleOpenFromFlip() - Delays modal open until flip completes
      - initializeTarotCards() - Attaches flip and open logic to cards

   7. HAMBURGER MENU
      - initializeHamburgerMenu() - Mobile navigation toggle

   8. INITIALIZATION
      - initializeAll() - Orchestrates all feature initialization
      - DOMContentLoaded handler

   ============================================ */

(function () {
  "use strict";

  // ============================================
  // 1) CONFIGURATION
  // ============================================
  // Central config object for easy tuning.
  // All timing and sizing constants in one place.
  const CONFIG = {
    // ===== RIPPLE EFFECT SETTINGS =====
    RIPPLE_DURATION: 900,      // Duration in ms (matches CSS animation)
    SIZE_MULTIPLIER: 2.2,      // Scale factor - ensures ripple covers entire element
    PUSH_MULTIPLIER: 1.0,      // Directional push strength (can reduce for subtler effect)
    RIPPLE_SELECTORS: ".nav-item a, .article, .tag",  // Elements that get ripple effects

    // ===== CSS CLASS NAMES =====
    // JavaScript toggles these classes; CSS handles visual changes.
    CLASSES: {
      RIPPLE: "ripple",              // Applied to ripple span element
      CONTAINER: "ripple-container", // Applied to elements that receive ripples
      FLIPPED: "flipped",            // Tarot card flipped state (front → back)
      NAV_ACTIVE: "active",          // Mobile nav menu expanded state
      MODAL_OPEN: "is-open",         // Modal visible state
      MODAL_OPENING: "is-opening",   // Triggers opening animation
      MODAL_CLOSING: "is-closing",   // Triggers closing animation
    },

    // ===== MODAL DOM SELECTORS =====
    MODAL_ID: "#featured-modal",              // Main modal overlay element
    MODAL_BODY_ID: "#featured-modal-body",    // Container for article content
    MODAL_CONTENT_SELECTOR: ".modal-content", // Animated content box
    MODAL_CLOSE_SELECTOR: ".modal-close",     // Close button

    // ===== RESPONSIVE BREAKPOINT =====
    MOBILE_BREAKPOINT: 768,  // Must match CSS breakpoint (mobile < 768px)

    // ===== TAROT FLIP TIMING =====
    FLIP_MS: 800,            // Matches .tarot-card-inner CSS transition (0.8s)
    FLIP_BUFFER_MS: 30,      // Small buffer to ensure flip completes before modal opens

    // ===== MODAL REOPEN PREVENTION =====
    REOPEN_GUARD_MS: 450,    // Ignore card clicks for this duration after modal closes
  };

  // ===== MODAL STATE TRACKER =====
  // Tracks modal state across functions to prevent race conditions.
  const modalState = {
    isOpen: false,              // Is modal currently visible?
    isAnimating: false,         // Is open/close animation in progress?
    lastFocusedElement: null,   // Element to restore focus to when closing
    lastCard: null,             // Reference to card that opened modal (for zoom back)
    openTimer: null,            // setTimeout ID for delayed modal open
    ignoreCardClicksUntil: 0,   // Timestamp to prevent immediate reopen
    savedTransform: null,       // Stored transform values from opening (for smooth close)
  };

  // ============================================
  // 2) HELPER UTILITIES
  // ============================================

  /**
   * Locks body scroll and compensates for scrollbar width.
   * Prevents layout shift when scrollbar disappears on modal open.
   * Calculates scrollbar width by comparing window vs document width.
   */
  function lockBodyScroll() {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
  }

  /**
   * Unlocks body scroll and removes scrollbar compensation.
   * Restores default overflow and padding values.
   */
  function unlockBodyScroll() {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  /**
   * Validates and retrieves all modal DOM elements.
   * Returns null if any required element is missing (fail-fast pattern).
   * 
   * @returns {Object|null} Object with modal parts or null if incomplete
   */
  function getModalParts() {
    const modal = document.querySelector(CONFIG.MODAL_ID);
    if (!modal) return null;

    const modalBody = modal.querySelector(CONFIG.MODAL_BODY_ID);
    const modalContent = modal.querySelector(CONFIG.MODAL_CONTENT_SELECTOR);
    const closeButton = modal.querySelector(CONFIG.MODAL_CLOSE_SELECTOR);

    if (!modalBody || !modalContent || !closeButton) return null;

    return { modal, modalBody, modalContent, closeButton };
  }

  /**
   * Checks if event target is an interactive element.
   * Prevents ripple/flip when clicking links, buttons, inputs, etc.
   * Uses .closest() to check entire ancestor chain.
   * 
   * @param {HTMLElement} target - Event target to check
   * @returns {boolean} True if target is/contains interactive element
   */
  function isInteractiveTarget(target) {
    if (!target) return false;
    return Boolean(
      target.closest("a") ||
        target.closest("button") ||
        target.closest(".tag") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select")
    );
  }

  // ============================================
  // 3) RIPPLE EFFECT SYSTEM
  // ============================================
  // Creates directional ripple effect from hover entry point.
  // Ripple "rolls" across element like a wave from entry edge.

  /**
   * Removes existing ripple if present.
   * Prevents multiple ripples stacking on quick re-hovers.
   */
  function removeExistingRipple(element) {
    const existing = element.querySelector(`.${CONFIG.CLASSES.RIPPLE}`);
    if (existing) existing.remove();
  }

  /**
   * Calculates which edge the mouse entered from and where.
   * 
   * ALGORITHM:
   * 1. Calculate distance from mouse to all 4 edges
   * 2. Find minimum distance (closest edge = entry edge)
   * 3. Return entry point coordinates and push direction
   * 
   * PUSH DIRECTION:
   * - Entry from left  → push right  (positive X)
   * - Entry from right → push left   (negative X)
   * - Entry from top   → push down   (positive Y)
   * - Entry from bottom→ push up     (negative Y)
   * 
   * This creates the "rolling wave" effect across the element.
   * 
   * @param {DOMRect} rect - Element bounding rectangle
   * @param {number} mouseX - Mouse X relative to element
   * @param {number} mouseY - Mouse Y relative to element
   * @returns {Object} Entry point {x, y, pushX, pushY}
   */
  function calculateEntryPoint(rect, mouseX, mouseY) {
    const distances = {
      left: mouseX,
      right: rect.width - mouseX,
      top: mouseY,
      bottom: rect.height - mouseY,
    };

    const minDistance = Math.min(distances.left, distances.right, distances.top, distances.bottom);
    const entryEdge = Object.keys(distances).find((k) => distances[k] === minDistance);

    const entryPoints = {
      left: { x: 0, y: mouseY, pushX: rect.width, pushY: 0 },
      right: { x: rect.width, y: mouseY, pushX: -rect.width, pushY: 0 },
      top: { x: mouseX, y: 0, pushX: 0, pushY: rect.height },
      bottom: { x: mouseX, y: rect.height, pushX: 0, pushY: -rect.height },
    };

    return entryPoints[entryEdge] || { x: rect.width / 2, y: rect.height / 2, pushX: 0, pushY: 0 };
  }

  /**
   * Calculates ripple size to ensure full element coverage.
   * 
   * ALGORITHM:
   * 1. Calculate distance from entry point to all 4 corners
   * 2. Use maximum distance (farthest corner)
   * 3. Multiply by SIZE_MULTIPLIER (2.2) for generous coverage
   * 
   * Using farthest corner ensures ripple covers entire element
   * regardless of where it starts.
   * 
   * @param {DOMRect} rect - Element bounding rectangle
   * @param {number} entryX - Ripple start X coordinate
   * @param {number} entryY - Ripple start Y coordinate
   * @returns {number} Ripple diameter in pixels
   */
  function calculateRippleSize(rect, entryX, entryY) {
    const corners = [
      { x: 0, y: 0 },
      { x: rect.width, y: 0 },
      { x: 0, y: rect.height },
      { x: rect.width, y: rect.height },
    ];
    const maxDistance = Math.max(...corners.map((c) => Math.hypot(c.x - entryX, c.y - entryY)));
    return maxDistance * CONFIG.SIZE_MULTIPLIER;
  }

  /**
   * Positions ripple element and sets CSS custom properties.
   * 
   * POSITIONING:
   * - Center ripple circle at entry point
   * - Uses absolute positioning with left/top
   * - Width/height create circular shape
   * 
   * CSS CUSTOM PROPERTIES:
   * - --push-x: Horizontal animation direction
   * - --push-y: Vertical animation direction
   * - Used by CSS @keyframes ripple animation
   * 
   * @param {HTMLElement} ripple - Ripple span element
   * @param {number} entryX - Entry X coordinate
   * @param {number} entryY - Entry Y coordinate
   * @param {number} size - Ripple diameter
   * @param {number} pushX - Horizontal push direction
   * @param {number} pushY - Vertical push direction
   */
  function setRipplePosition(ripple, entryX, entryY, size, pushX, pushY) {
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${entryX - size / 2}px`;
    ripple.style.top = `${entryY - size / 2}px`;
    ripple.style.setProperty("--push-x", `${pushX * CONFIG.PUSH_MULTIPLIER}px`);
    ripple.style.setProperty("--push-y", `${pushY * CONFIG.PUSH_MULTIPLIER}px`);
  }

  /**
   * Main ripple creation orchestrator.
   * 
   * FLOW:
   * 1. Remove any existing ripple (cleanup)
   * 2. Create new ripple span element
   * 3. Calculate mouse position relative to element
   * 4. Calculate entry point and push direction
   * 5. Calculate ripple size for full coverage
   * 6. Position ripple and set push direction
   * 7. Append to DOM (triggers CSS animation)
   * 8. Schedule cleanup after animation completes
   * 
   * @param {MouseEvent} e - Mouse event with clientX/Y
   * @param {HTMLElement} element - Target element for ripple
   */
  function createRipple(e, element) {
    removeExistingRipple(element);

    const ripple = document.createElement("span");
    ripple.classList.add(CONFIG.CLASSES.RIPPLE);

    const rect = element.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const { x: entryX, y: entryY, pushX, pushY } = calculateEntryPoint(rect, mouseX, mouseY);
    const size = calculateRippleSize(rect, entryX, entryY);

    setRipplePosition(ripple, entryX, entryY, size, pushX, pushY);

    element.appendChild(ripple);

    // Remove after animation finishes
    window.setTimeout(() => {
      if (ripple.parentNode) ripple.remove();
    }, CONFIG.RIPPLE_DURATION);
  }

  /**
   * Initializes ripple effects on all matching elements.
   * 
   * APPROACH:
   * - Uses hover enter/leave (not click) for ripples
   * - Tracks hover state to prevent duplicate ripples
   * - Removes ripple on mouse leave for clean transitions
   * 
   * HOVER STATE TRACKING:
   * - isHovering flag prevents multiple ripples on same hover
   * - Reset on mouseleave for next hover
   */
  function initializeRippleEffects() {
    const elements = document.querySelectorAll(CONFIG.RIPPLE_SELECTORS);
    if (!elements.length) return;

    elements.forEach((el) => {
      el.classList.add(CONFIG.CLASSES.CONTAINER);

      let isHovering = false;

      el.addEventListener("mouseenter", (e) => {
        if (isHovering) return;
        isHovering = true;
        createRipple(e, el);
      });

      el.addEventListener("mouseleave", () => {
        isHovering = false;
        removeExistingRipple(el);
      });
    });
  }

  // ============================================
  // 4) MODAL TRANSFORM CALCULATIONS
  // ============================================
  // Calculates CSS custom properties for card → modal zoom animation.
  // Modal "grows" from card position to center of screen.

  /**
   * Calculates transform coordinates for modal zoom animation.
   * 
   * COORDINATE SYSTEM:
   * - Modal starts "at" card position (--from-x, --from-y)
   * - Modal starts "as" card size (--from-scale)
   * - CSS animation interpolates from start → final position
   * 
   * CALCULATION:
   * 1. Get center points of both card and modal
   * 2. Calculate offset from modal center to card center
   * 3. Calculate scale ratio (card width / modal width)
   * 4. Clamp scale between 0.25 and 1.0 for safety
   * 5. Set CSS custom properties for animation
   * 
   * WHY CENTER POINTS:
   * - Ensures smooth zoom from card center to modal center
   * - Accounts for different aspect ratios
   * 
   * WHY RECALCULATE ON CLOSE:
   * - User may have scrolled while modal was open
   * - Card position changes with scroll
   * - Need fresh coordinates for zoom back to card
   * 
   * @param {HTMLElement} modalContent - Modal content box
   * @param {HTMLElement} card - Source tarot card
   */
  function setModalFromCardTransform(modalContent, card) {
    const cardRect = card.getBoundingClientRect();
    const modalRect = modalContent.getBoundingClientRect();

    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    const modalCenterX = modalRect.left + modalRect.width / 2;
    const modalCenterY = modalRect.top + modalRect.height / 2;

    const fromX = cardCenterX - modalCenterX;
    const fromY = cardCenterY - modalCenterY;

    const rawScale = cardRect.width / modalRect.width;
    const fromScale = Math.max(0.25, Math.min(1, rawScale));

    modalContent.style.setProperty("--from-x", `${fromX}px`);
    modalContent.style.setProperty("--from-y", `${fromY}px`);
    modalContent.style.setProperty("--from-scale", `${fromScale}`);
  }

  // ============================================
  // 5) MODAL OPEN/CLOSE SYSTEM
  // ============================================
  // Handles smooth card-to-modal zoom animations with accessibility.

  /**
   * Opens modal with zoom animation from card position.
   * 
   * ANIMATION FLOW:
   * 1. Validate modal elements and card back content
   * 2. Set animation state flags (prevents double-trigger)
   * 3. Copy card back content to modal
   * 4. Show modal (display: flex) so we can measure it
   * 5. Calculate transform coordinates from card position
   * 6. Force browser to commit initial transform (prevents snap)
   * 7. Add .is-opening class (triggers CSS animation)
   * 8. Listen for animationend to clean up
   * 9. Move focus to close button (accessibility)
   * 
   * FORCE LAYOUT COMMIT:
   * - `void modalContent.offsetWidth` forces reflow
   * - Ensures browser applies transform before animation class
   * - Without this, modal would "snap" instead of animating
   * 
   * ACCESSIBILITY:
   * - Saves focus position to restore later
   * - Locks body scroll (prevents background scrolling)
   * - Sets aria-hidden="false" for screen readers
   * - Moves focus to close button
   * 
   * @param {HTMLElement} card - Tarot card that triggered modal
   */
  function openFeaturedModalFromCard(card) {
    if (modalState.isOpen || modalState.isAnimating) return;

    const parts = getModalParts();
    if (!parts) return;

    const { modal, modalBody, modalContent, closeButton } = parts;

    const back = card.querySelector(".tarot-card-back");
    if (!back) return;

    modalState.isAnimating = true;
    modalState.lastFocusedElement = document.activeElement;
    modalState.lastCard = card;

    // Fill modal body
    modalBody.innerHTML = back.innerHTML;

    // Show modal (so we can measure)
    modal.classList.add(CONFIG.CLASSES.MODAL_OPEN);
    modal.setAttribute("aria-hidden", "false");
    lockBodyScroll();
    modalState.isOpen = true;

    requestAnimationFrame(() => {
      setModalFromCardTransform(modalContent, card);

      // Store transform values for smooth close animation
      modalState.savedTransform = {
        fromX: modalContent.style.getPropertyValue('--from-x'),
        fromY: modalContent.style.getPropertyValue('--from-y'),
        fromScale: modalContent.style.getPropertyValue('--from-scale')
      };

      // Force commit start transform before adding animation class (prevents snapping)
      void modalContent.offsetWidth;

      modal.classList.add(CONFIG.CLASSES.MODAL_OPENING);

      const onEnd = (e) => {
        if (e.target !== modalContent) return;

        modal.classList.remove(CONFIG.CLASSES.MODAL_OPENING);
        modalState.isAnimating = false;

        modalContent.removeEventListener("animationend", onEnd);
      };

      modalContent.addEventListener("animationend", onEnd);
      closeButton.focus();
    });
  }

  /**
   * Closes modal with zoom animation back to card position.
   * 
   * ANIMATION FLOW:
   * 1. Set reopen guard timestamp (prevents immediate reopen)
   * 2. Cancel any pending modal open (from flip delay)
   * 3. Recalculate transform for current scroll position
   * 4. Force browser to commit updated transform
   * 5. Add .is-closing class (triggers CSS reverse animation)
   * 6. Listen for animationend to complete cleanup
   * 7. Remove modal classes and restore scroll
   * 8. Restore focus to element that opened modal
   * 9. Flip card back to front (visual consistency)
   * 
   * WHY RECALCULATE TRANSFORM:
   * - User may have scrolled while modal was open
   * - Card position relative to viewport has changed
   * - Need accurate coordinates for smooth zoom back
   * 
   * REOPEN GUARD:
   * - Sets ignoreCardClicksUntil timestamp
   * - Prevents clicking card during close animation
   * - Avoids jarring reopen before close completes
   * 
   * @returns {void}
   */
  function closeFeaturedModalToCard() {
    if (!modalState.isOpen || modalState.isAnimating) return;

    modalState.ignoreCardClicksUntil = performance.now() + CONFIG.REOPEN_GUARD_MS;

    const parts = getModalParts();
    if (!parts) return;

    const { modal, modalContent } = parts;

    // Cancel any pending open
    if (modalState.openTimer) {
      clearTimeout(modalState.openTimer);
      modalState.openTimer = null;
    }

    modalState.isAnimating = true;

    // Remove opening class if still present to avoid conflicts
    modal.classList.remove(CONFIG.CLASSES.MODAL_OPENING);

    // Always get fresh transform from the front of the card (which remains at original position)
    // The card front is still there, just hidden by the flip
    if (modalState.lastCard) {
      const cardFront = modalState.lastCard.querySelector('.tarot-card-front');
      if (cardFront) {
        setModalFromCardTransform(modalContent, cardFront);
      } else if (modalState.savedTransform) {
        // Fallback to saved values
        modalContent.style.setProperty('--from-x', modalState.savedTransform.fromX);
        modalContent.style.setProperty('--from-y', modalState.savedTransform.fromY);
        modalContent.style.setProperty('--from-scale', modalState.savedTransform.fromScale);
      }
    }
    
    // Double RAF for smooth animation start
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add(CONFIG.CLASSES.MODAL_CLOSING);
      });
    });

    const onEnd = (e) => {
      if (e.target !== modalContent) return;

      // Remove the animation listener first
      modalContent.removeEventListener("animationend", onEnd);

      // Hide modal completely before removing classes to prevent flash
      modal.style.display = 'none';

      // Now safe to remove classes
      modal.classList.remove(CONFIG.CLASSES.MODAL_CLOSING);
      modal.classList.remove(CONFIG.CLASSES.MODAL_OPEN);
      modal.setAttribute("aria-hidden", "true");

      // Reset display in next frame
      requestAnimationFrame(() => {
        modal.style.display = '';
      });

      unlockBodyScroll();

      modalState.isOpen = false;
      modalState.isAnimating = false;

      // Keep card flipped after modal closes
      // Card remains in flipped state to show the back side

      if (modalState.lastFocusedElement) {
        modalState.lastFocusedElement.focus();
      }

      modalContent.removeEventListener("animationend", onEnd);
    };

    modalContent.addEventListener("animationend", onEnd);
  }

  /**
   * Sets up modal event listeners for user interactions.
   * 
   * EVENT HANDLERS:
   * 1. Close button click → close modal
   * 2. Backdrop click → close modal (UX pattern)
   * 3. ESC key → close modal (accessibility requirement)
   * 4. Content click → stop propagation (prevents backdrop close)
   * 
   * CLICK PROPAGATION:
   * - Backdrop click closes modal
   * - Content click stops propagation to backdrop
   * - Allows clicking/scrolling inside modal without closing
   */
  function initializeFeaturedModal() {
    const parts = getModalParts();
    if (!parts) return;

    const { modal, modalContent, closeButton } = parts;

    closeButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeFeaturedModalToCard();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeFeaturedModalToCard();
    });

    modalContent.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalState.isOpen) closeFeaturedModalToCard();
    });
  }

  // ============================================
  // 6) TAROT CARD FLIP SYSTEM
  // ============================================
  // Handles 3D card flip and delayed modal opening.

  /**
   * Schedules modal to open after flip animation completes.
   * 
   * TIMING:
   * - Card flip: 800ms (CONFIG.FLIP_MS)
   * - Buffer: 30ms (CONFIG.FLIP_BUFFER_MS)
   * - Total delay: 830ms
   * 
   * WHY DELAY:
   * - Allows flip animation to complete visually
   * - Prevents jarring overlap of flip + modal zoom
   * - Creates smooth two-stage interaction
   * 
   * CANCELLATION:
   * - Clears existing timer if called again
   * - Prevents multiple scheduled opens
   * 
   * @param {HTMLElement} card - Card to open modal from
   */
  function scheduleOpenFromFlip(card) {
    if (modalState.openTimer) clearTimeout(modalState.openTimer);

    modalState.openTimer = setTimeout(() => {
      modalState.openTimer = null;
      openFeaturedModalFromCard(card);
    }, CONFIG.FLIP_MS + CONFIG.FLIP_BUFFER_MS);
  }

  /**
   * Initializes flip and modal open logic for all tarot cards.
   * 
   * INTERACTION FLOW:
   * 1. User clicks/taps card
   * 2. Check if action should be ignored (guards)
   * 3. Toggle .flipped class (triggers CSS 3D flip)
   * 4. If flipping to back: schedule modal open
   * 5. If flipping to front: cancel scheduled modal open
   * 
   * GUARDS (prevent flip/open when):
   * - Click is within reopen guard period
   * - Click target is interactive element (link, button, etc.)
   * - Modal is already open or animating
   * 
   * KEYBOARD ACCESSIBILITY:
   * - Supports Enter and Space keys
   * - Prevents default to avoid page scroll on Space
   * 
   * FLIP TOGGLE:
   * - Returns true when flipping TO back (front → back)
   * - Returns false when flipping TO front (back → front)
   * - Only opens modal when flipping to back
   */
  function initializeTarotCards() {
    const cards = document.querySelectorAll(".tarot-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      const tryFlipAndOpen = (e) => {
        if (performance.now() < modalState.ignoreCardClicksUntil) return;
        if (isInteractiveTarget(e.target)) return;
        if (modalState.isOpen || modalState.isAnimating) return;

        // Flip and only open when flipping to the back
        const isNowFlipped = card.classList.toggle(CONFIG.CLASSES.FLIPPED);

        if (isNowFlipped) {
          scheduleOpenFromFlip(card);
        } else if (modalState.openTimer) {
          clearTimeout(modalState.openTimer);
          modalState.openTimer = null;
        }
      };

      card.addEventListener("click", tryFlipAndOpen);

      card.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        tryFlipAndOpen(e);
      });
    });
  }

  // ============================================
  // 7) HAMBURGER MENU
  // ============================================
  // Mobile navigation toggle with accessibility.

  /**
   * Initializes mobile hamburger menu functionality.
   * 
   * FEATURES:
   * - Toggle menu on hamburger button click
   * - Close menu when clicking outside (mobile only)
   * - Close menu on ESC key (mobile only)
   * - Close menu after clicking nav link (mobile only)
   * 
   * MOBILE-ONLY BEHAVIOR:
   * - Checks window width vs MOBILE_BREAKPOINT
   * - Prevents interference with desktop horizontal nav
   * 
   * ACCESSIBILITY:
   * - Updates aria-expanded attribute
   * - Restores focus to hamburger on ESC close
   * - Keyboard and mouse support
   */
  function initializeHamburgerMenu() {
    const hamburgerButton = document.querySelector(".hamburger-menu");
    const navMenu = document.querySelector(".nav-list");

    if (!hamburgerButton || !navMenu) return;

    hamburgerButton.addEventListener("click", () => {
      const isExpanded = hamburgerButton.getAttribute("aria-expanded") === "true";
      hamburgerButton.setAttribute("aria-expanded", String(!isExpanded));
      navMenu.classList.toggle(CONFIG.CLASSES.NAV_ACTIVE);
    });

    // Close when clicking outside (mobile only)
    document.addEventListener("click", (e) => {
      const isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
      if (!isMobile) return;

      if (!hamburgerButton.contains(e.target) && !navMenu.contains(e.target)) {
        if (navMenu.classList.contains(CONFIG.CLASSES.NAV_ACTIVE)) {
          hamburgerButton.setAttribute("aria-expanded", "false");
          navMenu.classList.remove(CONFIG.CLASSES.NAV_ACTIVE);
        }
      }
    });

    // ESC closes (mobile only)
    document.addEventListener("keydown", (e) => {
      const isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
      if (!isMobile) return;

      if (e.key === "Escape" && navMenu.classList.contains(CONFIG.CLASSES.NAV_ACTIVE)) {
        hamburgerButton.setAttribute("aria-expanded", "false");
        navMenu.classList.remove(CONFIG.CLASSES.NAV_ACTIVE);
        hamburgerButton.focus();
      }
    });

    // Clicking nav links closes menu (mobile only)
    navMenu.querySelectorAll(".nav-item a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < CONFIG.MOBILE_BREAKPOINT) {
          hamburgerButton.setAttribute("aria-expanded", "false");
          navMenu.classList.remove(CONFIG.CLASSES.NAV_ACTIVE);
        }
      });
    });
  }

  // ============================================
  // 8) INITIALIZATION
  // ============================================
  // Orchestrates initialization of all interactive features.

  /**
   * Master initialization function.
   * Calls all feature initialization functions in order.
   * 
   * ORDER:
   * 1. Ripple effects (non-blocking visual enhancement)
   * 2. Tarot cards (core interaction)
   * 3. Modal (depends on cards being initialized)
   * 4. Hamburger menu (independent feature)
   */
  function initializeAll() {
    initializeRippleEffects();
    initializeTarotCards();
    initializeFeaturedModal();
    initializeHamburgerMenu();
  }

  // ===== DOM READY HANDLER =====
  // Wait for DOM to be ready before initializing.
  // If already loaded (readyState !== "loading"), initialize immediately.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAll);
  } else {
    initializeAll();
  }
})();
