document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    const showFeedback = (message, type) => {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            alert(message);
        }
    };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-address').value;
            let redirectUrl = 'dashboard.html';
            let message = 'Login successful! Redirecting...';
            let user;

            if (email === "john.doe@example.com") {
                user = { id: 1, username: 'johndoe', email: 'john.doe@example.com' };
            } else if (email === "admin@rewear.com") {
                user = { id: 0, username: 'admin', email: 'admin@rewear.com', isAdmin: true };
                redirectUrl = 'admin.html';
                message = 'Admin login successful! Redirecting...';
            } else {
                user = { id: 2, username: 'newuser', email: email };
            }
            
            localStorage.setItem('rewear-user', JSON.stringify(user));
            showFeedback(message, 'success');
            setTimeout(() => window.location.href = redirectUrl, 1500);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email-address').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                showFeedback('Passwords do not match.', 'error');
                return;
            }

            const mockUser = { id: Date.now(), username, email };
            localStorage.setItem('rewear-user', JSON.stringify(mockUser));
            showFeedback('Registration successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1500);
        });
    }
});
