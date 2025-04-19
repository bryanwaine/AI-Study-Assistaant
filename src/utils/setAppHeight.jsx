// Update on load and resize
const setAppHeight =() => {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  }
  window.addEventListener('resize', setAppHeight);
  window.addEventListener('load', setAppHeight);