/* ============================================
   TABLE OF CONTENTS
   ============================================
   
   1. CONSTANTS & CONFIGURATION
      - Animation timing
      - Size multipliers
      - CSS selectors
   
   2. UTILITY FUNCTIONS
      - calculateEntryPoint
      - calculateRippleSize
      - setRipplePosition
   
   3. RIPPLE EFFECT SYSTEM
      - createRipple
      - removeExistingRipple
      - attachRippleToElement
   
   4. EVENT HANDLERS
      - handleMouseEnter
      - handleMouseLeave
   
   5. RIPPLE INITIALIZATION
      - initializeRippleEffects
      - initializeWhenReady
   
   6. TAROT CARD FLIP SYSTEM
      - initializeTarotCards
      - flipCard
      - initializeTarotWhenReady
   
   Note: This module uses IIFE pattern for encapsulation
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // 1. CONSTANTS & CONFIGURATION
    // ============================================

    /**
     * Configuration object for ripple effect behavior
     * @constant {Object}
     */
    const CONFIG = {
        // Animation timing in milliseconds
        RIPPLE_DURATION: 700,
        
        // Size multiplier for ripple diameter
        SIZE_MULTIPLIER: 2.2,
        
        // Push direction multiplier
        PUSH_MULTIPLIER: 1.0,
        
        // CSS classes
        CLASSES: {
            RIPPLE: 'ripple',
            CONTAINER: 'ripple-container'
        },
        
        // Target selectors for ripple effect
        SELECTORS: '.nav-item a, .article, .article-image, .tag, .portfolio-card'
    };

    /**
     * Edge constants for determining entry point
     * @constant {Object}
     */
    const EDGES = {
        LEFT: 'left',
        RIGHT: 'right',
        TOP: 'top',
        BOTTOM: 'bottom'
    };

    // ============================================
    // 2. UTILITY FUNCTIONS
    // ============================================

    /**
     * Calculates the entry point and push direction based on cursor position
     * @param {DOMRect} rect - The bounding rectangle of the element
     * @param {number} mouseX - Mouse X position relative to element
     * @param {number} mouseY - Mouse Y position relative to element
     * @returns {Object} Entry point coordinates and push direction
     */
    function calculateEntryPoint(rect, mouseX, mouseY) {
        try {
            const distances = {
                [EDGES.LEFT]: mouseX,
                [EDGES.RIGHT]: rect.width - mouseX,
                [EDGES.TOP]: mouseY,
                [EDGES.BOTTOM]: rect.height - mouseY
            };

            const minDistance = Math.min(...Object.values(distances));
            const entryEdge = Object.keys(distances).find(key => distances[key] === minDistance);

            const entryPoints = {
                [EDGES.LEFT]: { x: 0, y: mouseY, pushX: rect.width, pushY: 0 },
                [EDGES.RIGHT]: { x: rect.width, y: mouseY, pushX: -rect.width, pushY: 0 },
                [EDGES.TOP]: { x: mouseX, y: 0, pushX: 0, pushY: rect.height },
                [EDGES.BOTTOM]: { x: mouseX, y: rect.height, pushX: 0, pushY: -rect.height }
            };

            return entryPoints[entryEdge];
        } catch (error) {
            console.error('Error calculating entry point:', error);
            // Fallback to center position
            return {
                x: rect.width / 2,
                y: rect.height / 2,
                pushX: 0,
                pushY: 0
            };
        }
    }

    /**
     * Calculates the ripple size to cover the entire element
     * @param {DOMRect} rect - The bounding rectangle of the element
     * @param {number} entryX - Entry point X coordinate
     * @param {number} entryY - Entry point Y coordinate
     * @returns {number} The diameter of the ripple
     */
    function calculateRippleSize(rect, entryX, entryY) {
        try {
            const corners = [
                { x: 0, y: 0 },
                { x: rect.width, y: 0 },
                { x: 0, y: rect.height },
                { x: rect.width, y: rect.height }
            ];

            const maxDistance = Math.sqrt(
                Math.max(...corners.map(corner => 
                    Math.pow(corner.x - entryX, 2) + Math.pow(corner.y - entryY, 2)
                ))
            );

            return maxDistance * CONFIG.SIZE_MULTIPLIER;
        } catch (error) {
            console.error('Error calculating ripple size:', error);
            // Fallback to element diagonal
            return Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2));
        }
    }

    /**
     * Sets the position and custom properties for the ripple element
     * @param {HTMLElement} ripple - The ripple element
     * @param {number} entryX - Entry point X coordinate
     * @param {number} entryY - Entry point Y coordinate
     * @param {number} size - Ripple diameter
     * @param {number} pushX - Push direction X
     * @param {number} pushY - Push direction Y
     */
    function setRipplePosition(ripple, entryX, entryY, size, pushX, pushY) {
        try {
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${entryX - size / 2}px`;
            ripple.style.top = `${entryY - size / 2}px`;
            ripple.style.setProperty('--push-x', `${pushX * CONFIG.PUSH_MULTIPLIER}px`);
            ripple.style.setProperty('--push-y', `${pushY * CONFIG.PUSH_MULTIPLIER}px`);
        } catch (error) {
            console.error('Error setting ripple position:', error);
        }
    }

    // ============================================
    // 3. RIPPLE EFFECT SYSTEM
    // ============================================

    /**
     * Removes any existing ripple from an element
     * @param {HTMLElement} element - The element to remove ripple from
     */
    function removeExistingRipple(element) {
        try {
            const existingRipple = element.querySelector(`.${CONFIG.CLASSES.RIPPLE}`);
            if (existingRipple) {
                existingRipple.remove();
            }
        } catch (error) {
            console.error('Error removing existing ripple:', error);
        }
    }

    /**
     * Creates and attaches a ripple effect element at the boundary entry point
     * @param {MouseEvent} e - The mouse event
     * @param {HTMLElement} element - The element to add ripple to
     */
    function createRipple(e, element) {
        try {
            // Remove any existing ripples
            removeExistingRipple(element);

            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add(CONFIG.CLASSES.RIPPLE);

            // Get element position and dimensions
            const rect = element.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate entry point and push direction
            const { x: entryX, y: entryY, pushX, pushY } = calculateEntryPoint(rect, mouseX, mouseY);

            // Calculate ripple size
            const size = calculateRippleSize(rect, entryX, entryY);

            // Set ripple position and properties
            setRipplePosition(ripple, entryX, entryY, size, pushX, pushY);

            // Attach ripple to element
            attachRippleToElement(element, ripple);
        } catch (error) {
            console.error('Error creating ripple:', error);
        }
    }

    /**
     * Attaches the ripple element to the target and schedules its removal
     * @param {HTMLElement} element - The target element
     * @param {HTMLElement} ripple - The ripple element
     */
    function attachRippleToElement(element, ripple) {
        try {
            element.appendChild(ripple);

            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, CONFIG.RIPPLE_DURATION);
            });
        } catch (error) {
            console.error('Error attaching ripple to element:', error);
        }
    }

    // ============================================
    // 4. EVENT HANDLERS
    // ============================================

    /**
     * Handles mouse enter event for ripple effect
     * @param {MouseEvent} e - The mouse event
     * @param {HTMLElement} element - The target element
     * @param {Object} state - State object to track hover status
     */
    function handleMouseEnter(e, element, state) {
        if (!state.isHovering) {
            state.isHovering = true;
            createRipple(e, element);
        }
    }

    /**
     * Handles mouse leave event for ripple cleanup
     * @param {HTMLElement} element - The target element
     * @param {Object} state - State object to track hover status
     */
    function handleMouseLeave(element, state) {
        state.isHovering = false;
        removeExistingRipple(element);
    }

    // ============================================
    // 5. RIPPLE INITIALIZATION
    // ============================================

    /**
     * Initialize ripple effects on all target elements
     * @throws {Error} If initialization fails
     */
    function initializeRippleEffects() {
        try {
            const rippleElements = document.querySelectorAll(CONFIG.SELECTORS);

            if (rippleElements.length === 0) {
                console.warn('No elements found for ripple effect');
                return;
            }

            rippleElements.forEach(element => {
                // Add ripple-container class for positioning context
                element.classList.add(CONFIG.CLASSES.CONTAINER);

                // Create state object to track hover status
                const state = { isHovering: false };

                // Add event listeners
                element.addEventListener('mouseenter', (e) => handleMouseEnter(e, element, state));
                element.addEventListener('mouseleave', () => handleMouseLeave(element, state));
            });

            console.log(`Ripple effects initialized on ${rippleElements.length} elements`);
        } catch (error) {
            console.error('Failed to initialize ripple effects:', error);
        }
    }

    /**
     * DOM ready handler - initializes ripple effects when DOM is ready
     */
    function initializeWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeRippleEffects);
        } else {
            initializeRippleEffects();
        }
    }

    // Start ripple effect initialization
    initializeWhenReady();

    // ============================================
    // 6. TAROT CARD FLIP SYSTEM
    // ============================================
    
    /**
     * Initialize tarot card flip functionality for featured articles
     * Cards display minimal info on front, full content on back
     * Flip animation triggered by click or keyboard (Enter/Space)
     * Cards remain flipped until browser refresh
     */
    function initializeTarotCards() {
        const tarotCards = document.querySelectorAll('.tarot-card');
        
        tarotCards.forEach(card => {
            const cardId = card.getAttribute('data-card-id');
            
            // Add click event listener
            card.addEventListener('click', function(e) {
                // Prevent flip if clicking on interactive elements
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                    return;
                }
                
                flipCard(card, cardId);
            });
            
            // Add keyboard support (Enter and Space keys)
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    flipCard(card, cardId);
                }
            });
        });
    }
    
    /**
     * Flip a tarot card with width-shrinking animation
     * Process: Shrink width to 0%, swap content, expand width to 100%
     * @param {HTMLElement} card - The card element to flip
     * @param {string} cardId - The unique identifier for the card (currently unused but kept for future expansion)
     */
    function flipCard(card, cardId) {
        const isCurrentlyFlipped = card.classList.contains('flipped');
        
        if (!isCurrentlyFlipped) {
            // Flipping to back side
            // Step 1: Add animating class to shrink width to 0
            card.classList.add('animating');
            
            // Step 2: After shrinking, swap content and expand
            setTimeout(() => {
                card.classList.add('flipped');
                card.classList.remove('animating');
            }, 400); // Match the CSS transition duration
        }
        // Once flipped, card stays flipped until browser refresh
    }
    
    /**
     * Initialize tarot card functionality when DOM is fully loaded
     * Handles both DOMContentLoaded event and already-loaded state
     */
    function initializeTarotWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeTarotCards);
        } else {
            initializeTarotCards();
        }
    }
    
    // Initialize tarot card functionality
    initializeTarotWhenReady();

})();
