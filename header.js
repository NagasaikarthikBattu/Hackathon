async function doRenderHeader(container) {
    const loggedInUser = JSON.parse(localStorage.getItem('rewear-user'));
    const cart = JSON.parse(localStorage.getItem('rewear-cart')) || [];
    
    let userPoints = null;
    let userDetails = null;

    if (loggedInUser) {
        try {
            const usersResponse = await fetch('data/users.json');
            if (!usersResponse.ok) throw new Error('Failed to fetch users');
            const users = await usersResponse.json();
            userDetails = users.find(u => u.id === loggedInUser.id);
            if (userDetails) {
                userPoints = userDetails.points;
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }
    
    let navLinks;
    let mobileNavLinks;

    if (loggedInUser && userDetails) {
        const cartItemCount = cart.length;
        const cartBadge = cartItemCount > 0 
            ? `<span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">${cartItemCount}</span>` 
            : '';

        const cartIconWithBadge = `
            <a href="cart.html" class="relative text-gray-600 hover:text-[#4CAF50] transition-colors">
                <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                ${cartBadge}
            </a>`;

        navLinks = `
            <a href="index.html" class="text-gray-600 hover:text-[#4CAF50] transition-colors">Home</a>
            <a href="browse.html" class="text-gray-600 hover:text-[#4CAF50] transition-colors">Browse</a>
            <a href="add_item.html" class="text-gray-600 hover:text-[#4CAF50] transition-colors">List an Item</a>
            <span class="text-gray-600">Points: ${userPoints !== null ? userPoints.toLocaleString() : '...'}</span>
            ${cartIconWithBadge}
            <div class="relative group">
                <button class="flex items-center gap-2 text-gray-600 hover:text-[#4CAF50]">
                    <img src="${userDetails.avatar || `https://i.pravatar.cc/40?u=${userDetails.id}`}" class="w-8 h-8 rounded-full border-2 border-gray-300 group-hover:border-[#4CAF50] transition-colors">
                    <span>${userDetails.username}</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 transition-transform group-hover:rotate-180"></i>
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible">
                    ${userDetails.isAdmin ? `<a href="admin.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100\">Admin Panel</a>` : ''}
                    <a href="dashboard.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                    <a href="#" id="logout-btn" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                </div>
            </div>
        `;

        mobileNavLinks = `
            <a href="index.html" class="block py-2 text-center w-full text-gray-600 hover:text-[#4CAF50] transition-colors\">Home</a>
            <a href="browse.html" class="block py-2 text-center w-full text-gray-600 hover:text-[#4CAF50] transition-colors\">Browse</a>
            <a href="add_item.html" class="block py-2 text-center w-full text-gray-600 hover:text-[#4CAF50] transition-colors\">List an Item</a>
            <div class="w-full border-t border-gray-200 my-2"></div>
            <span class="block py-2 text-center w-full text-gray-600">Points: ${userPoints !== null ? userPoints.toLocaleString() : '...'}</span>
            <a href="cart.html" class="block py-2 text-center w-full text-gray-600 hover:text-[#4CAF50] transition-colors flex items-center justify-center gap-2">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                <span>Cart ${cartItemCount > 0 ? `(${cartItemCount})` : ''}</span>
            </a>
            <a href="dashboard.html" class="block py-2 text-center w-full text-gray-600 hover:text-[#4CAF50] transition-colors\">Dashboard</a>
            ${userDetails.isAdmin ? `<a href="admin.html" class="block py-2 text-center w-full text-gray-600 hover:text-[#4CAF50] transition-colors\">Admin Panel</a>` : ''}
            <div class="w-full border-t border-gray-200 my-2"></div>
            <a href="#" id="logout-btn-mobile" class="block py-2 text-center w-full text-gray-600 hover:text-[#4CAF50] transition-colors\">Logout</a>
        `;

    } else {
        navLinks = `
            <a href="index.html" class="text-gray-600 hover:text-[#4CAF50] transition-colors\">Home</a>
            <a href="browse.html" class="text-gray-600 hover:text-[#4CAF50] transition-colors\">Browse</a>
            <a href="login.html" class="text-gray-600 hover:text-[#4CAF50] transition-colors\">Login</a>
            <a href="register.html" class="ml-4 bg-[#4CAF50] text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors\">Sign Up</a>
        `;

        mobileNavLinks = `
            <a href="index.html" class="block py-2 text-center w-full text-gray-600 hover:text-[#4CAF50] transition-colors\">Home</a>
            <a href="browse.html" class="block py-2 text-center w-full text-gray-600 hover:text-[#4CAF50] transition-colors\">Browse</a>
            <a href="login.html" class="block py-2 text-center w-full text-gray-600 hover:text-[#4CAF50] transition-colors\">Login</a>
            <a href="register.html" class="block w-full text-center mt-2 bg-[#4CAF50] text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors\">Sign Up</a>
        `;
    }

    container.innerHTML = `
        <div class="container mx-auto px-6 py-3 flex justify-between items-center">
            <a href="index.html" class="text-2xl font-bold text-[#4CAF50]">ReWear</a>
            <div class="hidden md:flex items-center gap-6 font-medium">
                ${navLinks}
            </div>
            <div class="md:hidden">
                <button id="mobile-menu-button" aria-controls="mobile-menu" aria-expanded="false">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                </button>
            </div>
        </div>
        <div id="mobile-menu" class="hidden md:hidden bg-white/95 backdrop-blur-lg px-6 pb-4 flex flex-col items-center gap-1 w-full">
             ${mobileNavLinks}
        </div>
    `;

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('rewear-user');
        window.location.href = 'index.html';
    };

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    const logoutBtnMobile = document.getElementById('logout-btn-mobile');
    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', logout);
    }

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if(mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded));
        });
    }

    lucide.createIcons();
}

export function renderHeader(container) {
    doRenderHeader(container);
}

window.addEventListener('cartUpdated', () => {
    const headerContainer = document.getElementById('main-header');
    if (headerContainer) {
        renderHeader(headerContainer);
    }
});
