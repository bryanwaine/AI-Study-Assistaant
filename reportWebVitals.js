// src/reportWebVitals.js
import { getTTI, getCLS, getFID, getLCP, getFCP } from 'web-vitals';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Measure TTI (Time to Interactive)
    getTTI(onPerfEntry);

    // Optionally, measure other Core Web Vitals
    getCLS(onPerfEntry); // Cumulative Layout Shift
    getFID(onPerfEntry); // First Input Delay
    getLCP(onPerfEntry); // Largest Contentful Paint
    getFCP(onPerfEntry); // First Contentful Paint
  }
};

export default reportWebVitals;