document.addEventListener('DOMContentLoaded', function () {
    const jobListContainer = document.getElementById('jobList');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-btn');
    const jobTitleFilter = document.querySelector('.filter-input');
    const locationFilter = document.querySelectorAll('.filter-select')[1]; // Second select element
    const categoryFilter = document.querySelectorAll('.filter-select')[0]; // First select element
    const searchJobsButton = document.querySelector('.btn-search');
    const loginButton = document.getElementById('login-btn');
    const signupButton = document.getElementById('signup-btn');

    // API URL
    const API_URL = 'http://localhost:3001/api';

    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // If user is logged in, update login button
    if (token && user && loginButton) {
        loginButton.textContent = `Hi, ${user.firstName}`;
        loginButton.addEventListener('click', function() {
            if (confirm('Do you want to log out?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
            }
        });
        
        if (signupButton) {
            signupButton.textContent = 'Post a Job';
            signupButton.addEventListener('click', function() {
                window.location.href = 'post.html';
            });
        }
    } else {
        // If not logged in, set up login/signup buttons
        if (loginButton) {
            loginButton.addEventListener('click', function () {
                window.location.href = 'signin.html';
            });
        }

        if (signupButton) {
            signupButton.addEventListener('click', function () {
                window.location.href = 'signin.html';
            });
        }
    }

    // Fetch jobs from API
    async function fetchJobs(filters = {}) {
        try {
            // Build query string from filters
            const queryParams = new URLSearchParams();
            
            if (filters.title) queryParams.append('title', filters.title);
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.location) queryParams.append('location', filters.location);
            
            const response = await fetch(`${API_URL}/jobs?${queryParams.toString()}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            
            const jobs = await response.json();
            return jobs;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            
            // If API fails, fall back to localStorage and hardcoded jobs
            const hardcodedJobs = [
                {
                    jobTitle: "Photographer",
                    company: "Creative Studios",
                    location: "Bhilai",
                    description: "We're looking for a creative photographer to capture events and portraits. Experience with DSLR required.",
                    jobType: "Part-time",
                    salary: "₹8,000 - ₹12,000",
                    postedDate: "Posted 2 days ago",
                    logo: "./img/small-photo1.jpeg",
                    phone: "+91 9876543210",
                    category: "photography"
                },
                {
                    jobTitle: "Event Management Assistant",
                    company: "Celebrate Events",
                    location: "Bhilai",
                    description: "Assist in planning and executing events. Great opportunity for students interested in event planning.",
                    jobType: "Part-time",
                    salary: "₹6,000 - ₹10,000",
                    postedDate: "Posted 1 week ago",
                    logo: "./img/small-box3.jpeg",
                    phone: "+91 8765432109",
                    category: "event"
                },
                {
                    jobTitle: "Painting Assistant",
                    company: "Artistic Walls",
                    location: "Bhilai",
                    description: "Help with residential and commercial painting projects. No experience needed, training provided.",
                    jobType: "Part-time",
                    salary: "₹5,000 - ₹8,000",
                    postedDate: "Posted 3 days ago",
                    logo: "./img/small-box2.jpg",
                    phone: "+91 7654321098",
                    category: "art"
                }
            ];
            
            return hardcodedJobs;
        }
    }

    // Display jobs in the job list container
    function displayJobs(jobs) {
        if (!jobListContainer) return;
        
        jobListContainer.innerHTML = '';
        
        if (jobs.length === 0) {
            jobListContainer.innerHTML = '<div class="no-jobs">No jobs found. Please try different search criteria.</div>';
            return;
        }
        
        jobs.forEach(job => {
            const jobSalary = job.salary || `₹${job.payAmount} ${job.payType}`;
            const jobPostDate = `Posted ${getTimeAgo(job.createdAt || new Date())}`;
            
            const jobElement = document.createElement('div');
            jobElement.className = 'job-card';
            jobElement.innerHTML = `
                <div class="job-logo">
                <img src="${job.logo ? job.logo : './img/default-company.png'}" alt="${job.company}" style="max-width: 100px;">
                </div>
                <div class="job-info">
                    <h3 class="job-title">${job.jobTitle}</h3>
                    <h4 class="job-company">${job.company || job.companyName}</h4>
                    <div class="job-details">
                        <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                        <span class="job-type"><i class="fas fa-briefcase"></i> ${job.jobType}</span>
                        <span class="job-salary"><i class="fas fa-money-bill-wave"></i> ${jobSalary}</span>
                    </div>
                    <p class="job-description">${job.description}</p>
                    <div class="job-footer">
                        <span class="job-date">${jobPostDate}</span>
                        <button class="btn-apply" data-job-id="${job._id}">Apply Now</button>
                    </div>
                </div>
            `;
            
            jobListContainer.appendChild(jobElement);
        });
        
        // Add event listeners to apply buttons
        document.querySelectorAll('.btn-apply').forEach(button => {
            button.addEventListener('click', function() {
                const jobId = this.getAttribute('data-job-id');
                applyForJob(jobId);
            });
        });
    }
    
    // Get time ago from date
    function getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    }
    
    // Apply for job function
    function applyForJob(jobId) {
        if (!token) {
            if (confirm('You need to be logged in to apply for jobs. Go to login page?')) {
                window.location.href = 'signin.html';
            }
            return;
        }
        
        // Here you would integrate with your application API
        // For now, just show a confirmation
        alert('Application submitted successfully! The employer will contact you soon.');
    }
    
    // Search form submission handling
    if (searchJobsButton) {
        searchJobsButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const filters = {
                title: jobTitleFilter ? jobTitleFilter.value : '',
                category: categoryFilter ? categoryFilter.value : '',
                location: locationFilter ? locationFilter.value : ''
            };
            
            const jobs = await fetchJobs(filters);
            displayJobs(jobs);
        });
    }
    
    // Search input handling
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', async function() {
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                const jobs = await fetchJobs({ title: searchTerm });
                displayJobs(jobs);
            }
        });
        
        searchInput.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                
                if (searchTerm) {
                    const jobs = await fetchJobs({ title: searchTerm });
                    displayJobs(jobs);
                }
            }
        });
    }
    
    // Initial job loading
    async function initializeJobs() {
        const jobs = await fetchJobs();
        displayJobs(jobs);
    }
    
    // Initialize the page
    initializeJobs();
});