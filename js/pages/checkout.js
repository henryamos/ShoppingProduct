import { cartService } from '../services/CartService.js';
import { formatPrice } from '../utils/formatters.js';

const elements = {
    checkoutItems: document.getElementById('checkoutItems'),
    subtotal: document.getElementById('subtotal'),
    total: document.getElementById('total'),
    checkoutForm: document.getElementById('checkoutForm')
};

const SHIPPING_COST = 5.00;

const renderCheckoutItems = (items) => {
    return items.map(item => `
        <div class="checkout-item">
            <img 
                src="${item.image}" 
                alt="${item.name}"
                class="checkout-item-image"
            >
            <div class="checkout-item-details">
                <h3>${item.name}</h3>
                <p class="checkout-item-price">${formatPrice(item.price)}</p>
                <p class="checkout-item-quantity">Quantity: ${item.quantity}</p>
            </div>
            <div class="checkout-item-total">
                ${formatPrice(item.price * item.quantity)}
            </div>
        </div>
    `).join('');
};

const updateOrderSummary = (cartInfo) => {
    if (elements.checkoutItems) {
        elements.checkoutItems.innerHTML = renderCheckoutItems(cartInfo.items);
    }

    if (elements.subtotal) {
        elements.subtotal.textContent = formatPrice(cartInfo.totalPrice);
    }

    if (elements.total) {
        elements.total.textContent = formatPrice(cartInfo.totalPrice + SHIPPING_COST);
    }
};

const validateForm = (formData) => {
    const errors = {};
    
    // Name validation
    if (!formData.get('firstName').trim()) {
        errors.firstName = 'First name is required';
    }
    
    if (!formData.get('lastName').trim()) {
        errors.lastName = 'Last name is required';
    }
    
    // Email validation
    const email = formData.get('email').trim();
    if (!email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Address validation
    if (!formData.get('address').trim()) {
        errors.address = 'Address is required';
    }
    
    if (!formData.get('city').trim()) {
        errors.city = 'City is required';
    }
    
    // ZIP code validation
    const zipCode = formData.get('zipCode').trim();
    if (!zipCode) {
        errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(zipCode)) {
        errors.zipCode = 'Please enter a valid 5-digit ZIP code';
    }
    
    // Phone validation
    const phone = formData.get('phone').trim().replace(/\D/g, '');
    if (!phone) {
        errors.phone = 'Phone number is required';
    } else if (phone.length !== 10) {
        errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    return errors;
};

const showErrors = (errors) => {
    // Clear all existing error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });

    // Show new error messages
    Object.entries(errors).forEach(([field, message]) => {
        const errorElement = document.querySelector(`#${field} + .error-message`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
    }
    
    // Disable submit button and show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="loading-spinner"></span>
        Processing...
    `;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Clear cart and redirect to success page
        cartService.clearCart();
        window.location.href = '/order-success.html';
    } catch (error) {
        console.error('Checkout failed:', error);
        showToast('An error occurred during checkout. Please try again.');
        
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
};

const init = () => {
    // Get cart info and update summary
    const cartInfo = cartService.getCartInfo();
    
    if (cartInfo.items.length === 0) {
        window.location.href = '/'; // Redirect if cart is empty
        return;
    }
    
    updateOrderSummary(cartInfo);
    
    // Setup form submission
    elements.checkoutForm?.addEventListener('submit', handleSubmit);
};

document.addEventListener('DOMContentLoaded', init); 