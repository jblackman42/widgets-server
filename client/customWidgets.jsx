import React from 'react';
import ReactDOM from 'react-dom/client';
import WidgetBoundary from './components/WidgetBoundary'; // Import the new ErrorBoundary

const CustomWidgets = {
  isDevelopment: process.env.NODE_ENV === 'development',
  loadedComponents: {},

  reportError(message) {
    console.error("Reporting error:", message);
    fetch(`${process.env.BASE_URL}/Widgets/report-error`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Message: message,
        Location: window.location.href,
        Browser: navigator.userAgent,
        Platform: navigator.userAgentData?.platform || navigator.platform,
        Language: navigator.language,
        Cookies: navigator.cookieEnabled,
        Screen: {
          Width: window.innerHeight,
          Height: window.innerWidth
        }
      }),
    }).catch(err => console.error("Failed to report error:", err));
  },

  getElementProps(element) {
    const props = {};
    Array.from(element.attributes).forEach(attr => {
      props[attr.name] = attr.value;
    });
    return props;
  },

  loadComponent(componentName) {
    return new Promise((resolve, reject) => {
      if (this.loadedComponents[componentName]) {
        resolve(this.loadedComponents[componentName]);
        return;
      }

      // Ensure React is available globally for the component
      window.React = React;
      window.ReactDOM = ReactDOM;

      const script = document.createElement('script');
      script.src = `${process.env.BASE_URL}/dist/widgets/${componentName}.bundle.js`;
      script.onload = () => {
        if (window[componentName]) {
          const { Component, HTMLElementName } = window[componentName];
          if (typeof Component === 'function') {
            this.loadedComponents[componentName] = { Component, HTMLElementName };
            if (this.isDevelopment) console.log(`Component ${componentName} loaded successfully`);
            resolve({ Component, HTMLElementName });
          } else {
            reject(new Error(`Component ${componentName} is not a valid React component.`));
          }
        } else {
          reject(new Error(`Component ${componentName} not found after script load`));
        }
      };
      script.onerror = () => {
        reject(new Error(`Failed to load script for component ${componentName}`));
      };
      document.head.appendChild(script);
    });
  },

  async renderComponent(componentName, container) {
    try {
      const { Component } = await this.loadComponent(componentName);
      const props = this.getElementProps(container);
      const root = ReactDOM.createRoot(container);
      // root.render(
      //   <ErrorBoundary onError={(error, errorInfo) => {
      //     this.reportError(`Error in component ${componentName}: ${error.message}`);
      //   }}>
      //     <Component 
      //       {...props} 
      //     />
      //   </ErrorBoundary>
      // );
      root.render(<WidgetBoundary WidgetComponent={Component} WidgetProps={props} />);
    } catch (error) {
      if (this.isDevelopment) console.error(`Failed to render component ${componentName}:`, error);
      this.reportError(`Failed to render component ${componentName}: ${error.message}`);
    }
  },

  async init() {
    try {
      const response = await fetch(`${process.env.BASE_URL}/Widgets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const components = await response.json();

      components.forEach(({ComponentName, HTMLElementName}) => {
        const elements = document.querySelectorAll(HTMLElementName);
        elements.forEach(element => this.renderComponent(ComponentName, element));
      });

      // Load the component's CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${process.env.BASE_URL}/dist/styles/widgets.css`;
      document.head.appendChild(link);
    } catch (error) {
      if (this.isDevelopment) console.error('Failed to initialize CustomWidgets:', error);
      this.reportError(`Failed to initialize CustomWidgets: ${error.message}`);
    }
  }
};

// Initialize the CustomWidgets when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cacheKey = urlParams.get('cacheKey');
  if (cacheKey) {
    sessionStorage.setItem("cacheKey", cacheKey);
  }
  CustomWidgets.init();
});

// Export CustomWidgets for external use
export default CustomWidgets;