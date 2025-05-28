// AI Made Simple: A 5-Day Course - Web App Scripts

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the progress tracker
    initProgressTracker();
    
    // Setup hamburger menu functionality
    setupHamburgerMenu();
    
    // Setup lesson completion functionality
    setupLessonCompletion();
});

// Initialize the progress tracker from localStorage
function initProgressTracker() {
    // Default progress state if none exists
    const defaultProgress = {
        lesson1: false,
        lesson2: false,
        lesson3: false,
        lesson4: false,
        lesson5: false
    };
    
    // Get progress from localStorage or use default
    let progress = JSON.parse(localStorage.getItem('aiMadeSimpleProgress')) || defaultProgress;
    
    // Update progress bar
    updateProgressBar(progress);
    
    // Check lesson completion status if on a lesson page
    const lessonCheckbox = document.getElementById('lesson-complete-checkbox');
    if (lessonCheckbox) {
        const currentLesson = document.body.getAttribute('data-lesson');
        if (currentLesson && progress[currentLesson]) {
            lessonCheckbox.checked = true;
            document.getElementById('completion-message').style.display = 'block';
        }
    }
}

// Update the progress bar based on completion status
function updateProgressBar(progress) {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        // Calculate percentage
        const total = Object.keys(progress).length;
        const completed = Object.values(progress).filter(Boolean).length;
        const percentage = Math.round((completed / total) * 100);
        
        // Update UI
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% Complete`;
        
        // Add ARIA attributes for accessibility
        progressBar.setAttribute('aria-valuenow', percentage);
        progressBar.setAttribute('aria-valuemin', 0);
        progressBar.setAttribute('aria-valuemax', 100);
        
        // Announce progress for screen readers if there's a change
        if (progressBar.getAttribute('data-last-percentage') !== percentage.toString()) {
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.classList.add('sr-only');
            announcement.textContent = `Course progress: ${percentage}% complete`;
            document.body.appendChild(announcement);
            
            // Remove after announcement
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 3000);
            
            // Store last percentage
            progressBar.setAttribute('data-last-percentage', percentage.toString());
        }
    }
}

// Setup hamburger menu functionality
function setupHamburgerMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        // Set initial ARIA attributes
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'nav-menu');
        navMenu.setAttribute('aria-hidden', 'true');
        navMenu.setAttribute('id', 'nav-menu');
        
        menuToggle.addEventListener('click', function() {
            // Toggle active class
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA attributes
            const expanded = menuToggle.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', expanded);
            navMenu.setAttribute('aria-hidden', !expanded);
            
            // Announce menu state for screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.classList.add('sr-only');
            announcement.textContent = expanded ? 'Menu opened' : 'Menu closed';
            document.body.appendChild(announcement);
            
            // Remove after announcement
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
                navMenu.setAttribute('aria-hidden', true);
            }
        });
        
        // Add keyboard navigation support
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('keydown', function(e) {
                // Close menu on Escape key
                if (e.key === 'Escape') {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                    navMenu.setAttribute('aria-hidden', true);
                    menuToggle.focus();
                }
            });
        });
    }
}

// Setup lesson completion functionality
function setupLessonCompletion() {
    const lessonCheckbox = document.getElementById('lesson-complete-checkbox');
    
    if (lessonCheckbox) {
        const currentLesson = document.body.getAttribute('data-lesson');
        
        lessonCheckbox.addEventListener('change', function() {
            // Get current progress
            let progress = JSON.parse(localStorage.getItem('aiMadeSimpleProgress')) || {
                lesson1: false,
                lesson2: false,
                lesson3: false,
                lesson4: false,
                lesson5: false
            };
            
            // Update progress
            progress[currentLesson] = lessonCheckbox.checked;
            
            // Save to localStorage
            localStorage.setItem('aiMadeSimpleProgress', JSON.stringify(progress));
            
            // Update progress bar
            updateProgressBar(progress);
            
            // Show/hide completion message
            const completionMessage = document.getElementById('completion-message');
            if (completionMessage) {
                completionMessage.style.display = lessonCheckbox.checked ? 'block' : 'none';
                
                // Announce completion for screen readers
                if (lessonCheckbox.checked) {
                    const announcement = document.createElement('div');
                    announcement.setAttribute('role', 'status');
                    announcement.setAttribute('aria-live', 'polite');
                    announcement.classList.add('sr-only');
                    announcement.textContent = `Lesson ${currentLesson.replace('lesson', '')} marked as complete!`;
                    document.body.appendChild(announcement);
                    
                    // Remove after announcement
                    setTimeout(() => {
                        document.body.removeChild(announcement);
                    }, 3000);
                }
            }
        });
    }
}

// Reset progress (for testing purposes)
function resetProgress() {
    const defaultProgress = {
        lesson1: false,
        lesson2: false,
        lesson3: false,
        lesson4: false,
        lesson5: false
    };
    
    localStorage.setItem('aiMadeSimpleProgress', JSON.stringify(defaultProgress));
    initProgressTracker();
    
    // For testing only - remove in production
    console.log('Progress reset to default state');
}
