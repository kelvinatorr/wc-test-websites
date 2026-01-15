// Get and display user agent
function getUserAgent() {
    return navigator.userAgent;
}

// Get and display viewport dimensions
function getViewport() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return `${width} x ${height}`;
}

// Update viewport on resize
function updateViewport() {
    document.getElementById('viewport').textContent = getViewport();
}

// Get IP address from external API
async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Unable to fetch IP';
    }
}

// Get IPv6 address from external API
async function getIPv6Address() {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Not available';
    }
}

// Get and format current time in UTC
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'UTC',
        timeZoneName: 'short'
    });
}

// Update current time display
function updateCurrentTime() {
    document.getElementById('current-time').textContent = getCurrentTime();
}

// Initialize the page
async function init() {
    // Display user agent
    document.getElementById('user-agent').textContent = getUserAgent();

    // Display viewport
    document.getElementById('viewport').textContent = getViewport();

    // Display IP address
    const ip = await getIPAddress();
    document.getElementById('ip-address').textContent = ip;

    // Display IPv6 address
    const ipv6 = await getIPv6Address();
    document.getElementById('ipv6-address').textContent = ipv6;

    // Display and update current time
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    // Update viewport on window resize
    window.addEventListener('resize', updateViewport);
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
