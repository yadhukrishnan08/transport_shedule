const apiBase = '/api';
let currentUser = null;

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
// Auth
// =========================

async function checkCurrentUser() {
    try {
        const user = await apiRequest('/auth/me', { method: 'GET' });
        if (user.role !== 'MECHANIC') {
            alert('Access Denied. You are not a mechanic.');
            window.location.href = 'index.html';
            return;
        }
        currentUser = user;
        document.getElementById('current-username').textContent = 'Mechanic: ' + user.username;
        loadDashboardData();
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
// Data Loading
// =========================

async function loadDashboardData() {
    await Promise.all([
        loadBreakdowns(),
        loadLogs(),
        loadVehiclesForDropdown()
    ]);
}

async function loadVehiclesForDropdown() {
    try {
        const vehicles = await apiRequest('/vehicles', { method: 'GET' });
        const sel = document.getElementById('maintenance-vehicle');
        sel.innerHTML = '<option value="">-- Select Vehicle --</option>';
        vehicles.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.textContent = `${v.registrationNumber} (${v.status})`;
            sel.appendChild(opt);
        });
    } catch (err) {
        console.error('Failed to load vehicles:', err);
    }
}

// =========================
// Breakdowns
// =========================

async function loadBreakdowns() {
    try {
        const [breakdowns, vehicles] = await Promise.all([
            apiRequest('/breakdowns', { method: 'GET' }),
            apiRequest('/vehicles', { method: 'GET' })
        ]);

        const tbody = document.querySelector('#breakdowns-table tbody');
        tbody.innerHTML = '';

        // Filter out resolved ones if desired, or show all top active first
        breakdowns.sort((a, b) => {
            if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
            if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
            return new Date(b.reportedAt) - new Date(a.reportedAt);
        });

        breakdowns.forEach(b => {
            const vehicle = vehicles.find(v => v.id === b.vehicleId);
            const vehicleReg = vehicle ? vehicle.registrationNumber : b.vehicleId;

            const tr = document.createElement('tr');

            let actions = '';
            if (b.status === 'Reported') {
                actions = `<button class="btn btn-small btn-primary" onclick="updateBreakdownStatus(${b.id}, 'In Repair')">Start Repair</button>`;
            } else if (b.status === 'In Repair') {
                actions = `<button class="btn btn-small btn-secondary" onclick="updateBreakdownStatus(${b.id}, 'Resolved')">Mark Resolved</button>`;
            } else {
                actions = '<span style="color: green;">✓</span>';
            }

            tr.innerHTML = `
                <td>${b.id}</td>
                <td>${vehicleReg}</td>
                <td>${formatDateTime(b.reportedAt)}</td>
                <td>${b.description || '-'}</td>
                <td>${b.status}</td>
                <td>${actions}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Failed to load breakdowns:', err);
    }
}

window.updateBreakdownStatus = async function (id, status) {
    if (!confirm(`Update status to ${status}?`)) return;
    try {
        await apiRequest(`/breakdowns/${id}/status?status=${encodeURIComponent(status)}`, { method: 'PUT' });
        loadBreakdowns();
        // If resolved, maybe prompt to add log?
        if (status === 'Resolved') {
            if (confirm('Create a maintenance log for this repair?')) {
                document.querySelector('[data-target="logs-panel"]').click();
                document.getElementById('add-log-btn').click();
                // We could pre-fill vehicle ID if we had it easily accessible here
            }
        }
    } catch (err) {
        alert('Failed to update status: ' + err.message);
    }
};

// =========================
// Maintenance Logs
// =========================

async function loadLogs() {
    try {
        const [logs, vehicles] = await Promise.all([
            apiRequest('/maintenance', { method: 'GET' }),
            apiRequest('/vehicles', { method: 'GET' })
        ]);

        const tbody = document.querySelector('#logs-table tbody');
        tbody.innerHTML = '';

        logs.forEach(l => {
            const vehicle = vehicles.find(v => v.id === l.vehicleId);
            const vehicleReg = vehicle ? vehicle.registrationNumber : l.vehicleId;
            const assigned = l.assignedTo ? `User #${l.assignedTo}` : '-'; // We don't have user names loaded, just IDs

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${l.id}</td>
                <td>${vehicleReg}</td>
                <td>${l.serviceDate}</td>
                <td>${l.description}</td>
                <td>${l.cost ? l.cost.toFixed(2) : '-'}</td>
                <td>${assigned}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Failed to load logs:', err);
    }
}

const logForm = document.getElementById('maintenance-form');
const logFormContainer = document.getElementById('log-form-container');

document.getElementById('add-log-btn').addEventListener('click', () => {
    logFormContainer.classList.remove('hidden');
    logForm.reset();
});

document.getElementById('cancel-log').addEventListener('click', () => {
    logFormContainer.classList.add('hidden');
});

logForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const vehicleId = document.getElementById('maintenance-vehicle').value;
    const date = document.getElementById('maintenance-date').value;
    const description = document.getElementById('maintenance-description').value.trim();
    const cost = document.getElementById('maintenance-cost').value;

    if (!vehicleId || !date || !description) {
        alert('Please fill required fields');
        return;
    }

    const payload = {
        vehicleId: Number(vehicleId),
        serviceDate: date,
        description: description,
        cost: cost ? Number(cost) : null,
        // Backend handles assignedTo based on logged in user? 
        // MaintenanceController doesn't set assignedTo currently.
        // We might need to update MaintenanceController if we want to track who did it.
        // But for MVP, just creating the log is enough.
    };

    try {
        await apiRequest('/maintenance', { method: 'POST', body: JSON.stringify(payload) });
        alert('Log added successfully');
        logFormContainer.classList.add('hidden');
        logForm.reset();
        loadLogs();
    } catch (err) {
        alert('Failed to add log: ' + err.message);
    }
});

// Init
checkCurrentUser();
