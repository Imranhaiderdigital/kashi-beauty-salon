/**
 * Kashi Beauty Salon - Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Scroll Effect
  const headerNav = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      // Hamburger animation
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = mobileMenu.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
      spans[1].style.opacity = mobileMenu.classList.contains('open') ? '0' : '1';
      spans[2].style.transform = mobileMenu.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
    });

    // Close menu when clicking links
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // 3. Scroll Reveal Animation using Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 4. Interactive Before & After Slider
  const sliderContainer = document.querySelector('.ba-slider-container');
  if (sliderContainer) {
    const beforeImage = sliderContainer.querySelector('.ba-before');
    const handle = sliderContainer.querySelector('.ba-handle');
    
    let isSliding = false;

    const slide = (clientX) => {
      const rect = sliderContainer.getBoundingClientRect();
      const position = ((clientX - rect.left) / rect.width) * 100;
      
      // Keep position between 0% and 100%
      if (position >= 0 && position <= 100) {
        beforeImage.style.width = `${position}%`;
        handle.style.left = `${position}%`;
      }
    };

    const startSliding = () => { isSliding = true; };
    const stopSliding = () => { isSliding = false; };

    // Mouse events
    handle.addEventListener('mousedown', startSliding);
    window.addEventListener('mouseup', stopSliding);
    window.addEventListener('mousemove', (e) => {
      if (!isSliding) return;
      slide(e.clientX);
    });

    // Touch events for mobile responsiveness
    handle.addEventListener('touchstart', startSliding);
    window.addEventListener('touchend', stopSliding);
    window.addEventListener('touchmove', (e) => {
      if (!isSliding) return;
      slide(e.touches[0].clientX);
    });

    // Support clicking container directly
    sliderContainer.addEventListener('click', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      slide(e.clientX);
    });
  }

  // 5. Booking Modal Controller
  const modalOverlay = document.getElementById('bookingModal');
  const closeBtn = document.querySelector('.modal-close');
  
  window.openBookingModal = (serviceName = '') => {
    if (modalOverlay) {
      modalOverlay.classList.add('open');
      modalOverlay.style.display = 'flex';
      
      // Auto-select service in dropdown if provided
      if (serviceName) {
        const serviceSelect = document.getElementById('modalService');
        if (serviceSelect) {
          // Find option matching serviceName
          for (let option of serviceSelect.options) {
            if (option.value.toLowerCase().includes(serviceName.toLowerCase()) || 
                serviceName.toLowerCase().includes(option.value.toLowerCase())) {
              option.selected = true;
              break;
            }
          }
        }
      }
    }
  };

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
      setTimeout(() => {
        modalOverlay.style.display = 'none';
      }, 400);
    });

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
        setTimeout(() => {
          modalOverlay.style.display = 'none';
        }, 400);
      }
    });
  }

  // 6. Appointment Form Compilation (WhatsApp Redirect)
  const bookingForm = document.getElementById('salonBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('modalName').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const service = document.getElementById('modalService').value;
      const date = document.getElementById('modalDate').value;
      const time = document.getElementById('modalTime').value;
      const notes = document.getElementById('modalNotes').value.trim();

      // Verification
      if (!name || !phone || !service || !date || !time) {
        alert('Please fill in all required fields.');
        return;
      }

      // WhatsApp format:
      // +923134747538
      const whatsappNumber = '923134747538';
      let message = `✨ *KASHI BEAUTY SALON - BOOKING REQUEST* ✨\n\n`;
      message += `👤 *Client Name:* ${name}\n`;
      message += `📞 *Phone Number:* ${phone}\n`;
      message += `💇‍♀️ *Service Requested:* ${service}\n`;
      message += `📅 *Preferred Date:* ${date}\n`;
      message += `⏰ *Preferred Time:* ${time}\n`;
      if (notes) {
        message += `✉️ *Special Notes:* ${notes}\n`;
      }
      message += `\n*Please confirm availability. Thank you!*`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp in a new tab
      window.open(whatsappURL, '_blank');

      // Close modal
      if (modalOverlay) {
        modalOverlay.classList.remove('open');
        setTimeout(() => {
          modalOverlay.style.display = 'none';
        }, 400);
      }
      
      // Reset form
      bookingForm.reset();
    });
  }

  // 7. Makeup Catalogue Category Filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const catalogueItems = document.querySelectorAll('.catalogue-item');

  if (filterButtons.length > 0 && catalogueItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        catalogueItems.forEach(item => {
          if (filterValue === 'all') {
            item.style.display = 'block';
            setTimeout(() => item.style.opacity = '1', 50);
          } else {
            const categories = item.getAttribute('data-category').split(' ');
            if (categories.includes(filterValue)) {
              item.style.display = 'block';
              setTimeout(() => item.style.opacity = '1', 50);
            } else {
              item.style.opacity = '0';
              setTimeout(() => item.style.display = 'none', 300);
            }
          }
        });
      });
    });
  }

  // 8. Gallery Masonry Lightbox popup
  const galleryPhotos = document.querySelectorAll('.gallery-photo');
  const lightbox = document.getElementById('galleryLightbox');
  
  if (galleryPhotos.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    galleryPhotos.forEach(photo => {
      photo.addEventListener('click', () => {
        const img = photo.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.style.display = 'block';
        }
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
  }
});
