import Vue from 'vue';

const Toast = {
  install(Vue) {
    Vue.prototype.$toast = {
      show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Style the toast
        Object.assign(toast.style, {
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 20px',
          borderRadius: '6px',
          color: 'white',
          fontWeight: '600',
          zIndex: '9999',
          minWidth: '250px',
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateX(100%)',
          transition: 'transform 0.3s ease',
          fontSize: '0.9rem'
        });
        
        // Set background color based on type
        switch (type) {
          case 'success':
            toast.style.backgroundColor = '#10b981';
            break;
          case 'error':
            toast.style.backgroundColor = '#ef4444';
            break;
          case 'warning':
            toast.style.backgroundColor = '#f59e0b';
            break;
          default:
            toast.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
          toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after duration
        setTimeout(() => {
          toast.style.transform = 'translateX(100%)';
          setTimeout(() => {
            if (document.body.contains(toast)) {
              document.body.removeChild(toast);
            }
          }, 300);
        }, duration);
      },
      
      success(message, duration) {
        this.show(message, 'success', duration);
      },
      
      error(message, duration) {
        this.show(message, 'error', duration);
      },
      
      warning(message, duration) {
        this.show(message, 'warning', duration);
      },
      
      info(message, duration) {
        this.show(message, 'info', duration);
      }
    };
  }
};

Vue.use(Toast);
