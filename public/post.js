document.addEventListener('DOMContentLoaded', function () {
    // Add category change handler
document.getElementById('category').addEventListener('change', function() {
    const otherContainer = document.getElementById('otherCategoryContainer');
    if (this.value === 'other') {
        otherContainer.style.display = 'block';
    } else {
        otherContainer.style.display = 'none';
    }
});
    const jobForm = document.getElementById('jobPostForm');
    const saveDraftBtn = document.querySelector('.draft');
    const loginBtn = document.getElementById('login-btn');
    
    // API URL
    const API_URL = 'https://jobbuddy-r8nw.onrender.com/api';

    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user) {
        // If not logged in, redirect to signin page
        alert('Please log in to post a job');
        window.location.href = 'signin.html';
    }
    
    // Update login button to show user's name or logout
    if (loginBtn && user.firstName) {
        loginBtn.textContent = `Hi, ${user.firstName}`;
        loginBtn.addEventListener('click', function() {
            if (confirm('Do you want to log out?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            }
        });
    }

    if (jobForm) {
        // Form validation and job posting
        jobForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (validateForm()) {
                try {
                    const jobData = {
                        jobTitle: document.getElementById('jobTitle').value.trim(),
                        company: document.getElementById('companyName').value.trim(),
                        location: document.getElementById('jobLocation').value.trim(),
                        description: document.getElementById('jobDescription').value.trim(),
                        jobType: document.getElementById('jobType').value.trim(),
                        category: document.getElementById('category').value === 'other' 
                        ? document.getElementById('otherCategory').value.trim() 
                        : document.getElementById('category').value.trim(),                        payAmount: document.getElementById('payAmount').value.trim(),
                        payType: document.getElementById('payType').value.trim(),
                        skills: document.getElementById('skills').value.trim(),
                        email: document.getElementById('email').value.trim(),
                        phone: document.getElementById('phone').value.trim(),
                        companyName: document.getElementById('companyName').value.trim(),
                        website: document.getElementById('website').value.trim(),
                        logo: document.getElementById('logoUrl').value.trim(),

                    };
                    
                    // Call API to post job
                    const response = await fetch(`${API_URL}/jobs`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(jobData)
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to post job');
                    }
                    
                    alert('Job posted successfully!');
                    jobForm.reset();
                    
                    // Optional: Redirect to seeker page to see the job
                    window.location.href = 'seeker.html';
                } catch (error) {
                    alert(error.message);
                }
            }
        });

        // Save as draft functionality
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', function () {
                // Get form data
                const draftData = {
                    jobTitle: document.getElementById('jobTitle').value.trim(),
                    company: document.getElementById('companyName').value.trim(),
                    location: document.getElementById('jobLocation').value.trim(),
                    description: document.getElementById('jobDescription').value.trim(),
                    jobType: document.getElementById('jobType').value.trim(),
                    category: document.getElementById('category').value.trim(),
                    payAmount: document.getElementById('payAmount').value.trim(),
                    payType: document.getElementById('payType').value.trim(),
                    skills: document.getElementById('skills').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    companyName: document.getElementById('companyName').value.trim(),
                    website: document.getElementById('website').value.trim()
                };
                
                // Save to localStorage as draft
                let drafts = JSON.parse(localStorage.getItem('jobDrafts')) || [];
                drafts.push(draftData);
                localStorage.setItem('jobDrafts', JSON.stringify(drafts));
                
                alert('Job saved as draft!');
            });
        }
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = jobForm.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'red';
                isValid = false;

                // Remove red border when user starts typing
                field.addEventListener('input', function () {
                    if (this.value.trim()) {
                        this.style.borderColor = '#ccc';
                    }
                });
            }
        });

        const checkbox = document.getElementById('checkbox');
        if (checkbox && !checkbox.checked) {
            alert('Please agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }

        return isValid;
    }
});
// Update the Cloudinary widget configuration
document.getElementById("upload_widget").addEventListener("click", function() {
    cloudinary.createUploadWidget({
        cloudName: 'diik3wraf',
        uploadPreset: 'jobbuddy_preset',
        sources: ['local', 'url', 'camera'], // Add sources you want to allow
        cropping: false, // Set to true if you want cropping options
        multiple: false, // Only allow single file upload
        clientAllowedFormats: ['jpg', 'png', 'jpeg', 'gif'], // Allowed formats
        maxImageFileSize: 5000000, // 5MB limit
        theme: 'minimal' // UI theme
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            console.log('Upload result:', result);
            const imageInput = document.getElementById('logoUrl');
            const preview = document.getElementById('logoPreview');
            
            imageInput.value = result.info.secure_url;
            preview.src = result.info.secure_url;
            preview.style.display = 'block';
            
            // Also update the button text
            document.getElementById('upload_widget').textContent = 'Change Logo';
        }
    }).open();
});
