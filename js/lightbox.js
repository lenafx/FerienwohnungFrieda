console.log('=== LIGHTBOX SCRIPT START ===');

class Lightbox {
    constructor() {
        console.log('Lightbox constructor called');
        
        // Check if images exist
        this.images = Array.from(document.querySelectorAll('.image-grid-item img'));
        console.log('Found images:', this.images.length);
        
        if (this.images.length === 0) {
            console.error('No images found!');
            return;
        }
        
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        this.lightbox.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">&lt;</button>
            <button class="lightbox-next">&gt;</button>
            <div class="lightbox-content">
                <img src="" alt="">
            </div>
        `;
        document.body.appendChild(this.lightbox);

        this.currentIndex = 0;
        this.lightboxImg = this.lightbox.querySelector('img');
        this.setupEventListeners();
        console.log('Lightbox setup complete');
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Open lightbox on image click - use mousedown for better Firefox compatibility
        this.images.forEach((img, index) => {
            console.log('Adding click listener to image', index);
            img.addEventListener('mousedown', (e) => {
                console.log('=== IMAGE CLICK DETECTED ===');
                console.log('Event target:', e.target);
                console.log('Event currentTarget:', e.currentTarget);
                console.log('Image index:', index);
                console.log('Image src:', img.src);
                
                e.preventDefault();
                e.stopPropagation();
                console.log('Image clicked:', index);
                this.open(index);
            });
        });

        // Also add click listeners to the image grid items themselves
        const imageItems = Array.from(document.querySelectorAll('.image-grid-item'));
        imageItems.forEach((item, index) => {
            console.log('Adding click listener to image item', index);
            item.addEventListener('mousedown', (e) => {
                console.log('=== IMAGE ITEM CLICK DETECTED ===');
                console.log('Event target:', e.target);
                console.log('Event currentTarget:', e.currentTarget);
                console.log('Item index:', index);
                
                e.preventDefault();
                e.stopPropagation();
                console.log('Image item clicked:', index);
                this.open(index);
            });
        });

        // Close lightbox
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            this.close();
        });
        
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                e.preventDefault();
                console.log('Background clicked');
                this.close();
            }
        });

        // Navigation
        this.lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Prev button clicked');
            this.prev();
        });
        
        this.lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Next button clicked');
            this.next();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });
    }

    open(index) {
        console.log('=== OPEN METHOD CALLED ===');
        console.log('Opening lightbox for index:', index);
        console.log('Current lightbox element:', this.lightbox);
        console.log('Lightbox classes before:', this.lightbox.className);
        
        this.currentIndex = index;
        this.updateImage();
        this.lightbox.classList.add('active');
        
        console.log('Lightbox classes after:', this.lightbox.className);
        console.log('Lightbox display style:', this.lightbox.style.display);
        console.log('Lightbox visibility style:', this.lightbox.style.visibility);
        console.log('Lightbox opacity style:', this.lightbox.style.opacity);
        
        document.body.style.overflow = 'hidden';
        
        // Force a repaint
        this.lightbox.offsetHeight;
        
        console.log('=== OPEN METHOD COMPLETE ===');
    }

    close() {
        console.log('Closing lightbox');
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        console.log('Previous image, new index:', this.currentIndex);
        this.updateImage();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        console.log('Next image, new index:', this.currentIndex);
        this.updateImage();
    }

    updateImage() {
        const img = this.images[this.currentIndex];
        console.log('Updating image:', img.src);
        this.lightboxImg.src = img.src;
        this.lightboxImg.alt = img.alt;
    }
}

// Initialize lightbox when DOM is loaded
console.log('Setting up DOMContentLoaded listener');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing lightbox...');
    try {
        new Lightbox();
    } catch (error) {
        console.error('Error initializing lightbox:', error);
    }
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('DOM still loading, waiting for DOMContentLoaded');
} else {
    console.log('DOM already loaded, initializing immediately');
    try {
        new Lightbox();
    } catch (error) {
        console.error('Error initializing lightbox:', error);
    }
}

console.log('=== LIGHTBOX SCRIPT END ==='); 