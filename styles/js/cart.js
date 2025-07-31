document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('proceedToCheckout');
    
    // Render cart items or empty state
    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-mug-hot"></i>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any delicious teas to your cart yet. Let's fix that!</p>
                    <a href="index.html" class="continue-shopping">Explore Our Teas</a>
                </div>
            `;
            document.getElementById('cartSummary').style.display = 'none';
            return;
        }
        
        // Show summary if it was hidden
        document.getElementById('cartSummary').style.display = 'block';
        
        // Clear previous items
        cartItemsContainer.innerHTML = '';
        
        // Calculate subtotal
        let subtotal = 0;
        
        // Render each cart item
        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.index = index;
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-price">₹${price.toLocaleString('en-IN')}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn minus-btn"><i class="fas fa-minus"></i></button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus-btn"><i class="fas fa-plus"></i></button>
                        </div>
                        <button class="remove-btn">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update totals
        updateTotals(subtotal);
        
        // Add event listeners
        addCartEventListeners();
    }
    
    // Update order summary totals
    function updateTotals(subtotal) {
        subtotalElement.textContent = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        totalElement.textContent = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // Add event listeners to cart items
    function addCartEventListeners() {
        // Quantity minus buttons
        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemIndex = this.closest('.cart-item').dataset.index;
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                }
            });
        });
        
        // Quantity plus buttons
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemIndex = this.closest('.cart-item').dataset.index;
                cart[itemIndex].quantity++;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemIndex = this.closest('.cart-item').dataset.index;
                cart.splice(itemIndex, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
    }
    
    // Proceed to checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            window.location.href = 'order.html';
        } else {
            alert('Your cart is empty. Please add some teas first.');
        }
    });
    
    // Initial render
    renderCart();
});