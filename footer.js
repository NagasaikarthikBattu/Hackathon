export function renderFooter(container) {
    container.innerHTML = `
        <div class="container mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
            <div>
                <h3 class="text-xl font-bold mb-4">ReWear</h3>
                <p class="text-gray-400">Sustainable fashion for everyone. Join our community and give your clothes a second life.</p>
            </div>
            <div>
                <h4 class="font-semibold text-lg mb-4">Quick Links</h4>
                <ul class="space-y-2">
                    <li><a href="index.html" class="text-gray-400 hover:text-white">Home</a></li>
                    <li><a href="browse.html" class="text-gray-400 hover:text-white">Browse</a></li>
                    <li><a href="login.html" class="text-gray-400 hover:text-white">Login</a></li>
                    <li><a href="register.html" class="text-gray-400 hover:text-white">Sign Up</a></li>
                </ul>
            </div>
             <div>
                <h4 class="font-semibold text-lg mb-4">Support</h4>
                <ul class="space-y-2">
                    <li><a href="#" class="text-gray-400 hover:text-white">FAQ</a></li>
                    <li><a href="#" class="text-gray-400 hover:text-white">Contact Us</a></li>
                    <li><a href="#" class="text-gray-400 hover:text-white">Terms of Service</a></li>
                    <li><a href="#" class="text-gray-400 hover:text-white">Privacy Policy</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold text-lg mb-4">Follow Us</h4>
                <div class="flex space-x-4">
                    <a href="#" class="text-gray-400 hover:text-white"><i data-lucide="facebook" class="w-6 h-6"></i></a>
                    <a href="#" class="text-gray-400 hover:text-white"><i data-lucide="instagram" class="w-6 h-6"></i></a>
                    <a href="#" class="text-gray-400 hover:text-white"><i data-lucide="twitter" class="w-6 h-6"></i></a>
                </div>
            </div>
        </div>
        <div class="bg-gray-900 py-4 text-center text-gray-500 text-sm">
            <p>&copy; 2025 ReWear. All Rights Reserved. Built with a passion for sustainable style.</p>
        </div>
    `;
    lucide.createIcons();
}
