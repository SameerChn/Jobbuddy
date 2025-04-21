document.addEventListener('DOMContentLoaded', function() {
    // Form submission handling
    const joinForm = document.querySelector('.join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.querySelector('.form-input').value;
            const role = document.querySelector('input[name="role"]:checked')?.value;
            
            if (email && role) {
                // In a real app, you would send this data to your backend
                alert(`Thanks for joining our waitlist as a ${role === 'job_seeker' ? 'Job Seeker' : 'Employer'}! We'll contact you at ${email} when we launch.`);
                joinForm.reset();
            } else {
                alert('Please enter your email and select a role');
            }
        });
    }

    // Search functionality
    const searchBar = document.querySelector('#search-bar');
    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                alert(`Searching for: ${this.value}`);
                this.value = '';
            }
        });
    }

    // Login button functionality - UPDATED TO REDIRECT TO SIGNIN.HTML
    const loginButton = document.querySelector('.LOGO-buttons button');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            // Redirect to signin page
            window.location.href = 'signin.html';
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});