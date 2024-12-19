import { formatPrice } from '../utils/formatters.js';

export const renderCartDrawer = (cartInfo) => {
    return `
        <div class="cart-overlay ${cartInfo.isOpen ? 'open' : ''}" id="cartOverlay">
            <div class="cart-drawer ${cartInfo.isOpen ? 'open' : ''}">
                <div class="cart-header">
                    <h2>
                        <i class="ph ph-shopping-cart"></i>
                        Shopping Cart (${cartInfo.totalItems})
                    </h2>
                    <button class="close-cart" id="closeCart">
                        <i class="ph ph-x"></i>
                    </button>
                </div>
                
                <div class="cart-items">
                    ${cartInfo.items.length ? renderCartItems(cartInfo.items) : renderEmptyCart()}
                </div>
                
                ${cartInfo.items.length ? renderCartFooter(cartInfo.totalPrice) : ''}
            </div>
        </div>
    `;
};

const renderCartItems = (items) => {
    return items.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
                
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrease">
                        <i class="ph ph-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase">
                        <i class="ph ph-plus"></i>
                    </button>
                </div>
            </div>
            
            <button class="remove-item" data-action="remove" title="Remove item">
                <i class="ph ph-trash"></i>
            </button>
        </div>
    `).join('');
};

const renderEmptyCart = () => `
    <div class="empty-cart">
        <i class="ph ph-shopping-cart"></i>
        <p>Your cart is empty</p>
        <a href="/" class="continue-shopping">
            <i class="ph ph-arrow-left"></i>
            Continue Shopping
        </a>
    </div>
`;

const renderCartFooter = (totalPrice) => `
    <div class="cart-footer">
        <div class="cart-total">
            <span class="cart-total-label">Total</span>
            <span class="total-price">${formatPrice(totalPrice)}</span>
        </div>
        <a href="/checkout.html" class="checkout-btn">
            Proceed to Checkout
            <i class="ph ph-arrow-right"></i>
        </a>
    </div>
`; 