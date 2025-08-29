// Admin panel JavaScript for enhanced functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Initialize admin dashboard
    initializeAdminDashboard();
});

function initializeAdminDashboard() {
    // Load statistics and analytics
    loadDashboardStats();
    
    // Set up real-time updates
    setupRealTimeUpdates();
    
    // Handle navigation and section switching
    setupNavigation();
}

async function loadDashboardStats() {
    try {
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const stats = await response.json();
            updateDashboardStats(stats);
        } else {
            console.error('Failed to load dashboard statistics');
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function updateDashboardStats(stats) {
    // Update the dashboard with statistics
    const statsContainer = document.getElementById('statsContainer');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-card">
                <h3>Total Issues</h3>
                <p class="stat-number">${stats.totalIssues || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Pending Issues</h3>
                <p class="stat-number">${stats.pendingIssues || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Resolved Issues</h3>
                <p class="stat-number">${stats.resolvedIssues || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Total Users</h3>
                <p class="stat-number">${stats.totalUsers || 0}</p>
            </div>
        `;
    }
}

function setupRealTimeUpdates() {
    // Set up WebSocket or polling for real-time updates
    setInterval(() => {
        loadDashboardStats();
        if (document.getElementById('issuesSection').style.display !== 'none') {
            loadIssues();
        }
    }, 30000); // Update every 30 seconds
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show target section
            const targetElement = document.getElementById(`${targetSection}Section`);
            if (targetElement) {
                targetElement.style.display = 'block';
            }
            
            // Load section data
            switch(targetSection) {
                case 'issues':
                    loadIssues();
                    break;
                case 'users':
                    loadUsers();
                    break;
                case 'content':
                    loadContent();
                    break;
                case 'analytics':
                    loadAnalytics();
                    break;
            }
        });
    });
}

async function loadIssues() {
    try {
        const response = await fetch('/api/admin/issues', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const issues = await response.json();
            renderIssues(issues);
        } else {
            console.error('Failed to load issues');
        }
    } catch (error) {
        console.error('Error loading issues:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const users = await response.json();
            renderUsers(users);
        } else {
            console.error('Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadContent() {
    try {
        const response = await fetch('/api/admin/content', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const content = await response.json();
            renderContent(content);
        } else {
            console.error('Failed to load content');
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

async function loadAnalytics() {
    try {
        const response = await fetch('/api/admin/analytics', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const analytics = await response.json();
            renderAnalytics(analytics);
        } else {
            console.error('Failed to load analytics');
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function renderIssues(issues) {
    const issuesTable = document.getElementById('issuesTable');
    if (!issuesTable) return;
    
    issuesTable.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${issues.map(issue => `
                <tr>
                    <td>${issue.id}</td>
                    <td>${issue.title}</td>
                    <td>${issue.description}</td>
                    <td>${issue.location}</td>
                    <td>${issue.category}</td>
                    <td>
                        <span class="status-badge ${issue.status.toLowerCase()}">
                            ${issue.status}
                        </span>
                    </td>
                    <td>${new Date(issue.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-action" onclick="updateIssueStatus(${issue.id}, 'Resolved')">
                            Resolve
                        </button>
                        <button class="btn-action btn-danger" onclick="deleteIssue(${issue.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

function renderUsers(users) {
    const usersTable = document.getElementById('usersTable');
    if (!usersTable) return;
    
    usersTable.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-action" onclick="editUser(${user.id})">
                            Edit
                        </button>
                        <button class="btn-action btn-danger" onclick="deleteUser(${user.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

// Export functions for global access
window.updateIssueStatus = async function(issueId, status) {
    try {
        const response = await fetch(`/api/admin/issues/${issueId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            loadIssues();
            loadDashboardStats();
        } else {
            alert('Failed to update issue status');
        }
    } catch (error) {
        alert('Error updating issue status');
    }
};

window.deleteIssue = async function(issueId) {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    
    try {
        const response = await fetch(`/api/admin/issues/${issueId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            loadIssues();
            loadDashboardStats();
        } else {
            alert('Failed to delete issue');
        }
    } catch (error) {
        alert('Error deleting issue');
    }
};

window.logoutAdmin = function() {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
};
