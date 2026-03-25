/**
 * Demo Reveal — Animated typewriter effect for AI response demos
 */

(function () {
  'use strict';

  const TYPEWRITER_SPEED = 18; // ms per character

  /**
   * Typewriter effect: types text into an element character by character.
   * @param {HTMLElement} el - target element
   * @param {string} text - text to type
   * @param {Function} onDone - callback when finished
   */
  function typewriter(el, text, onDone) {
    let i = 0;
    el.textContent = '';

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.appendChild(cursor);

    function step() {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(step, TYPEWRITER_SPEED);
      } else {
        // Remove cursor when done
        cursor.remove();
        if (onDone) onDone();
      }
    }

    step();
  }

  /**
   * Initialises all demo reveal buttons on the page.
   * Call this after the DOM is ready.
   */
  function initDemos() {
    document.querySelectorAll('.demo-reveal-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const wrapper = btn.closest('.demo-response-wrapper');
        if (!wrapper) return;

        const responseEl = wrapper.querySelector('.demo-response');
        const discussion = wrapper.closest('.demo-slide')
          ? wrapper.closest('.demo-slide').querySelector('.demo-discussion')
          : null;

        if (!responseEl || responseEl.classList.contains('visible')) return;

        // Get the full response text from data attribute
        const fullText = responseEl.dataset.response || responseEl.textContent.trim();

        // Show response box
        responseEl.classList.add('visible');
        btn.style.display = 'none';

        // Add label back before typing
        const labelEl = wrapper.querySelector('.demo-response-label');
        if (labelEl) labelEl.style.display = 'block';

        // Type out the response
        typewriter(responseEl, fullText, function () {
          // Show discussion prompt when done
          if (discussion) {
            discussion.classList.add('visible');
          }
        });
      });
    });
  }

  // Auto-reset demos when Reveal.js changes slides (so demos reset on re-visit)
  function resetDemosOnSlide(event) {
    const section = event.currentSlide;
    if (!section) return;

    section.querySelectorAll('.demo-response').forEach(function (el) {
      el.classList.remove('visible');
      el.textContent = ''; // will be repopulated from dataset on click
    });

    section.querySelectorAll('.demo-reveal-btn').forEach(function (btn) {
      btn.style.display = '';
    });

    section.querySelectorAll('.demo-discussion').forEach(function (el) {
      el.classList.remove('visible');
    });
  }

  // Expose init so it can be called after Reveal is ready
  window.DemoReveal = {
    init: initDemos,
    onSlideChange: resetDemosOnSlide
  };
})();
