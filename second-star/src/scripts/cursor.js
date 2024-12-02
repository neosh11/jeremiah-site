// Debounce function
function debounce(fn, delay) {
    let timer = null;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    }
}

// Custom Cursor Implementation
var cursor = {
    delay: 8, // Higher value = more delay in outline movement
    _x: window.innerWidth / 2, // Current x position of the outline
    _y: window.innerHeight / 2, // Current y position of the outline
    endX: window.innerWidth / 2, // Target x position (mouse)
    endY: window.innerHeight / 2, // Target y position (mouse)
    cursorVisible: true,
    cursorEnlarged: false,
    $dot: document.querySelector('.cursor-dot'),
    $outline: document.querySelector('.cursor-dot-outline'),
    dotScale: 1, // Current scale of the dot
    outlineScale: 1, // Current scale of the outline
    animationFrameId: null, // To prevent multiple animation loops

    // Initialize the cursor
    init: function () {
        // Set initial positions
        this.updateDotTransform();
        this.updateOutlineTransform();

        // Setup event listeners
        this.setupEventListeners();

        // Start the animation loop for the outline
        this.animateDotOutline();
    },

    // Setup all necessary event listeners
    setupEventListeners: function () {
        var self = this;

        // Event delegation for anchor hover
        document.addEventListener('mouseover', function (e) {
            if (e.target.tagName.toLowerCase() === 'a') {
                self.cursorEnlarged = true;
                self.toggleCursorSize();
            }
        });

        document.addEventListener('mouseout', function (e) {
            if (e.target.tagName.toLowerCase() === 'a') {
                self.cursorEnlarged = false;
                self.toggleCursorSize();
            }
        });

        // Click events to enlarge/shrink cursor
        document.addEventListener('mousedown', function () {
            self.cursorEnlarged = true;
            self.toggleCursorSize();
        });

        document.addEventListener('mouseup', function () {
            self.cursorEnlarged = false;
            self.toggleCursorSize();
        });

        // Mouse move to update cursor position
        document.addEventListener('mousemove', function (e) {
            // Update visibility
            self.cursorVisible = true;
            self.toggleCursorVisibility();

            // Update target positions, rounding to prevent subpixel issues
            self.endX = Math.round(e.clientX);
            self.endY = Math.round(e.clientY);

            // Move the small dot instantly using translate3d for better performance
            self.updateDotTransform();
        });

        // Hide cursor when leaving the window
        document.addEventListener('mouseleave', function () {
            self.cursorVisible = false;
            self.toggleCursorVisibility();
        });

        // Show cursor when entering the window
        document.addEventListener('mouseenter', function () {
            self.cursorVisible = true;
            self.toggleCursorVisibility();
            self.$dot.style.opacity = 1;
            self.$outline.style.opacity = 1;
        });
    },

    // Update the transform of the dot
    updateDotTransform: function () {
        // Use translate3d for hardware acceleration and round values
        this.$dot.style.transform = `translate3d(${this.endX}px, ${this.endY}px, 0) translate(-50%, -50%) scale(${this.dotScale})`;
    },

    // Update the transform of the outline
    updateOutlineTransform: function () {
        this.$outline.style.transform = `translate3d(${this._x}px, ${this._y}px, 0) translate(-50%, -50%) scale(${this.outlineScale})`;
    },

    // Animation loop for the outline
    animateDotOutline: function () {
        var self = this;

        // Calculate the new position for the outline
        self._x += (self.endX - self._x) / self.delay;
        self._y += (self.endY - self._y) / self.delay;

        // Round the positions to prevent subpixel rendering issues
        self._x = Math.round(self._x);
        self._y = Math.round(self._y);

        // Update the outline's transform with the new position and current scale
        self.updateOutlineTransform();

        // Continue the animation loop
        self.animationFrameId = requestAnimationFrame(this.animateDotOutline.bind(self));
    },

    // Toggle the size of the cursor based on interactions
    toggleCursorSize: function () {
        if (this.cursorEnlarged) {
            this.dotScale = 0.75;
            this.outlineScale = 1.5;
        } else {
            this.dotScale = 1;
            this.outlineScale = 1;
        }

        // Update the transforms with the new scales
        this.updateDotTransform();
        this.updateOutlineTransform();
    },

    // Toggle the visibility of the cursor
    toggleCursorVisibility: function () {
        if (this.cursorVisible) {
            this.$dot.style.opacity = 1;
            this.$outline.style.opacity = 1;
        } else {
            this.$dot.style.opacity = 0;
            this.$outline.style.opacity = 0;
        }
    }
}

// Initialize the cursor once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    cursor.init();
});

// Handle window resize with debounce
window.addEventListener('resize', debounce(function () {
    cursor.endX = window.innerWidth / 2;
    cursor.endY = window.innerHeight / 2;
    cursor._x = window.innerWidth / 2;
    cursor._y = window.innerHeight / 2;
    cursor.updateDotTransform();
    cursor.updateOutlineTransform();
}, 200));
