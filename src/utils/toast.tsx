// Simple toast system
let toastContainer = null

export const toast = {
  success: (message) => {
    showToast(message, 'success')
  },
  error: (message) => {
    showToast(message, 'error')
  }
}

function showToast(message, type) {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.style.position = 'fixed'
    toastContainer.style.top = '20px'
    toastContainer.style.right = '20px'
    toastContainer.style.zIndex = '9999'
    document.body.appendChild(toastContainer)
  }

  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.padding = '12px 16px'
  toast.style.marginBottom = '8px'
  toast.style.borderRadius = '6px'
  toast.style.color = 'white'
  toast.style.fontWeight = '500'
  toast.style.backgroundColor = type === 'success' ? '#22c55e' : '#ef4444'
  toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
  toast.style.transform = 'translateX(100%)'
  toast.style.transition = 'transform 0.3s ease'

  toastContainer.appendChild(toast)

  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
  }, 10)

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast)
      }
    }, 300)
  }, 3000)
}