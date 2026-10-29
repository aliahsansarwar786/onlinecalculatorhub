/**
 * OnlineCalculatorHub - Shared Script (script.js)
 * Scope: Navigation management and Calculator History storage helpers only.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var navToggle = document.querySelector('.nav-toggle');
    var navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close menu if clicked outside
      document.addEventListener('click', function (event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Close when clicking a nav link
      navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Active Navigation Link Detection
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath === '') currentPath = 'index.html';

    var navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPath || (currentPath === 'index.html' && (href === './' || href === 'index.html'))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  });

  // Calculator History Management API
  window.CalcHistory = {
    getKey: function (calculatorId) {
      return 'calc_hub_hist_' + (calculatorId || 'standard');
    },

    load: function (calculatorId) {
      try {
        var raw = localStorage.getItem(this.getKey(calculatorId));
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        return [];
      }
    },

    save: function (calculatorId, expression, result) {
      try {
        var history = this.load(calculatorId);
        var entry = {
          expr: expression,
          res: result,
          time: Date.now()
        };
        history.unshift(entry);
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        localStorage.setItem(this.getKey(calculatorId), JSON.stringify(history));
        return history;
      } catch (err) {
        return [];
      }
    },

    clear: function (calculatorId) {
      try {
        localStorage.removeItem(this.getKey(calculatorId));
      } catch (err) {}
    }
  };
})();
