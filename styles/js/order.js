document.addEventListener('DOMContentLoaded', function() {
            // Load cart from localStorage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const teaSelection = document.getElementById('teaSelection');
            const placeOrderBtn = document.getElementById('placeOrderBtn');
            const orderConfirmationModal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'));
            const addressField = document.getElementById('addressField');
            const addressInput = document.getElementById('address');
            const deliveryVideo = document.querySelector('.delivery-video');
            
            // Create floating tea cup steam
            function createSteam() {
                const teaCup = document.getElementById('floatingTeaCup');
                for (let i = 0; i < 3; i++) {
                    const steam = document.createElement('div');
                    steam.className = 'steam';
                    steam.style.width = `${10 + Math.random() * 20}px`;
                    steam.style.height = steam.style.width;
                    steam.style.left = `${30 + Math.random() * 20}px`;
                    steam.style.top = `${-10 - Math.random() * 20}px`;
                    steam.style.animation = `steam-animation ${3 + Math.random() * 4}s ease-out ${i * 1.5}s infinite`;
                    teaCup.appendChild(steam);
                }
            }
            
            // Create confetti effect
            function createConfetti() {
                const colors = ['#FF9F1C', '#FFBF69', '#8B5A2B', '#D4A76A', '#2A1A1F'];
                const container = document.body;
                
                for (let i = 0; i < 50; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = `${Math.random() * 100}vw`;
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.width = `${5 + Math.random() * 10}px`;
                    confetti.style.height = `${5 + Math.random() * 10}px`;
                    confetti.style.animation = `confetti-fall ${2 + Math.random() * 3}s linear forwards`;
                    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
                    container.appendChild(confetti);
                    
                    // Remove confetti after animation
                    setTimeout(() => {
                        confetti.remove();
                    }, 3000);
                }
            }
            
            // Floating tea cup interaction
            const floatingTeaCup = document.getElementById('floatingTeaCup');
            floatingTeaCup.addEventListener('click', function() {
                this.style.transform = 'scale(1.2) rotate(15deg)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
                
                // Create temporary steam effect
                const steam = document.createElement('div');
                steam.className = 'steam';
                steam.style.width = '30px';
                steam.style.height = '30px';
                steam.style.left = '25px';
                steam.style.top = '-20px';
                steam.style.animation = 'steam-animation 2s ease-out';
                this.appendChild(steam);
                
                // Remove steam after animation
                setTimeout(() => {
                    steam.remove();
                }, 2000);
            });
            
            // Generate QR code for mobile payment with UPI integration
            function generateQRCode() {
                const qrCodeElement = document.getElementById('qrCode');
                const totalAmount = document.getElementById('total').textContent.replace('₹', '').replace(/,/g, '');
                document.getElementById('qrAmount').textContent = `₹${parseFloat(totalAmount).toLocaleString('en-IN')}`;
                
                // Clear previous QR code if any
                qrCodeElement.innerHTML = '';
                
                // Generate UPI payment link for Indian payment systems
                const upiId = 'chai.nirvana@upi'; // Replace with your actual UPI ID
                const paymentNote = 'Chai+Nirvana+Order';
                
                // Create UPI payment URL (note: amount is in INR)
                const upiUrl = `upi://pay?pa=${upiId}&pn=${paymentNote}&am=${totalAmount}&cu=INR`;
                
                // Generate QR code
                QRCode.toDataURL(upiUrl, {
                    width: 180,
                    height: 180,
                    color: {
                        dark: "#8B5A2B",
                        light: "#F8F1E5"
                    },
                    margin: 1
                }, function (err, url) {
                    if (err) {
                        console.error(err);
                        // Fallback if QR code generation fails
                        qrCodeElement.innerHTML = '<div style="color: #8B5A2B; font-size: 14px;">QR Code Error<br>Please try another payment method</div>';
                        return;
                    }
                    
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = "UPI Payment QR Code";
                    qrCodeElement.appendChild(img);
                    
                    // Add click event to open UPI apps directly
                    qrCodeElement.onclick = function() {
                        window.location.href = upiUrl;
                    };
                });
            }
            
            // Payment method change handler
            document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    // Hide all payment details
                    document.querySelectorAll('.payment-details').forEach(detail => {
                        detail.classList.remove('active');
                    });
                    
                    // Show selected payment details
                    if (this.value === 'card') {
                        document.getElementById('cardDetails').classList.add('active');
                    } else if (this.value === 'mobile') {
                        document.getElementById('mobileDetails').classList.add('active');
                        generateQRCode();
                    }
                });
            });
            
            // Delivery option change handler
            document.querySelectorAll('input[name="deliveryOption"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    // Calculate subtotal only if there are items in cart
                    let subtotal = 0;
                    if (cart.length > 0) {
                        subtotal = cart.reduce((total, item) => {
                            return total +(parseFloat(item.price.replace(/[^0-9.]/g, ''))) * item.quantity;
                        }, 0);
                    }
                    updateOrderSummary(subtotal);
                    
                    // Show/hide address field based on delivery option
                    if (this.value === 'pickup') {
                        addressField.classList.remove('active');
                        addressInput.removeAttribute('required');
                    } else {
                        addressField.classList.add('active');
                        addressInput.setAttribute('required', 'required');
                    }
                    
                    // Show/hide delivery video in confirmation modal
                    if (this.value === 'pickup') {
                        deliveryVideo.style.display = 'none';
                    } else {
                        deliveryVideo.style.display = 'block';
                    }
                    
                    // Add animation to the delivery option
                    const label = this.nextElementSibling;
                    label.classList.add('mind-blow');
                    setTimeout(() => {
                        label.classList.remove('mind-blow');
                    }, 500);
                });
            });
            
            // Render cart items or empty state
            function renderCart() {
                if (cart.length === 0) {
                    teaSelection.innerHTML = `
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <h2>Your cart is empty</h2>
                            <p>You haven't added any teas to your cart yet.</p>
                            <a href="index.html" class="continue-shopping">Browse Teas</a>
                        </div>
                    `;
                    placeOrderBtn.disabled = true;
                    
                    // Set all prices to ₹0.00 when cart is empty
                    document.getElementById('subtotal').textContent = '₹0.00';
                    document.getElementById('deliveryFee').textContent = '₹0.00';
                    document.getElementById('total').textContent = '₹0.00';
                    return;
                }
                
                // Clear previous items
                teaSelection.innerHTML = '';
                
                // Calculate subtotal
                let subtotal = 0;
                
                // Render each cart item
                cart.forEach((item, index) => {
                    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                    const itemTotal = price * item.quantity;
                    subtotal += itemTotal;
                    
                    const teaItem = document.createElement('div');
                    teaItem.className = 'tea-item';
                    teaItem.innerHTML = `
                        <button type="button" class="remove-tea" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="row align-items-center">
                            <div class="col-3">
                                <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                            </div>
                            <div class="col-5">
                                <h5>${item.name}</h5>
                                <p class="text-muted mb-0">₹${price.toLocaleString('en-IN')}</p>
                            </div>
                            <div class="col-4">
                                <div class="input-group">
                                    <button class="btn btn-outline-secondary decrease-quantity" type="button" data-index="${index}">-</button>
                                    <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" readonly>
                                    <button class="btn btn-outline-secondary increase-quantity" type="button" data-index="${index}">+</button>
                                </div>
                            </div>
                        </div>
                    `;
                    teaSelection.appendChild(teaItem);
                });
                
                // Update order summary
                updateOrderSummary(subtotal);
                
                // Add event listeners
                addCartEventListeners();
            }
            
            // Update order summary
            function updateOrderSummary(subtotal) {
                let deliveryFee = 0;
                const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;
                
                if (deliveryOption === "delivery") {
                    deliveryFee = 50;
                } else if (deliveryOption === "express") {
                    deliveryFee = 100;
                }
                
                document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                document.getElementById('deliveryFee').textContent = `₹${deliveryFee.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                const total = subtotal + deliveryFee;
                document.getElementById('total').textContent = `₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                
                // Update QR code amount if mobile payment is selected
                if (document.getElementById('mobile').checked) {
                    document.getElementById('qrAmount').textContent = `₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                    generateQRCode();
                }
            }
            
            // Add event listeners to cart items
            function addCartEventListeners() {
                // Quantity minus buttons
                document.querySelectorAll('.decrease-quantity').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = this.dataset.index;
                        if (cart[index].quantity > 1) {
                            cart[index].quantity--;
                            localStorage.setItem('cart', JSON.stringify(cart));
                            renderCart();
                            
                            // Add animation to the quantity input
                            const input = this.nextElementSibling;
                            input.classList.add('mind-blow');
                            setTimeout(() => {
                                input.classList.remove('mind-blow');
                            }, 500);
                        }
                    });
                });
                
                // Quantity plus buttons
                document.querySelectorAll('.increase-quantity').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = this.dataset.index;
                        cart[index].quantity++;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        renderCart();
                        
                        // Add animation to the quantity input
                        const input = this.previousElementSibling;
                        input.classList.add('mind-blow');
                        setTimeout(() => {
                            input.classList.remove('mind-blow');
                        }, 500);
                    });
                });
                
                // Remove buttons
                document.querySelectorAll('.remove-tea').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = this.dataset.index;
                        cart.splice(index, 1);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        renderCart();
                        
                        // Add confetti effect when removing an item
                        createConfetti();
                    });
                });
            }
            
            // Form submission handler
            document.getElementById('placeOrderBtn').addEventListener('click', function() {
                // Validate form
                if (!validateForm()) {
                    return;
                }
                
                // Validate payment method if needed
                const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
                if (paymentMethod === 'card' && !validateCardDetails()) {
                    return;
                }
                
                // Show loading state
                this.disabled = true;
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
                
                // Simulate API call delay
                setTimeout(() => {
                    // Generate random order ID
                    const orderId = "TH-" + Math.floor(100000 + Math.random() * 900000);
                    document.getElementById('orderIdDisplay').textContent = orderId;
                    
                    // Show confirmation modal
                    orderConfirmationModal.show();
                    
                    // Clear cart after successful order
                    localStorage.removeItem('cart');
                    
                    // Reset button state
                    this.disabled = false;
                    this.textContent = 'Place Order';
                    
                    // Create confetti celebration
                    createConfetti();
                }, 1500);
            });
            
            // Form validation
            function validateForm() {
                let isValid = true;
                
                // Reset validation
                document.querySelectorAll('.is-invalid').forEach(el => {
                    el.classList.remove('is-invalid');
                });
                
                // Validate customer info
                if (!document.getElementById('name').value.trim()) {
                    document.getElementById('name').classList.add('is-invalid');
                    isValid = false;
                }
                
                if (!document.getElementById('phone').value.trim()) {
                    document.getElementById('phone').classList.add('is-invalid');
                    isValid = false;
                }
                
                if (!document.getElementById('email').value.trim() || !isValidEmail(document.getElementById('email').value)) {
                    document.getElementById('email').classList.add('is-invalid');
                    isValid = false;
                }
                
                // Only validate address if delivery is selected
                const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;
                if (deliveryOption !== 'pickup' && !document.getElementById('address').value.trim()) {
                    document.getElementById('address').classList.add('is-invalid');
                    isValid = false;
                }
                
                return isValid;
            }
            
            // Card details validation
            function validateCardDetails() {
                let isValid = true;
                
                if (!document.getElementById('cardNumber').value.trim() || document.getElementById('cardNumber').value.length < 16) {
                    document.getElementById('cardNumber').classList.add('is-invalid');
                    isValid = false;
                }
                
                if (!document.getElementById('cardExpiry').value.trim() || !/^\d{2}\/\d{2}$/.test(document.getElementById('cardExpiry').value)) {
                    document.getElementById('cardExpiry').classList.add('is-invalid');
                    isValid = false;
                }
                
                if (!document.getElementById('cardCvv').value.trim() || document.getElementById('cardCvv').value.length < 3) {
                    document.getElementById('cardCvv').classList.add('is-invalid');
                    isValid = false;
                }
                
                return isValid;
            }
            
            // Email validation
            function isValidEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            
            // Initialize
            renderCart();
            createSteam();
            
            // Add animation to form cards when they come into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.form-card').forEach((card, index) => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(20px)';
                card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
                observer.observe(card);
            });
        });