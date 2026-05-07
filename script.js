document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    
    // Modal elements
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    // Section elements
    const cartSectionItems = document.getElementById('cart-items-section');
    const cartSectionPrice = document.getElementById('cart-total-price-section');

    // Wishlist elements
    const wishlistCountElement = document.getElementById('wishlist-count');
    const wishlistIcon = document.querySelector('.wishlist-icon');
    const wishlistModal = document.getElementById('wishlist-modal');
    const closeWishlistBtn = document.getElementById('close-wishlist');
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    const productContainer = document.getElementById('product-container');
    
    // Product Details elements
    const pdModal = document.getElementById('product-details-modal');
    const closePdBtn = document.getElementById('close-pd');
    const pdImage = document.getElementById('pd-image');
    const pdName = document.getElementById('pd-name');
    const pdPrice = document.getElementById('pd-price');
    const pdDesc = document.getElementById('pd-description');
    const pdWishlistBtn = document.getElementById('pd-wishlist-btn');
    const pdAddToCartBtn = document.getElementById('pd-add-to-cart-btn');
    let currentProductDetails = null;

    // Initialize cart and wishlist from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Function to update cart UI and localStorage
    const updateCart = () => {
        // Save to local storage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) cartCountElement.textContent = totalItems;

        // Render to modal if exists
        if (cartItemsContainer) {
            renderCartToContainer(cartItemsContainer, cartTotalPrice);
        }
        
        // Render to section if exists
        if (cartSectionItems) {
            renderCartToContainer(cartSectionItems, cartSectionPrice);
        }
    };

    // Render items to a specific container
    const renderCartToContainer = (container, priceElement) => {
        container.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            container.innerHTML = '<p style="text-align:center; margin-top:20px; color:gray;">Your cart is empty.</p>';
            if (priceElement) priceElement.textContent = '₹0.00';
            return;
        }

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                    <button class="remove-btn" data-index="${index}">🗑️</button>
                </div>
            `;
            container.appendChild(itemElement);
        });

        if (priceElement) priceElement.textContent = `₹${total.toFixed(2)}`;

        // Add event listeners for cart item controls within THIS container
        container.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });

        container.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart[index].quantity++;
                updateCart();
            });
        });

        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    };

    // Initial update
    updateCart();

    // --- WISHLIST LOGIC ---
    const updateWishlist = () => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        if (wishlistCountElement) wishlistCountElement.textContent = wishlist.length;

        if (wishlistItemsContainer) {
            renderWishlistToContainer(wishlistItemsContainer);
        }
        
        // Sync wishlist button states dynamically during render or when clicking
        if (productContainer) {
            const btns = productContainer.querySelectorAll('.wishlist-btn');
            btns.forEach(button => {
                const productName = button.getAttribute('data-name');
                if (wishlist.find(item => item.name === productName)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        }
    };

    const renderWishlistToContainer = (container) => {
        container.innerHTML = '';

        if (wishlist.length === 0) {
            container.innerHTML = '<p style="text-align:center; margin-top:20px; color:gray;">Your wishlist is empty.</p>';
            return;
        }

        wishlist.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item'; // Reuse cart-item styles
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="move-to-cart-btn" data-index="${index}">Move to Cart</button>
                    <button class="remove-btn remove-wishlist-btn" data-index="${index}">🗑️</button>
                </div>
            `;
            container.appendChild(itemElement);
        });

        // Event listeners for wishlist items
        container.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                wishlist.splice(index, 1);
                updateWishlist();
            });
        });

        container.querySelectorAll('.move-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const item = wishlist[index];
                
                // Add to cart
                const existingItem = cart.find(cItem => cItem.name === item.name);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({...item, quantity: 1});
                }
                
                // Remove from wishlist
                wishlist.splice(index, 1);
                
                updateCart();
                updateWishlist();
            });
        });
    };

    const products = [
        // Staples & Flours
        { name: 'Aashirvaad Atta', price: 50, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Aashirvaad+Atta', description: '100% pure whole wheat atta for soft, fluffy rotis.', weight: '1 kg', type: 'Veg' },
        { name: 'Aashirvaad Multigrain Atta', price: 65, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Aashirvaad+Multigrain', description: 'Nutritious multigrain atta for a healthier lifestyle.', weight: '1 kg', type: 'Veg' },
        { name: 'Fortune Atta', price: 45, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Fortune+Atta', description: 'Premium quality wheat atta.', weight: '1 kg', type: 'Veg' },
        { name: 'Pillsbury Chakki Fresh Atta', price: 55, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Pillsbury+Atta', description: 'Fresh chakki atta for the softest rotis.', weight: '1 kg', type: 'Veg' },
        { name: 'Nature Fresh Atta', price: 48, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Nature+Fresh+Atta', description: 'Wholesome wheat atta.', weight: '1 kg', type: 'Veg' },
        { name: 'India Gate Basmati Rice', price: 90, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=India+Gate+Rice', description: 'Premium basmati rice with long grains and aromatic flavor.', weight: '1 kg', type: 'Veg' },
        { name: 'Daawat Premium Rice', price: 95, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Daawat+Rice', description: 'Long and fluffy premium basmati rice.', weight: '1 kg', type: 'Veg' },
        { name: 'Brown Rice', price: 70, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Brown+Rice', description: 'Healthy and fibrous brown rice.', weight: '1 kg', type: 'Veg' },
        { name: 'Sticky Rice', price: 110, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Sticky+Rice', description: 'Perfect for Asian cuisines.', weight: '1 kg', type: 'Veg' },
        { name: 'Maida', price: 40, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Maida', description: 'Refined wheat flour for baking and cooking.', weight: '1 kg', type: 'Veg' },
        { name: 'Besan', price: 60, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Besan', description: 'Gram flour, essential for pakoras and sweets.', weight: '500g', type: 'Veg' },
        { name: 'Ragi Flour', price: 50, category: 'Staples & Flours', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Ragi+Flour', description: 'Nutritious finger millet flour.', weight: '500g', type: 'Veg' },

        // Pulses & Dry Foods
        { name: 'Tata Sampann Dal', price: 75, category: 'Pulses & Dry Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Tata+Sampann+Dal', description: 'Unpolished and high-protein dal.', weight: '500g', type: 'Veg' },
        { name: 'Rajdhani Rajma', price: 80, category: 'Pulses & Dry Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Rajdhani+Rajma', description: 'Premium quality red kidney beans.', weight: '500g', type: 'Veg' },
        { name: 'Organic India Pulses', price: 95, category: 'Pulses & Dry Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Organic+Pulses', description: '100% certified organic pulses.', weight: '500g', type: 'Veg' },
        { name: 'Moong Dal', price: 65, category: 'Pulses & Dry Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Moong+Dal', description: 'Easy to digest, rich in protein.', weight: '500g', type: 'Veg' },
        { name: 'Masoor Dal', price: 60, category: 'Pulses & Dry Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Masoor+Dal', description: 'Red lentils for everyday meals.', weight: '500g', type: 'Veg' },
        { name: 'Urad Dal', price: 70, category: 'Pulses & Dry Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Urad+Dal', description: 'Perfect for idli, dosa, and dal makhani.', weight: '500g', type: 'Veg' },
        { name: 'Chana', price: 55, category: 'Pulses & Dry Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Chana', description: 'Brown chickpeas, packed with energy.', weight: '500g', type: 'Veg' },
        { name: 'Soya Chunks', price: 45, category: 'Pulses & Dry Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Soya+Chunks', description: 'High-protein meat substitute.', weight: '200g', type: 'Veg' },
        { name: 'Peanuts', price: 60, category: 'Pulses & Dry Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Peanuts', description: 'Crunchy peanuts for snacking or cooking.', weight: '500g', type: 'Veg' },

        // Spices & Masalas
        { name: 'Everest Garam Masala', price: 40, category: 'Spices & Masalas', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Everest+Garam+Masala', description: 'Authentic blend of aromatic spices.', weight: '100g', type: 'Veg' },
        { name: 'MDH Kitchen King', price: 45, category: 'Spices & Masalas', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=MDH+Kitchen+King', description: 'The king of all masalas for curries.', weight: '100g', type: 'Veg' },
        { name: 'Catch Table Salt', price: 20, category: 'Spices & Masalas', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Catch+Salt', description: 'Free-flowing iodized salt.', weight: '1 kg', type: 'Veg' },
        { name: 'Badshah Pav Bhaji Masala', price: 35, category: 'Spices & Masalas', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Badshah+Pav+Bhaji', description: 'Perfect spice mix for delicious pav bhaji.', weight: '100g', type: 'Veg' },
        { name: 'Whole Spices', price: 50, category: 'Spices & Masalas', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Whole+Spices', description: 'Assorted whole spices for tempering.', weight: '50g', type: 'Veg' },
        { name: 'Hing', price: 25, category: 'Spices & Masalas', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Hing', description: 'Asafoetida for digestion and flavor.', weight: '50g', type: 'Veg' },
        { name: 'Kasuri Methi', price: 30, category: 'Spices & Masalas', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Kasuri+Methi', description: 'Dried fenugreek leaves for rich aroma.', weight: '50g', type: 'Veg' },

        // Oils & Cooking
        { name: 'Dhara Mustard Oil', price: 130, category: 'Oils & Cooking', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Dhara+Mustard+Oil', description: 'Kachi ghani mustard oil.', weight: '1 Litre', type: 'Veg' },
        { name: 'Saffola Healthy Oil', price: 150, category: 'Oils & Cooking', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Saffola+Oil', description: 'Good for the heart, blended oil.', weight: '1 Litre', type: 'Veg' },
        { name: 'Fortune Rice Bran Oil', price: 140, category: 'Oils & Cooking', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Fortune+Rice+Bran', description: 'Physically refined rice bran oil.', weight: '1 Litre', type: 'Veg' },
        { name: 'Fortune Sunflower Oil', price: 120, category: 'Oils & Cooking', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Fortune+Sunflower', description: 'Light and healthy cooking oil.', weight: '1 Litre', type: 'Veg' },
        { name: 'Pure Ghee', price: 250, category: 'Oils & Cooking', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Pure+Ghee', description: 'Rich, aromatic desi ghee.', weight: '500g', type: 'Veg' },
        { name: 'Vanaspati', price: 90, category: 'Oils & Cooking', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Vanaspati', description: 'Hydrogenated vegetable oil for baking.', weight: '1 kg', type: 'Veg' },

        // Biscuits & Bakery
        { name: 'Parle-G', price: 5, category: 'Biscuits & Bakery', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Parle-G+₹5', description: 'The original glucose biscuit.', weight: '50g', type: 'Veg' },
        { name: 'Parle Monaco', price: 10, category: 'Biscuits & Bakery', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Parle+Monaco', description: 'Light, crunchy, and salty biscuits.', weight: '75g', type: 'Veg' },
        { name: 'Britannia Good Day', price: 10, category: 'Biscuits & Bakery', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Good+Day+₹10', description: 'Butter cookies with a smile.', weight: '60g', type: 'Veg' },
        { name: 'Britannia Bourbon', price: 20, category: 'Biscuits & Bakery', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Bourbon', description: 'Chocolate cream-filled biscuits.', weight: '150g', type: 'Veg' },
        { name: 'Sunfeast Dark Fantasy', price: 30, category: 'Biscuits & Bakery', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Dark+Fantasy', description: 'Choco-filled decadent cookies.', weight: '75g', type: 'Veg' },
        { name: 'Cream Biscuits', price: 15, category: 'Biscuits & Bakery', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Cream+Biscuits', description: 'Assorted sweet cream biscuits.', weight: '100g', type: 'Veg' },
        { name: 'Rusks', price: 35, category: 'Biscuits & Bakery', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Rusks', description: 'Crispy toasts for your tea time.', weight: '200g', type: 'Veg' },
        { name: 'Cakes', price: 25, category: 'Biscuits & Bakery', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Cakes', description: 'Soft and spongy packaged cakes.', weight: '120g', type: 'Veg' },

        // Snacks & Namkeen
        { name: 'Lays Potato Chips', price: 10, category: 'Snacks & Namkeen', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Lays+₹10', description: 'Crispy and crunchy potato chips.', weight: '30g', type: 'Veg' },
        { name: 'Kurkure Masala Munch', price: 10, category: 'Snacks & Namkeen', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Kurkure+₹10', description: 'Spicy, crunchy corn puffs.', weight: '35g', type: 'Veg' },
        { name: 'Bingo Chips', price: 10, category: 'Snacks & Namkeen', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Bingo+₹10', description: 'Mad angles and potato chips.', weight: '30g', type: 'Veg' },
        { name: 'Haldiram\'s Bhujia', price: 10, category: 'Snacks & Namkeen', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Haldiram+Bhujia', description: 'Spicy, crispy gram flour noodles.', weight: '40g', type: 'Veg' },
        { name: 'Balaji Wafers', price: 10, category: 'Snacks & Namkeen', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Balaji+Wafers', description: 'Crunchy potato wafers.', weight: '35g', type: 'Veg' },
        { name: 'Popcorn', price: 15, category: 'Snacks & Namkeen', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Popcorn', description: 'Ready to eat caramel/cheese popcorn.', weight: '50g', type: 'Veg' },
        { name: 'Mixture', price: 20, category: 'Snacks & Namkeen', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Mixture', description: 'Spicy and tangy namkeen mixture.', weight: '100g', type: 'Veg' },

        // Instant Foods
        { name: 'Maggi Noodles', price: 14, category: 'Instant Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Maggi+₹14', description: '2-minute instant noodles.', weight: '70g', type: 'Veg' },
        { name: 'Yippee Noodles', price: 12, category: 'Instant Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Yippee+₹12', description: 'Long, non-sticky instant noodles.', weight: '65g', type: 'Veg' },
        { name: 'Knorr Soups', price: 15, category: 'Instant Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Knorr+Soup', description: 'Thick, delicious instant soup.', weight: '50g', type: 'Veg' },
        { name: 'Pasta', price: 25, category: 'Instant Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Pasta', description: 'Instant macaroni and penne.', weight: '200g', type: 'Veg' },
        { name: 'Oats', price: 30, category: 'Instant Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Oats', description: 'Healthy rolled oats for breakfast.', weight: '250g', type: 'Veg' },
        { name: 'Ready Poha', price: 20, category: 'Instant Foods', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Ready+Poha', description: 'Instant flattened rice breakfast.', weight: '100g', type: 'Veg' },

        // Sauces & Spreads
        { name: 'Kissan Jam', price: 50, category: 'Sauces & Spreads', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Kissan+Jam', description: 'Mixed fruit jam.', weight: '200g', type: 'Veg' },
        { name: 'Kissan Ketchup', price: 40, category: 'Sauces & Spreads', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Kissan+Ketchup', description: 'Sweet and tangy tomato ketchup.', weight: '250g', type: 'Veg' },
        { name: 'Veeba Mayo', price: 60, category: 'Sauces & Spreads', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Veeba+Mayo', description: 'Creamy and thick eggless mayonnaise.', weight: '250g', type: 'Veg' },
        { name: 'Dr. Oetker Spreads', price: 75, category: 'Sauces & Spreads', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Dr+Oetker', description: 'Delicious sandwich spreads.', weight: '250g', type: 'Veg' },
        { name: 'Honey', price: 80, category: 'Sauces & Spreads', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Honey', description: '100% pure natural honey.', weight: '250g', type: 'Veg' },
        { name: 'Peanut Butter', price: 100, category: 'Sauces & Spreads', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Peanut+Butter', description: 'Crunchy and creamy peanut butter.', weight: '300g', type: 'Veg' },
        { name: 'Chutney', price: 35, category: 'Sauces & Spreads', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Chutney', description: 'Spicy mint and coriander chutney.', weight: '200g', type: 'Veg' },

        // Dairy & Drinks
        { name: 'Amul Milk', price: 30, category: 'Dairy & Drinks', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Amul+Milk', description: 'Fresh, pasteurized milk.', weight: '500ml', type: 'Veg' },
        { name: 'Amul Butter', price: 50, category: 'Dairy & Drinks', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Amul+Butter', description: 'Utterly butterly delicious.', weight: '100g', type: 'Veg' },
        { name: 'Mother Dairy Curd', price: 35, category: 'Dairy & Drinks', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Mother+Dairy+Curd', description: 'Thick and tasty fresh curd.', weight: '400g', type: 'Veg' },
        { name: 'Nestlé Milk Powder', price: 40, category: 'Dairy & Drinks', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Milk+Powder', description: 'Everyday dairy whitener.', weight: '100g', type: 'Veg' },
        { name: 'Coca-Cola', price: 40, category: 'Dairy & Drinks', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Coca-Cola', description: 'Refreshing cola soft drink.', weight: '750ml', type: 'Veg' },
        { name: 'Pepsi', price: 40, category: 'Dairy & Drinks', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Pepsi', description: 'Chilled Pepsi soft drink.', weight: '750ml', type: 'Veg' },
        { name: 'Frooti', price: 20, category: 'Dairy & Drinks', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Frooti+₹20', description: 'Delicious mango juice drink.', weight: '150ml', type: 'Veg' },

        // Chocolates & Kids Items
        { name: 'Cadbury Dairy Milk', price: 20, category: 'Chocolates & Kids Items', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Dairy+Milk', description: 'Classic milk chocolate.', weight: '24g', type: 'Veg' },
        { name: 'Nestlé KitKat', price: 25, category: 'Chocolates & Kids Items', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=KitKat', description: 'Crisp wafer covered in chocolate.', weight: '27.5g', type: 'Veg' },
        { name: 'Ferrero Rocher', price: 150, category: 'Chocolates & Kids Items', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Ferrero+Rocher', description: 'Premium hazelnut chocolates.', weight: '50g', type: 'Veg' },
        { name: 'Candies', price: 5, category: 'Chocolates & Kids Items', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Candies+₹5', description: 'Assorted fruit candies.', weight: '10 pcs', type: 'Veg' },
        { name: 'Lollipops', price: 10, category: 'Chocolates & Kids Items', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Lollipops', description: 'Fun and sweet lollipops.', weight: '2 pcs', type: 'Veg' },

        // Personal Care
        { name: 'Lifebuoy Soap', price: 10, category: 'Personal Care', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Lifebuoy+₹10', description: 'Antibacterial bathing soap.', weight: '50g', type: 'Personal Care' },
        { name: 'Lux Beauty Soap', price: 25, category: 'Personal Care', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Lux+Soap', description: 'Soft and fragrant beauty soap.', weight: '100g', type: 'Personal Care' },
        { name: 'Dove Shampoo', price: 80, category: 'Personal Care', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Dove+Shampoo', description: 'Nourishing shampoo for soft hair.', weight: '180ml', type: 'Personal Care' },
        { name: 'Clinic Plus Shampoo', price: 60, category: 'Personal Care', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Clinic+Plus', description: 'Strong and long health shampoo.', weight: '150ml', type: 'Personal Care' },

        // Cleaning & Household
        { name: 'Surf Excel', price: 10, category: 'Cleaning & Household', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Surf+Excel+₹10', description: 'Washing powder for tough stains.', weight: '80g', type: 'Household' },
        { name: 'Ariel Liquid Detergent', price: 120, category: 'Cleaning & Household', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Ariel+Liquid', description: 'Premium liquid detergent for machines.', weight: '500ml', type: 'Household' },
        { name: 'Vim Dish Bar', price: 15, category: 'Cleaning & Household', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Vim+Bar', description: 'Lemon powered dishwashing bar.', weight: '150g', type: 'Household' },
        { name: 'Harpic Toilet Cleaner', price: 45, category: 'Cleaning & Household', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Harpic', description: 'Powerful toilet bowl cleaner.', weight: '200ml', type: 'Household' },

        // Extra Selling Boosters
        { name: 'Kwality Walls Ice Cream', price: 40, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Ice+Cream', description: 'Delicious vanilla/chocolate ice cream.', weight: '100ml', type: 'Veg' },
        { name: 'Britannia Bread', price: 30, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Bread', description: 'Freshly baked white bread.', weight: '400g', type: 'Veg' },
        { name: 'Farm Fresh Eggs (6 pcs)', price: 40, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Eggs', description: 'Fresh, healthy poultry eggs.', weight: '6 pcs', type: 'Non-Veg' },
        { name: 'Local Samosa Snacks', price: 15, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Samosa', description: 'Hot and crispy local snacks.', weight: '2 pcs', type: 'Veg' },
        { name: 'Center Fresh Gum', price: 1, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Center+Fresh', description: 'Refreshing liquid-filled chewing gum.', weight: '1 pc', type: 'Veg' },
        { name: 'Red Bull Energy Drink', price: 125, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Red+Bull', description: 'Energy drink that gives you wings.', weight: '250ml', type: 'Veg' },
        { name: 'Sting Energy', price: 20, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Sting', description: 'Caffeinated energy drink.', weight: '250ml', type: 'Veg' },
        { name: 'Eveready AA Batteries', price: 40, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Batteries', description: 'Long-lasting carbon zinc batteries.', weight: '4 pcs', type: 'Household' },
        { name: 'Good Knight Refill', price: 75, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Good+Knight', description: 'Liquid mosquito repellent refill.', weight: '45ml', type: 'Household' },
        { name: 'Matchboxes', price: 5, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Matchbox', description: 'Quality safety matches.', weight: '5 pcs', type: 'Household' },
        { name: 'Amul Kool Cafe', price: 30, category: 'Extra Selling Boosters', image: 'https://placehold.co/400x300/E8F1F8/2A5C82?text=Amul+Kool', description: 'Refreshing cold coffee drink.', weight: '200ml', type: 'Veg' }
    ];

    // Category Filtering
    let currentCategory = null;
    const categoryCards = document.querySelectorAll('.category-card');
    const showAllBtn = document.getElementById('show-all-btn');
    const productSectionTitle = document.getElementById('product-section-title');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            currentCategory = card.getAttribute('data-category');
            if (productSectionTitle) productSectionTitle.textContent = currentCategory + ' Products';
            if (showAllBtn) showAllBtn.style.display = 'block';
            
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            renderProducts();
        });
    });

    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            currentCategory = null;
            categoryCards.forEach(c => c.classList.remove('active'));
            if (productSectionTitle) productSectionTitle.textContent = 'Featured Products';
            showAllBtn.style.display = 'none';
            renderProducts();
        });
    }

    const renderProducts = () => {
        if (!productContainer) return;
        productContainer.innerHTML = '';
        
        const filteredProducts = currentCategory ? products.filter(p => p.category === currentCategory) : products;
        
        if (filteredProducts.length === 0) {
            productContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: gray; font-size: 1.2rem; padding: 40px 0;">No products found in this category.</p>';
            return;
        }

        filteredProducts.forEach((product) => {
            const isWishlisted = wishlist.find(item => item.name === product.name);
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" title="Add to Wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
                </div>
            `;
            productContainer.appendChild(productCard);
        });
    };

    renderProducts();

    // Product Details Modal Logic
    if (closePdBtn && pdModal) {
        closePdBtn.addEventListener('click', () => pdModal.classList.remove('active'));
        pdModal.addEventListener('click', (e) => {
            if (e.target === pdModal) pdModal.classList.remove('active');
        });
    }

    const openProductDetails = (productName) => {
        const product = products.find(p => p.name === productName);
        if (!product || !pdModal) return;
        
        currentProductDetails = product;
        pdImage.src = product.image;
        pdName.textContent = product.name;
        pdPrice.textContent = `₹${product.price.toFixed(2)}`;
        pdDesc.textContent = product.description;
        
        const pdWeight = document.getElementById('pd-weight');
        const pdType = document.getElementById('pd-type');
        if (pdWeight) pdWeight.textContent = 'Weight: ' + (product.weight || '-');
        if (pdType) pdType.textContent = 'Type: ' + (product.type || '-');
        
        if (wishlist.find(item => item.name === product.name)) {
            pdWishlistBtn.style.backgroundColor = 'var(--primary-pink)';
        } else {
            pdWishlistBtn.style.backgroundColor = 'white';
        }
        
        pdModal.classList.add('active');
    };

    if (pdAddToCartBtn) {
        pdAddToCartBtn.addEventListener('click', () => {
            if (!currentProductDetails) return;
            const existingItem = cart.find(item => item.name === currentProductDetails.name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: currentProductDetails.name, price: currentProductDetails.price, image: currentProductDetails.image, quantity: 1 });
            }
            updateCart();
            
            const originalText = pdAddToCartBtn.textContent;
            pdAddToCartBtn.textContent = 'Added!';
            pdAddToCartBtn.style.backgroundColor = 'var(--primary-pink)';
            pdAddToCartBtn.style.color = 'var(--text-dark)';
            setTimeout(() => {
                pdAddToCartBtn.textContent = originalText;
                pdAddToCartBtn.style.backgroundColor = '';
                pdAddToCartBtn.style.color = '';
            }, 1000);
        });
    }

    if (pdWishlistBtn) {
        pdWishlistBtn.addEventListener('click', () => {
            if (!currentProductDetails) return;
            const existingIndex = wishlist.findIndex(item => item.name === currentProductDetails.name);
            if (existingIndex > -1) {
                wishlist.splice(existingIndex, 1);
                pdWishlistBtn.style.backgroundColor = 'white';
            } else {
                wishlist.push({ name: currentProductDetails.name, price: currentProductDetails.price, image: currentProductDetails.image });
                pdWishlistBtn.style.backgroundColor = 'var(--primary-pink)';
            }
            updateWishlist();
        });
    }

    if (productContainer) {
        productContainer.addEventListener('click', (e) => {
            const addBtn = e.target.closest('.add-to-cart-btn');
            const wishBtn = e.target.closest('.wishlist-btn');

            if (e.target.closest('img') || e.target.closest('h3')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productName = productCard.querySelector('h3').textContent;
                    openProductDetails(productName);
                }
                return;
            }

            if (addBtn) {
                const name = addBtn.getAttribute('data-name');
                const price = parseFloat(addBtn.getAttribute('data-price'));
                const image = addBtn.getAttribute('data-image');

                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ name, price, image, quantity: 1 });
                }
                updateCart();

                const originalText = addBtn.textContent;
                addBtn.textContent = 'Added!';
                addBtn.style.backgroundColor = 'var(--primary-pink)';
                addBtn.style.color = 'var(--text-dark)';
                addBtn.style.borderColor = 'var(--primary-pink)';

                setTimeout(() => {
                    addBtn.textContent = originalText;
                    addBtn.style.backgroundColor = '';
                    addBtn.style.color = '';
                    addBtn.style.borderColor = '';
                }, 1000);
            }

            if (wishBtn) {
                const name = wishBtn.getAttribute('data-name');
                const price = parseFloat(wishBtn.getAttribute('data-price'));
                const image = wishBtn.getAttribute('data-image');

                const existingIndex = wishlist.findIndex(item => item.name === name);
                if (existingIndex > -1) {
                    wishlist.splice(existingIndex, 1);
                } else {
                    wishlist.push({ name, price, image });
                }
                updateWishlist();
            }
        });
    }

    // Wishlist Modal controls
    if (wishlistIcon && wishlistModal) {
        wishlistIcon.addEventListener('click', () => {
            wishlistModal.classList.add('active');
        });

        closeWishlistBtn.addEventListener('click', () => {
            wishlistModal.classList.remove('active');
        });

        wishlistModal.addEventListener('click', (e) => {
            if (e.target === wishlistModal) {
                wishlistModal.classList.remove('active');
            }
        });
    }

    updateWishlist();

    // Modal controls
    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('active');
        });

        closeCartBtn.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        // Close modal when clicking outside
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }

});
