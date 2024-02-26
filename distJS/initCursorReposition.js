(function (){
  // IIFE to manage cursor position
  (() => {
    const storedCursorPosition = JSON.parse(localStorage.getItem('cursorPosition'));
    
    if (storedCursorPosition) {
      const { x, y } = storedCursorPosition;
      const cursorStyle = document.createElement('style');
      cursorStyle.id = 'initialCursorState';
      cursorStyle.type = 'text/css';
      cursorStyle.textContent = `.cursor-wrapper { transform: translate(${x}vw, ${y}vh) !important; }`;
      document.head.appendChild(cursorStyle);
    }
  })();

  // Function to gradually increase cursor wrapper opacity
  const fadeInCursorWrapper = () => {
    let opacity = 0;
    const cursorWrapper = document.querySelector('.cursor-wrapper');
    
    if (cursorWrapper) {
      const interval = setInterval(() => {
        opacity += 0.01;
        cursorWrapper.style.opacity = opacity;
        
        if (opacity >= 1) {
          clearInterval(interval);
        }
      }, 5);
    }
  };

  // Function to save cursor position in viewport units
  const saveCursorPosition = (x, y) => {
    const position = {
      x: (x / window.innerWidth) * 100,
      y: (y / window.innerHeight) * 100,
    };
    localStorage.setItem('cursorPosition', JSON.stringify(position));
  };

  // Throttle function to limit the rate at which a function is executed
  const throttle = (func, limit) => {
    let inThrottle;
    
    return function() {
      if (!inThrottle) {
        func.apply(this, arguments);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // Event listeners for mouse movement and initial fade-in
  document.addEventListener('DOMContentLoaded', fadeInCursorWrapper);
  document.addEventListener('mousemove', throttle((e) => {
    requestAnimationFrame(() => saveCursorPosition(e.clientX, e.clientY));
  }, 200));

  // Cleanup function to remove initial cursor state style after interaction
  const removeElementAndCleanup = () => {
    // Define the array of events.
    const events = ['mousemove', 'touchstart', 'click'];
    // Loop through each event and remove the event listener.
    events.forEach(event => {
      document.removeEventListener(event, removeElementAndCleanup);
    });
    // Find the element by its ID.
    const initialCursorStyle = document.getElementById('initialCursorState');
    // Check if the element exists and has a parent node before removing it.
    if (initialCursorStyle && initialCursorStyle.parentNode) {
      initialCursorStyle.parentNode.removeChild(initialCursorStyle);
    }
  };

  setTimeout(() => {
    ['mousemove', 'touchstart', 'click'].forEach(event => 
      document.addEventListener(event, removeElementAndCleanup, { once: true })
    );
  }, 500);
})();