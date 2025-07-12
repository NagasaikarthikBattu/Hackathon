document.addEventListener('DOMContentLoaded', async () => {
    const itemDetailContainer = document.getElementById('item-detail-container');
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'));

    if (!itemId) {
        itemDetailContainer.innerHTML = '<p class=\"text-center text-red-500\">No item ID provided.</p>';
        return;
    }

    try {
        const response = await fetch('data/items.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const items = await response.json();
        const item = items.find(i => i.id === itemId);

        if (!item) {
            itemDetailContainer.innerHTML = '<p class=\"text-center text-red-500\">Item not found.</p>';
            return;
        }

        const userResponse = await fetch('data/users.json');
        if (!userResponse.ok) throw new Error('Could not fetch user data');
        const users = await userResponse.json();
        const uploader = users.find(u => u.id === item.userId);

        itemDetailContainer.innerHTML = `
            <div class="grid md:grid-cols-2 gap-12">
                <!-- Image Gallery -->
                <div>
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
                        <img id="main-image" src="${item.images[0]}" alt="${item.title}" class="w-full h-96 object-cover">
                    </div>
                    <div class="grid grid-cols-5 gap-2">
                        ${item.images.map((img, index) => `
                            <img src="${img}" alt="Thumbnail ${index+1}" class="thumbnail-image w-full h-20 object-cover rounded-md cursor-pointer border-2 ${index === 0 ? 'border-[#4CAF50]' : 'border-transparent'}" data-src="${img}">
                        `).join('')}
                    </div>
                </div>

                <!-- Information Panel -->
                <div class="flex flex-col">
                    <h1 class="text-4xl font-bold mb-4">${item.title}</h1>
                    
                    ${uploader ? `
                    <div class="flex items-center gap-3 mb-6 text-sm text-gray-600">
                        <img src="${uploader.avatar}" alt="${uploader.username}" class="w-10 h-10 rounded-full">
                        <span>Listed by <span class="font-semibold text-gray-800">${uploader.username}</span></span>
                    </div>
                    ` : ''}

                    <div class="prose max-w-none mb-6">
                        <p>${item.description}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <div class="bg-white p-3 rounded-lg shadow-sm"><strong>Category:</strong> <span class="text-gray-600">${item.category}</span></div>
                        <div class="bg-white p-3 rounded-lg shadow-sm"><strong>Size:</strong> <span class="text-gray-600">${item.size}</span></div>
                        <div class="bg-white p-3 rounded-lg shadow-sm"><strong>Condition:</strong> <span class="text-gray-600">${item.condition}</span></div>
                        <div class="bg-white p-3 rounded-lg shadow-sm"><strong>Status:</strong> <span class="font-semibold text-green-600">Available</span></div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="mt-auto pt-6 border-t flex flex-col sm:flex-row gap-4">
                        <button id="request-swap-btn" class="w-full bg-[#4CAF50] text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2">
                            <i data-lucide="repeat"></i> Request Swap
                        </button>
                        ${item.points ? `
                        <button id="redeem-points-btn" class="w-full bg-green-100 text-[#4CAF50] font-bold py-3 px-6 rounded-lg hover:bg-green-200 transition duration-300 flex items-center justify-center gap-2">
                            <i data-lucide="gem"></i> Redeem with ${item.points} Points
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        lucide.createIcons();
        setupImageGallery();
        setupModalButtons(item);

    } catch (error) {
        console.error('Failed to load item details:', error);
        itemDetailContainer.innerHTML = `<p class="text-center text-red-500">Error: ${error.message}</p>`;
    }
});

function setupImageGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail-image');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.dataset.src;
            thumbnails.forEach(t => t.classList.remove('border-[#4CAF50]'));
            thumb.classList.add('border-[#4CAF50]');
        });
    });
}

function setupModalButtons(item) {
    const requestSwapBtn = document.getElementById('request-swap-btn');
    const redeemPointsBtn = document.getElementById('redeem-points-btn');

    const swapModal = document.getElementById('swap-modal');
    const redeemModal = document.getElementById('redeem-modal');

    const closeSwapModalBtn = document.getElementById('close-swap-modal');
    const closeRedeemModalBtn = document.getElementById('close-redeem-modal');

    const confirmSwapBtn = document.getElementById('confirm-swap-btn');
    const confirmRedeemBtn = document.getElementById('confirm-redeem-btn');

    const showModal = (modal) => {
        modal.classList.remove('hidden');
        lucide.createIcons();
    };

    const hideModal = (modal) => {
        modal.classList.add('hidden');
    };

    if (requestSwapBtn) {
        requestSwapBtn.addEventListener('click', async () => {
            const swapModalText = document.getElementById('swap-modal-text');
            swapModalText.textContent = `You are requesting a swap for \"${item.title}\". Please select an item you wish to offer in exchange.`;
            

            const currentUserId = 1; 
            try {
                const userItemsResponse = await fetch('data/items.json');
                const allItems = await userItemsResponse.json();
                const userItems = allItems.filter(i => i.userId === currentUserId && i.id !== item.id);
                
                const dropdown = document.getElementById('user-items-dropdown');
                if (userItems.length > 0) {
                    dropdown.innerHTML = userItems.map(userItem => `<option value="${userItem.id}">${userItem.title}</option>`).join('');
                    confirmSwapBtn.disabled = false;
                } else {
                    dropdown.innerHTML = '<option disabled selected>You have no other items to swap.</option>';
                    confirmSwapBtn.disabled = true;
                }
            } catch (error) {
                console.error("Failed to fetch user items for swap:", error);
                const dropdown = document.getElementById('user-items-dropdown');
                dropdown.innerHTML = '<option disabled selected>Could not load your items.</option>';
                confirmSwapBtn.disabled = true;
            }
            showModal(swapModal);
        });
    }

    if (redeemPointsBtn) {
        redeemPointsBtn.addEventListener('click', () => {
            const redeemModalText = document.getElementById('redeem-modal-text');
            redeemModalText.textContent = `You are about to add "${item.title}" to your cart for ${item.points} points.`;
            showModal(redeemModal);
        });
    }

    closeSwapModalBtn.addEventListener('click', () => hideModal(swapModal));
    closeRedeemModalBtn.addEventListener('click', () => hideModal(redeemModal));

    swapModal.addEventListener('click', (e) => {
        if (e.target === swapModal) hideModal(swapModal);
    });
    redeemModal.addEventListener('click', (e) => {
        if (e.target === redeemModal) hideModal(redeemModal);
    });

    confirmSwapBtn.addEventListener('click', () => {
        hideModal(swapModal);
        if (window.showToast) {
            window.showToast('Swap request sent successfully!', 'success');
        } else {
            alert('Swap request sent successfully!');
        }
    });

    confirmRedeemBtn.addEventListener('click', () => {
        hideModal(redeemModal);
        let cart = JSON.parse(localStorage.getItem('rewear-cart')) || [];
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            if (window.showToast) {
                window.showToast('Item is already in your cart.', 'info');
            } else {
                alert('Item is already in your cart.');
            }
        } else {
            cart.push({ id: item.id, quantity: 1 });
            localStorage.setItem('rewear-cart', JSON.stringify(cart));
            if (window.showToast) {
                window.showToast(`"${item.title}" added to cart!`, 'success');
            } else {
                alert(`"${item.title}" added to cart!`);
            }
        }
    });
}
