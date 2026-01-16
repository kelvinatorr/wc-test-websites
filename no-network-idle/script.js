// Configuration from query parameters
const urlParams = new URLSearchParams(window.location.search);
const durationParam = urlParams.get('duration');
const config = {
    interval: parseInt(urlParams.get('interval')) || 500,
    concurrency: parseInt(urlParams.get('concurrency')) || 3,
    duration: durationParam !== null ? parseInt(durationParam) * 1000 : 10000,
    size: urlParams.get('size') || 'small'
};

// Statistics tracking
const stats = {
    total: 0,
    successful: 0,
    failed: 0,
    active: 0,
    startTime: Date.now(),
    endTime: null
};

// Endpoint configurations based on payload size
const endpoints = {
    small: [
        { name: 'httpbin-ip', url: 'https://httpbin.org/ip' },
        { name: 'httpbin-user-agent', url: 'https://httpbin.org/user-agent' },
        { name: 'ipify', url: 'https://api.ipify.org?format=json' },
        { name: 'httpbin-uuid', url: 'https://httpbin.org/uuid' },
        { name: 'JSONPlaceholder', url: 'https://jsonplaceholder.typicode.com/todos/1' }
    ],
    medium: [
        { name: 'JSONPlaceholder-users', url: 'https://jsonplaceholder.typicode.com/users' },
        { name: 'JSONPlaceholder-posts', url: 'https://jsonplaceholder.typicode.com/posts' },
        { name: 'httpbin-get', url: 'https://httpbin.org/get' },
        { name: 'LoremPicsum-50', url: 'https://picsum.photos/50/50' }
    ],
    large: [
        { name: 'JSONPlaceholder-photos', url: 'https://jsonplaceholder.typicode.com/photos' },
        { name: 'LoremPicsum-200', url: 'https://picsum.photos/200/200' },
        { name: 'LoremPicsum-300', url: 'https://picsum.photos/300/300' }
    ]
};

const activeEndpoints = endpoints[config.size] || endpoints.small;
let currentEndpointIndex = 0;
let isRunning = true;
let requestQueue = [];

// Update display elements
function updateStats() {
    document.getElementById('total-requests').textContent = stats.total;
    document.getElementById('successful').textContent = stats.successful;
    document.getElementById('failed').textContent = stats.failed;
    document.getElementById('active-requests').textContent = stats.active;

    const currentTime = stats.endTime !== null ? stats.endTime : Date.now();
    const elapsed = Math.floor((currentTime - stats.startTime) / 1000);
    document.getElementById('elapsed-time').textContent = `${elapsed}s`;
}

// Update configuration display
function updateConfigDisplay() {
    document.getElementById('config-interval').textContent = config.interval;
    document.getElementById('config-concurrency').textContent = config.concurrency;
    document.getElementById('config-duration').textContent = config.duration < 0 ? 'Unlimited' : `${config.duration / 1000}s`;
    document.getElementById('config-size').textContent = config.size.toUpperCase();
}

// Log activity
function logActivity(message, type = 'info') {
    const logContent = document.getElementById('activity-log');
    const timestamp = new Date().toLocaleTimeString();

    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span>${message}`;

    logContent.insertBefore(entry, logContent.firstChild);

    // Keep only last 50 entries
    while (logContent.children.length > 50) {
        logContent.removeChild(logContent.lastChild);
    }
}

// Make a request to an endpoint
async function makeRequest(endpoint) {
    stats.active++;
    stats.total++;
    updateStats();

    const startTime = performance.now();

    try {
        const response = await fetch(endpoint.url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store'
        });

        const latency = Math.round(performance.now() - startTime);

        if (response.ok) {
            stats.successful++;
            logActivity(`✓ ${endpoint.name} (${latency}ms)`, 'success');
        } else {
            stats.failed++;
            logActivity(`✗ ${endpoint.name} - HTTP ${response.status}`, 'error');
        }
    } catch (error) {
        stats.failed++;
        logActivity(`✗ ${endpoint.name} - ${error.message}`, 'error');
    } finally {
        stats.active--;
        updateStats();
    }
}

// Rotate through endpoints
function getNextEndpoint() {
    const endpoint = activeEndpoints[currentEndpointIndex];
    currentEndpointIndex = (currentEndpointIndex + 1) % activeEndpoints.length;
    return endpoint;
}

// Main request loop
function startRequestLoop() {
    const intervalId = setInterval(() => {
        if (!isRunning) {
            clearInterval(intervalId);
            return;
        }

        // Maintain concurrency level
        while (stats.active < config.concurrency && isRunning) {
            const endpoint = getNextEndpoint();
            makeRequest(endpoint);
        }
    }, config.interval);

    // Stop after duration (if not unlimited)
    if (config.duration > 0) {
        setTimeout(() => {
            isRunning = false;
            stats.endTime = Date.now();
            document.getElementById('status').textContent = 'Completed';
            document.getElementById('stop-button').disabled = true;
            document.getElementById('stop-button').textContent = 'Completed';
            logActivity('Duration limit reached. Stopping...', 'info');
        }, config.duration);
    }
}

// Update status display
function updateStatusDisplay() {
    setInterval(() => {
        if (isRunning) {
            document.getElementById('status').textContent = '🟢 Active';
        }
    }, 1000);
}

// Stop button handler
function stopActivity() {
    isRunning = false;
    stats.endTime = Date.now();
    document.getElementById('status').textContent = '🔴 Stopped';
    document.getElementById('stop-button').disabled = true;
    document.getElementById('stop-button').textContent = 'Stopped';
    logActivity('Activity manually stopped by user', 'info');
}

// Initialize
document.getElementById('status').textContent = '🟢 Active';
updateConfigDisplay();
logActivity('Network activity started', 'success');
startRequestLoop();
updateStatusDisplay();

// Add stop button event listener
document.getElementById('stop-button').addEventListener('click', stopActivity);

// Update stats display regularly
setInterval(updateStats, 100);
