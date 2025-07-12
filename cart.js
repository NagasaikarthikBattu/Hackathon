document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    const subtotalEl = document.getElementById('subtotal-points');
    const totalEl = document.getElementById('total-points');
    const checkoutBtn = document.getElementById('checkout-btn');

    let allItems = [];
    let cart = JSON.parse(localStorage.getItem('rewear-cart')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('rewear-user'));
    let currentUserData = null;

    const fetchAllData = async () => {
        try {
            const [itemsResponse, usersResponse] = await Promise.all([
                fetch('data/items.json'),
                loggedInUser ? fetch('data/users.json') : Promise.resolve(null)
            ]);

            if (!itemsResponse.ok) throw new Error('Network response for items was not ok');
            allItems = await itemsResponse.json();

            if (usersResponse && usersResponse.ok) {
                const users = await usersResponse.json();
                currentUserData = users.find(u => u.id === loggedInUser.id);
            }
        } catch (error) {
            console.error('Failed to load initial data:', error);
            cartItemsContainer.innerHTML = '<p class="text-red-500">Could not load page data. Please try again later.</p>';
        }
    };

    const renderCart = () => {
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartItemsContainer.classList.add('hidden');
            cartSummaryContainer.classList.add('hidden');
            return;
        }
        
        emptyCartMessage.classList.add('hidden');
        cartItemsContainer.classList.remove('hidden');
        cartSummaryContainer.classList.remove('hidden');

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach(cartItem => {
            const item = allItems.find(i => i.id === cartItem.id);
            if (!item) return;

            const itemTotalPrice = item.points * cartItem.quantity;
            subtotal += itemTotalPrice;

            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center gap-4 pb-6 border-b last:border-b-0 animate-scale-in';
            itemElement.innerHTML = `
                <img src="${item.images[0]}" alt="${item.title}" class="w-24 h-24 object-cover rounded-md">
                <div class="flex-grow">
                    <h3 class="font-semibold text-lg">${item.title}</h3>
                    <p class="text-sm text-gray-500">Size: ${item.size}</p>
                    <p class="text-green-600 font-medium mt-1">${item.points} Points</p>
                </div>
                <div class="flex items-center gap-3">
                    <input type="number" value="${cartItem.quantity}" min="1" max="1" class="w-14 text-center border rounded-md p-1 focus:ring-2 focus:ring-green-500 focus:border-green-500" data-id="${item.id}" readonly>
                </div>
                <div class="text-right">
                    <p class="font-semibold">${itemTotalPrice} Points</p>
                </div>
                <button class="remove-item-btn text-gray-400 hover:text-red-500 transition-colors" data-id="${item.id}">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        subtotalEl.textContent = `${subtotal} Points`;
        totalEl.textContent = `${subtotal} Points`;

        const hasSufficientPoints = currentUserData ? currentUserData.points >= subtotal : false;
        
        checkoutBtn.disabled = cart.length === 0 || !hasSufficientPoints;

        let feedbackEl = document.getElementById('checkout-feedback');
        if (!feedbackEl) {
            feedbackEl = document.createElement('p');
            feedbackEl.id = 'checkout-feedback';
            feedbackEl.className = 'text-red-500 text-sm mt-3 text-center font-medium';
            checkoutBtn.insertAdjacentElement('afterend', feedbackEl);
        }

        if (cart.length > 0 && !hasSufficientPoints) {
            feedbackEl.textContent = "Insufficient points to proceed.";
        } else {
            feedbackEl.textContent = "";
        }


        lucide.createIcons();
        addEventListeners();
    };

    const addEventListeners = () => {
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.currentTarget.getAttribute('data-id'));
                removeItem(itemId);
            });
        });
    };

    const removeItem = (itemId) => {
        cart = cart.filter(item => item.id !== itemId);
        updateCartStorage();
        renderCart();
        if(window.showToast) {
            window.showToast('Item removed from cart.', 'info');
        }
    };

    const updateCartStorage = () => {
        localStorage.setItem('rewear-cart', JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    await fetchAllData();
    renderCart();
});
