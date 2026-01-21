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

// Get screen resolution
function getScreenResolution() {
    return `${window.screen.width} x ${window.screen.height}`;
}

// Get color depth
function getColorDepth() {
    return `${window.screen.colorDepth}-bit`;
}

// Get timezone
function getTimezone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
        return 'Unknown';
    }
}

// Get language preferences
function getLanguages() {
    if (navigator.languages && navigator.languages.length > 0) {
        return navigator.languages.join(', ');
    }
    return navigator.language || 'Unknown';
}

// Detect installed fonts
async function detectInstalledFonts() {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testFonts = [
        'Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana',
        'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Palatino',
        'Helvetica', 'Calibri', 'Cambria', 'Consolas', 'Garamond',
        'Geneva', 'Monaco', 'Tahoma', 'Lucida Console'
    ];

    const detectedFonts = [];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Get widths for base fonts
    const baseWidths = {};
    baseFonts.forEach(baseFont => {
        context.font = `${testSize} ${baseFont}`;
        baseWidths[baseFont] = context.measureText(testString).width;
    });

    // Test each font
    testFonts.forEach(font => {
        let detected = false;
        baseFonts.forEach(baseFont => {
            context.font = `${testSize} '${font}', ${baseFont}`;
            const width = context.measureText(testString).width;
            if (width !== baseWidths[baseFont]) {
                detected = true;
            }
        });
        if (detected) {
            detectedFonts.push(font);
        }
    });

    return detectedFonts.length > 0 ? detectedFonts.join(', ') : 'None detected from common list';
}

// Detect media capabilities
async function detectMediaCapabilities() {
    const capabilities = [];

    // Test common video codecs
    const videoCodecs = [
        { name: 'H.264', type: 'video/mp4; codecs="avc1.42E01E"' },
        { name: 'H.265', type: 'video/mp4; codecs="hev1.1.6.L93.B0"' },
        { name: 'VP9', type: 'video/webm; codecs="vp9"' },
        { name: 'AV1', type: 'video/mp4; codecs="av01.0.05M.08"' }
    ];

    // Test common audio codecs
    const audioCodecs = [
        { name: 'AAC', type: 'audio/mp4; codecs="mp4a.40.2"' },
        { name: 'Opus', type: 'audio/webm; codecs="opus"' },
        { name: 'Vorbis', type: 'audio/ogg; codecs="vorbis"' }
    ];

    const supported = [];

    // Check video codecs
    videoCodecs.forEach(codec => {
        if (MediaSource.isTypeSupported(codec.type)) {
            supported.push(codec.name);
        }
    });

    // Check audio codecs
    audioCodecs.forEach(codec => {
        if (MediaSource.isTypeSupported(codec.type)) {
            supported.push(codec.name);
        }
    });

    return supported.length > 0 ? supported.join(', ') : 'None detected';
}

// Get WebGL renderer information
function getWebGLRenderer() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                return `${vendor} - ${renderer}`;
            }
            return 'WebGL supported (renderer info masked)';
        }
        return 'WebGL not supported';
    } catch (error) {
        return 'Unable to detect';
    }
}

// Detect available browser APIs
function detectAvailableAPIs() {
    const apis = [];

    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        apis.push('WebRTC');
    }

    if ('AudioContext' in window || 'webkitAudioContext' in window) {
        apis.push('Web Audio');
    }

    if ('getBattery' in navigator) {
        apis.push('Battery');
    }

    if ('bluetooth' in navigator) {
        apis.push('Web Bluetooth');
    }

    if ('usb' in navigator) {
        apis.push('WebUSB');
    }

    if ('serviceWorker' in navigator) {
        apis.push('Service Worker');
    }

    if ('geolocation' in navigator) {
        apis.push('Geolocation');
    }

    if ('Notification' in window) {
        apis.push('Notifications');
    }

    if ('storage' in navigator && 'estimate' in navigator.storage) {
        apis.push('Storage API');
    }

    if ('credentials' in navigator) {
        apis.push('Credentials');
    }

    return apis.length > 0 ? apis.join(', ') : 'None detected';
}

// Get hardware concurrency (CPU cores)
function getHardwareConcurrency() {
    if ('hardwareConcurrency' in navigator) {
        return `${navigator.hardwareConcurrency} logical processors`;
    }
    return 'Not available';
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

    // Display screen resolution
    document.getElementById('screen-resolution').textContent = getScreenResolution();

    // Display color depth
    document.getElementById('color-depth').textContent = getColorDepth();

    // Display timezone
    document.getElementById('timezone').textContent = getTimezone();

    // Display languages
    document.getElementById('languages').textContent = getLanguages();

    // Display installed fonts (async)
    const fonts = await detectInstalledFonts();
    document.getElementById('installed-fonts').textContent = fonts;

    // Display media capabilities (async)
    const mediaCapabilities = await detectMediaCapabilities();
    document.getElementById('media-capabilities').textContent = mediaCapabilities;

    // Display WebGL renderer
    document.getElementById('webgl-renderer').textContent = getWebGLRenderer();

    // Display available APIs
    document.getElementById('available-apis').textContent = detectAvailableAPIs();

    // Display hardware concurrency
    document.getElementById('hardware-concurrency').textContent = getHardwareConcurrency();

    // Update viewport on window resize
    window.addEventListener('resize', updateViewport);
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
