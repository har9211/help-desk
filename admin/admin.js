/* Toast notifications */
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    z-index: 1000;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
}

.toast.show {
    transform: translateY(0);
    opacity: 1;
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.toast-success {
    border-left: 4px solid var(--success);
}

.toast-error {
    border-left: 4px solid var(--danger);
}

.toast-info {
    border-left: 4px solid var(--primary);
}

/* Notification panel */
#notification-panel {
    position: absolute;
    top: 50px;
    right: 0;
    width: 350px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    display: none;
    z-index: 999;
    max-height: 400px;
    overflow-y: auto;
}

#notification-panel.active {
    display: block;
}

.notification-item {
    padding: 15px;
    border-bottom: 1px solid #eee;
}

.notification-item.unread {
    background: #f8f9fa;
}

.notification-item p {
    margin-bottom: 5px;
}

.notification-item small {
    color: #6c757d;
}

.notification-footer {
    padding: 10px;
    text-align: center;
}

.notification-footer button {
    background: none;
    border: none;
    color: var(--primary);
    cursor: pointer;
}

/* Chart placeholders */
.chart-placeholder {
    text-align: center;
    color: #6c757d;
    font-style: italic;
}

/* Status filter buttons */
.status-filter {
    background: none;
    border: none;
    padding: 5px 10px;
    margin-right: 10px;
    cursor: pointer;
    border-radius: 4px;
}

.status-filter.active {
    background: var(--primary);
    color: white;
}

/* Sidebar toggle button (for mobile) */
.sidebar-toggle {
    display: none;
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--primary);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Responsive adjustments */
@media (max-width: 992px) {
    .sidebar-toggle {
        display: flex;
    }
    
    .sidebar.collapsed {
        transform: translateX(-100%);
    }
    
    .main-content.sidebar-collapsed {
        margin-left: 0;
    }
}