const apiBase = '/api';
let currentUser = null;
let currentDriver = null;

// =========================
// Utility helpers
// =========================

async function apiRequest(path, options = {}) {
    const resp = await fetch(apiBase + path, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || ('Request failed: ' + resp.status));
    }
    if (resp.status === 204) return null;
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return await resp.json();
    }
    return await resp.text();
}

function formatDateTime(dtString) {
    if (!dtString) return '';
    try {
        const d = new Date(dtString);
        return d.toLocaleString();
    } catch {
        return dtString;
    }
}

// =========================
// Auth & Init
// =========================

async function checkCurrentUser() {
    try {
        const user = await apiRequest('/auth/me', { method: 'GET' });
        if (user.role !== 'DRIVER') {
            alert('Access Denied. You are not a driver.');
            window.location.href = 'index.html';
            return;
        }
        currentUser = user;
        document.getElementById('current-username').textContent = 'Driver: ' + user.username;
        loadDriverData(user.username);
    } catch (e) {
        window.location.href = 'index.html';
    }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await apiRequest('/auth/logout', { method: 'POST' });
    } catch { }
    window.location.href = 'index.html';
});

// =========================
// Navigation
// =========================

const navLinks = document.querySelectorAll('.nav-link');
const panels = document.querySelectorAll('.panel');

navLinks.forEach(btn => {
    btn.addEventListener('click', () => {
        navLinks.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.getAttribute('data-target');
        panels.forEach(p => {
            p.classList.toggle('active', p.id === target);
        });
    });
});

// =========================
// Driver Data
// =========================

async function loadDriverData(username) {
    try {
        // Fetch all drivers to find the current one
        // Ideally backend would provide /api/drivers/me or /api/drivers?username=...
        const drivers = await apiRequest('/drivers', { method: 'GET' });
        currentDriver = drivers.find(d => d.username === username);

        if (!currentDriver) {
            document.querySelector('.content').innerHTML = '<h2>Error: Driver profile not found for this user.</h2>';
            return;
        }

        // Update Profile
        document.getElementById('profile-name').textContent = currentDriver.name;
        document.getElementById('profile-license').textContent = currentDriver.licenseNumber;
        document.getElementById('profile-phone').textContent = currentDriver.phone || 'N/A';
        document.getElementById('profile-depot').textContent = currentDriver.depot || 'N/A';

        // Load Assignments
        loadAssignments(currentDriver.id);

    } catch (err) {
        console.error('Failed to load driver data:', err);
    }
}

// =========================
// Assignments
// =========================

let mySchedules = [];

async function loadAssignments(driverId) {
    try {
        // Fetch all schedules and filter
        const schedules = await apiRequest('/schedules', { method: 'GET' });
        mySchedules = schedules.filter(s => s.driverId === driverId);

        // Also fetch vehicles and routes to display names instead of IDs
        const [vehicles, routes] = await Promise.all([
            apiRequest('/vehicles', { method: 'GET' }),
            apiRequest('/routes', { method: 'GET' })
        ]);

        const tbody = document.querySelector('#assignments-table tbody');
        tbody.innerHTML = '';
        const breakdownSelect = document.getElementById('breakdown-schedule');
        breakdownSelect.innerHTML = '<option value="">-- Select Schedule --</option>';

        mySchedules.forEach(s => {
            const vehicle = vehicles.find(v => v.id === s.vehicleId);
            const route = routes.find(r => r.id === s.routeId);
            const vehicleReg = vehicle ? vehicle.registrationNumber : s.vehicleId;
            const routeCode = route ? route.code : s.routeId;

            // Simple status check: if departure is future -> Upcoming, else In Progress/Done
            const now = new Date();
            const dep = new Date(s.departureTime);
            const arr = s.arrivalTime ? new Date(s.arrivalTime) : null;
            let status = 'Scheduled';
            if (now >= dep) status = 'In Progress';
            if (arr && now >= arr) status = 'Completed';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.id}</td>
                <td>${vehicleReg}</td>
                <td>${routeCode}</td>
                <td>${formatDateTime(s.departureTime)}</td>
                <td>${formatDateTime(s.arrivalTime)}</td>
                <td>${status}</td>
            `;
            tbody.appendChild(tr);

            // Populate Breakdown Dropdown
            // We only allow reporting on non-completed schedules for simplicity
            if (status !== 'Completed') {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = `Schedule #${s.id} - ${vehicleReg}`;
                breakdownSelect.appendChild(opt);
            }
        });

    } catch (err) {
        console.error('Failed to load assignments:', err);
    }
}

// =========================
// Breakdown Reporting
// =========================

document.getElementById('breakdown-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const scheduleId = document.getElementById('breakdown-schedule').value;
    const description = document.getElementById('breakdown-description').value.trim();

    if (!scheduleId) {
        alert('Please select a schedule/vehicle');
        return;
    }
    if (!description) {
        alert('Please enter a description');
        return;
    }

    try {
        const schedule = mySchedules.find(s => s.id == scheduleId);
        if (!schedule) throw new Error('Schedule not found');

        const payload = {
            vehicleId: schedule.vehicleId,
            scheduleId: schedule.id,
            description: description
        };

        await apiRequest('/breakdowns', { method: 'POST', body: JSON.stringify(payload) });
        alert('Breakdown reported successfully.');
        document.getElementById('breakdown-form').reset();
    } catch (err) {
        alert('Failed to report breakdown: ' + err.message);
    }
});

// Init
checkCurrentUser();
