document.addEventListener('DOMContentLoaded', function() {
    // Get all elements
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToSignin = document.getElementById('switch-to-signin');

    // API URL
    const API_URL = 'http://localhost:3001/api';

    // Function to switch tabs
    function switchTab(tab) {
        signinTab.classList.remove('active');
        signupTab.classList.remove('active');
        signinForm.classList.remove('active');
        signupForm.classList.remove('active');

        if (tab === 'signin') {
            signinTab.classList.add('active');
            signinForm.classList.add('active');
        } else {
            signupTab.classList.add('active');
            signupForm.classList.add('active');
        }
    }

    // Event listeners for tabs
    signupTab.addEventListener('click', function(e) {
        e.preventDefault();
        switchTab('signup');
    });

    switchToSignup.addEventListener('click', function(e) {
        e.preventDefault();
        switchTab('signup');
    });

    signinTab.addEventListener('click', function(e) {
        e.preventDefault();
        switchTab('signin');
    });

    switchToSignin.addEventListener('click', function(e) {
        e.preventDefault();
        switchTab('signin');
    });

    // Handle user registration
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        let firstName = document.getElementById('first-name').value.trim();
        let lastName = document.getElementById('last-name').value.trim();
        let email = document.getElementById('signup-email').value.trim();
        let password = document.getElementById('signup-password').value.trim();
        let confirmPassword = document.getElementById('confirm-password').value.trim();
        let role = document.querySelector('input[name="role"]:checked')?.value || 'job_seeker';

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            // Call the API to register the user
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Save token to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('Account created successfully! You are now logged in.');
            signupForm.reset();
            
            // Redirect based on role
            if (data.user.role === 'employer') {
                window.location.href = 'post.html';
            } else {
                window.location.href = 'seeker.html';
            }
        } catch (error) {
            alert(error.message);
        }
    });

    // Handle user login
    signinForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        let email = document.getElementById('email').value.trim();
        let password = document.getElementById('password').value.trim();

        try {
            // Call the API to login the user
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save token to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert(`Welcome back, ${data.user.firstName}!`);
            signinForm.reset();
            
            // Redirect based on role
            if (data.user.role === 'employer') {
                window.location.href = 'post.html';
            } else {
                window.location.href = 'seeker.html';
            }
        } catch (error) {
            alert(error.message);
        }
    });

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user) {
        // Add logout button or user info if needed
        console.log('User is logged in:', user);
    }

    // Initialize with sign-in form active
    switchTab('signin');
});