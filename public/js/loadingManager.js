// sets up the loading screen overlay in between soundscapes

const loadingManager = {
  loadingText: document.querySelector('#loading-text'),
  
  /**
   * Show the loading overlay
   */
  showLoading: () => {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Reset the loading text
    if (loadingManager.loadingText) {
      loadingManager.loadingText.textContent = 'Flying somewhere new...';
    }
  },

  /**
   * Hide the loading overlay with a smooth transition
   */
  hideLoading: () => {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
  },

  /**
   * Initialize the loading manager
   * This ensures the loading overlay is hidden on initial page load
   */
  init: () => {
    // Store a reference to the loading text element
    loadingManager.loadingText = document.querySelector('.loading-container p');
    
    // Ensure the loading overlay is properly set up
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      // Initially show the overlay since we'll be loading data right away
      overlay.classList.remove('hidden');
    }
  }
};

export default loadingManager;