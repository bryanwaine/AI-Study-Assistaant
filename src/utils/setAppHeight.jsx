// Update on load and resize
const setAppHeight =() => {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  }
 
  export default setAppHeight