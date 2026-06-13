// darkmode.js — G-will Chijioke (https://gwillchijioke.com)

// Dark mode flash prevention — inline in HTML head
(function() {
  var s = localStorage.getItem('headless-color-scheme');
  if (s) {
    document.documentElement.dataset.theme = s;
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
