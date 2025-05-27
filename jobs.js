// jobs.js
import { getToken } from './auth';

const API_URL = 'https://jobbuddy-r8nw.onrender.com/api';

// Get all jobs
export const getAllJobs = async (filters = {}) => {
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
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Get a job by ID
export const getJobById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`);
    
    if (!response.ok) {
      throw new Error('Job not found');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Create a new job
export const createJob = async (jobData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to create job');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Update a job
export const updateJob = async (id, jobData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to update job');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Delete a job
export const deleteJob = async (id) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete job');
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};