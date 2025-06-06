/**
 * Promotional Banner JavaScript
 * Handles banner interactions and animations
 */

class PromotionalBanner {
  constructor() {
    this.initializeBanners();
    this.setupEventListeners();
  }

  initializeBanners() {
    // Check for previously dismissed banners
    document.addEventListener('DOMContentLoaded', () => {
      const banners = document.querySelectorAll('[data-banner-id]');
      
      banners.forEach(banner => {
        const bannerId = banner.getAttribute('data-banner-id');
        const wasDismissed = this.getBannerDismissalState(bannerId);
        
        if (wasDismissed) {
          this.hideBanner(banner, false);
        } else {
          this.showBanner(banner);
        }
      });
    });
  }

  setupEventListeners() {
    // Handle escape key to close banner
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const visibleBanners = document.querySelectorAll('.promotional-banner:not(.hidden)');
        visibleBanners.forEach(banner => {
          const bannerId = banner.getAttribute('data-banner-id');
          this.closeBanner(bannerId);
        });
      }
    });

    // Handle click outside banner (optional dismissal)
    document.addEventListener('click', (event) => {
      if (event.target.closest('.promotional-banner')) {
        return; // Click was inside banner
      }
      
      // Optional: Auto-dismiss after user interaction with page
      // Uncomment the lines below if you want this behavior
      // const visibleBanners = document.querySelectorAll('.promotional-banner:not(.hidden)');
      // visibleBanners.forEach(banner => {
      //   const bannerId = banner.getAttribute('data-banner-id');
      //   setTimeout(() => this.closeBanner(bannerId), 5000);
      // });
    });
  }

  closeBanner(bannerId, animate = true) {
    const banner = document.getElementById('promotional-banner-' + bannerId);
    
    if (!banner) return;

    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Animate out
      banner.style.animation = 'fadeOut 0.3s ease-out forwards';
      
      setTimeout(() => {
        this.hideBanner(banner, true);
      }, 300);
    } else {
      this.hideBanner(banner, true);
    }
  }

  hideBanner(banner, saveDismissal = true) {
    if (!banner) return;
    
    banner.classList.add('hidden');
    banner.style.display = 'none';
    
    if (saveDismissal) {
      const bannerId = banner.getAttribute('data-banner-id');
      this.saveBannerDismissal(bannerId);
      
      // Trigger custom event for analytics or other tracking
      this.dispatchBannerEvent('banner-dismissed', bannerId);
    }
  }

  showBanner(banner) {
    if (!banner) return;
    
    banner.classList.remove('hidden');
    banner.style.display = 'flex';
    
    const bannerId = banner.getAttribute('data-banner-id');
    
    // Trigger custom event for analytics or other tracking
    this.dispatchBannerEvent('banner-shown', bannerId);
  }

  saveBannerDismissal(bannerId) {
    try {
      // Set dismissal with expiration (optional: 24 hours)
      const dismissalData = {
        dismissed: true,
        timestamp: Date.now(),
        expiresIn: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      };
      
      localStorage.setItem(`banner-dismissed-${bannerId}`, JSON.stringify(dismissalData));
    } catch (error) {
      console.warn('Could not save banner dismissal state:', error);
    }
  }

  getBannerDismissalState(bannerId) {
    try {
      const dismissalData = localStorage.getItem(`banner-dismissed-${bannerId}`);
      
      if (!dismissalData) return false;
      
      const parsed = JSON.parse(dismissalData);
      
      // Check if dismissal has expired
      if (parsed.expiresIn && (Date.now() - parsed.timestamp) > parsed.expiresIn) {
        localStorage.removeItem(`banner-dismissed-${bannerId}`);
        return false;
      }
      
      return parsed.dismissed === true;
    } catch (error) {
      console.warn('Could not read banner dismissal state:', error);
      return false;
    }
  }

  dispatchBannerEvent(eventType, bannerId) {
    const event = new CustomEvent(eventType, {
      detail: {
        bannerId: bannerId,
        timestamp: Date.now()
      }
    });
    
    document.dispatchEvent(event);
  }

  // Public method to programmatically show a banner
  showBannerById(bannerId) {
    const banner = document.getElementById('promotional-banner-' + bannerId);
    if (banner) {
      localStorage.removeItem(`banner-dismissed-${bannerId}`);
      this.showBanner(banner);
    }
  }

  // Public method to programmatically close a banner
  closeBannerById(bannerId) {
    this.closeBanner(bannerId);
  }
}

// Global function for inline onclick handlers (for backward compatibility)
function closeBanner(bannerId) {
  if (window.promotionalBannerInstance) {
    window.promotionalBannerInstance.closeBannerById(bannerId);
  }
}

// Initialize the banner system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.promotionalBannerInstance = new PromotionalBanner();
  });
} else {
  window.promotionalBannerInstance = new PromotionalBanner();
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PromotionalBanner;
} 