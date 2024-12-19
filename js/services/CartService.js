class CartService {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.subscribers = [];
        this.isOpen = false;
    }

    // Subscribe to cart changes
    subscribe(callback) {
        this.subscribers.push(callback);
        callback(this.getCartInfo()); // Initial call
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    // Notify all subscribers
    notify() {
        const cartInfo = this.getCartInfo();
        this.subscribers.forEach(callback => callback(cartInfo));
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Add item to cart
    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image.mobile,
                quantity
            });
        }

        this.notify();
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.notify();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.notify();
            }
        }
    }

    // Get cart information
    getCartInfo() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
            items: this.cart,
            totalItems,
            totalPrice,
            isOpen: this.isOpen
        };
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.notify();
    }

    // Add this method
    toggleCart() {
        this.isOpen = !this.isOpen;
        this.notify();
    }
}

// Create a singleton instance
export const cartService = new CartService(); 