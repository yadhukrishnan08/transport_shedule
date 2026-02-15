// Frontend logic for Public Transport Fleet Scheduling system
// Handles:
// - Admin login/logout
// - CRUD operations for Vehicles, Drivers, Routes
// - Fleet Scheduling
// - Breakdown reporting and status updates
// - Maintenance logs
// Includes simple client-side form validation and responsive UI behavior.

const apiBase = '/api';

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
    if (resp.status === 204) {
        return null;
    }
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return await resp.json();
    }
    return await resp.text();
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => (el.textContent = ''));
}

function setError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
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
// Authentication
// =========================

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const currentUsernameSpan = document.getElementById('current-username');
const logoutBtn = document.getElementById('logout-btn');

async function checkCurrentUser() {
    try {
        const user = await apiRequest('/auth/me', { method: 'GET' });
        showDashboard(user.username);
    } catch (e) {
        showLogin();
    }
}

function showDashboard(username) {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    currentUsernameSpan.textContent = 'Logged in as: ' + username;
    loadAllData();
}

function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    currentUsernameSpan.textContent = '';
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    loginError.textContent = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    let valid = true;
    if (!username) {
        setError('username-error', 'Username is required');
        valid = false;
    }
    if (!password) {
        setError('password-error', 'Password is required');
        valid = false;
    }
    if (!valid) return;

    try {
        await apiRequest('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ username, password }).toString()
        });
        showDashboard(username);
    } catch (err) {
        loginError.textContent = err.message;
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
        // ignore
    }
    showLogin();
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
// Vehicles CRUD
// =========================

const vehicleForm = document.getElementById('vehicle-form');
const vehiclesTableBody = document.querySelector('#vehicles-table tbody');

async function loadVehicles() {
    const vehicles = await apiRequest('/vehicles', { method: 'GET' });
    vehiclesTableBody.innerHTML = '';
    vehicles.forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${v.id}</td>
            <td>${v.registrationNumber}</td>
            <td>${v.type}</td>
            <td>${v.depot || ''}</td>
            <td>${v.status}</td>
            <td>
                <button class="btn btn-small btn-secondary" data-action="edit" data-id="${v.id}">Edit</button>
                <button class="btn btn-small btn-danger" data-action="delete" data-id="${v.id}">Delete</button>
            </td>
        `;
        vehiclesTableBody.appendChild(tr);
    });
    populateVehicleDropdowns(vehicles);
}

function populateVehicleDropdowns(vehicles) {
    const scheduleVehicle = document.getElementById('schedule-vehicle');
    const breakdownVehicle = document.getElementById('breakdown-vehicle');
    const maintenanceVehicle = document.getElementById('maintenance-vehicle');
    [scheduleVehicle, breakdownVehicle, maintenanceVehicle].forEach(sel => {
        if (!sel) return;
        const currentValue = sel.value;
        sel.innerHTML = '<option value="">-- Select --</option>';
        vehicles.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.textContent = `${v.registrationNumber} (${v.status})`;
            sel.appendChild(opt);
        });
        if (currentValue) sel.value = currentValue;
    });
}

vehicleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const id = document.getElementById('vehicle-id').value;
    const registrationNumber = document.getElementById('vehicle-reg').value.trim();
    const type = document.getElementById('vehicle-type').value.trim();
    const depot = document.getElementById('vehicle-depot').value.trim();
    const status = document.getElementById('vehicle-status').value;

    let valid = true;
    if (!registrationNumber) {
        setError('vehicle-reg-error', 'Registration is required');
        valid = false;
    }
    if (!type) {
        setError('vehicle-type-error', 'Type is required');
        valid = false;
    }
    if (!valid) return;

    const payload = { registrationNumber, type, depot, status };
    try {
        if (id) {
            await apiRequest(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
        } else {
            await apiRequest('/vehicles', { method: 'POST', body: JSON.stringify(payload) });
        }
        vehicleForm.reset();
        document.getElementById('vehicle-id').value = '';
        await loadVehicles();
    } catch (err) {
        alert('Failed to save vehicle: ' + err.message);
    }
});

document.getElementById('vehicle-reset').addEventListener('click', () => {
    vehicleForm.reset();
    document.getElementById('vehicle-id').value = '';
    clearErrors();
});

vehiclesTableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'delete') {
        if (!confirm('Delete this vehicle?')) return;
        try {
            await apiRequest(`/vehicles/${id}`, { method: 'DELETE' });
            await loadVehicles();
        } catch (err) {
            alert('Failed to delete vehicle: ' + err.message);
        }
    } else if (action === 'edit') {
        const row = btn.closest('tr');
        document.getElementById('vehicle-id').value = id;
        document.getElementById('vehicle-reg').value = row.children[1].textContent;
        document.getElementById('vehicle-type').value = row.children[2].textContent;
        document.getElementById('vehicle-depot').value = row.children[3].textContent;
        document.getElementById('vehicle-status').value = row.children[4].textContent;
    }
});

// =========================
// Drivers CRUD
// =========================

const driverForm = document.getElementById('driver-form');
const driversTableBody = document.querySelector('#drivers-table tbody');

async function loadDrivers() {
    const drivers = await apiRequest('/drivers', { method: 'GET' });
    driversTableBody.innerHTML = '';
    drivers.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.id}</td>
            <td>${d.name}</td>
            <td>${d.licenseNumber}</td>
            <td>${d.phone || ''}</td>
            <td>${d.depot || ''}</td>
            <td>
                <button class="btn btn-small btn-secondary" data-action="edit" data-id="${d.id}">Edit</button>
                <button class="btn btn-small btn-danger" data-action="delete" data-id="${d.id}">Delete</button>
            </td>
        `;
        driversTableBody.appendChild(tr);
    });
    populateDriverDropdowns(drivers);
}

function populateDriverDropdowns(drivers) {
    const scheduleDriver = document.getElementById('schedule-driver');
    const currentValue = scheduleDriver.value;
    scheduleDriver.innerHTML = '<option value="">-- Select --</option>';
    drivers.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.name} (${d.depot || 'No depot'})`;
        scheduleDriver.appendChild(opt);
    });
    if (currentValue) scheduleDriver.value = currentValue;
}

driverForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const id = document.getElementById('driver-id').value;
    const name = document.getElementById('driver-name').value.trim();
    const licenseNumber = document.getElementById('driver-license').value.trim();
    const phone = document.getElementById('driver-phone').value.trim();
    const depot = document.getElementById('driver-depot').value.trim();

    let valid = true;
    if (!name) {
        setError('driver-name-error', 'Name is required');
        valid = false;
    }
    if (!licenseNumber) {
        setError('driver-license-error', 'License is required');
        valid = false;
    }
    if (phone && !/^\d{7,15}$/.test(phone)) {
        setError('driver-phone-error', 'Phone should be 7-15 digits');
        valid = false;
    }
    if (!valid) return;

    const payload = { name, licenseNumber, phone, depot };
    try {
        if (id) {
            await apiRequest(`/drivers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
        } else {
            await apiRequest('/drivers', { method: 'POST', body: JSON.stringify(payload) });
        }
        driverForm.reset();
        document.getElementById('driver-id').value = '';
        await loadDrivers();
    } catch (err) {
        alert('Failed to save driver: ' + err.message);
    }
});

document.getElementById('driver-reset').addEventListener('click', () => {
    driverForm.reset();
    document.getElementById('driver-id').value = '';
    clearErrors();
});

driversTableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'delete') {
        if (!confirm('Delete this driver?')) return;
        try {
            await apiRequest(`/drivers/${id}`, { method: 'DELETE' });
            await loadDrivers();
        } catch (err) {
            alert('Failed to delete driver: ' + err.message);
        }
    } else if (action === 'edit') {
        const row = btn.closest('tr');
        document.getElementById('driver-id').value = id;
        document.getElementById('driver-name').value = row.children[1].textContent;
        document.getElementById('driver-license').value = row.children[2].textContent;
        document.getElementById('driver-phone').value = row.children[3].textContent;
        document.getElementById('driver-depot').value = row.children[4].textContent;
    }
});

// =========================
// Routes CRUD
// =========================

const routeForm = document.getElementById('route-form');
const routesTableBody = document.querySelector('#routes-table tbody');

async function loadRoutes() {
    const routes = await apiRequest('/routes', { method: 'GET' });
    routesTableBody.innerHTML = '';
    routes.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.code}</td>
            <td>${r.origin}</td>
            <td>${r.destination}</td>
            <td>${r.distanceKm || ''}</td>
            <td>
                <button class="btn btn-small btn-secondary" data-action="edit" data-id="${r.id}">Edit</button>
                <button class="btn btn-small btn-danger" data-action="delete" data-id="${r.id}">Delete</button>
            </td>
        `;
        routesTableBody.appendChild(tr);
    });
    populateRouteDropdowns(routes);
}

function populateRouteDropdowns(routes) {
    const scheduleRoute = document.getElementById('schedule-route');
    const currentValue = scheduleRoute.value;
    scheduleRoute.innerHTML = '<option value="">-- Select --</option>';
    routes.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = `${r.code}: ${r.origin} → ${r.destination}`;
        scheduleRoute.appendChild(opt);
    });
    if (currentValue) scheduleRoute.value = currentValue;
}

routeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const id = document.getElementById('route-id').value;
    const code = document.getElementById('route-code').value.trim();
    const origin = document.getElementById('route-origin').value.trim();
    const destination = document.getElementById('route-destination').value.trim();
    const distance = document.getElementById('route-distance').value.trim();

    let valid = true;
    if (!code) {
        setError('route-code-error', 'Code is required');
        valid = false;
    }
    if (!origin) {
        setError('route-origin-error', 'Origin is required');
        valid = false;
    }
    if (!destination) {
        setError('route-destination-error', 'Destination is required');
        valid = false;
    }
    if (!valid) return;

    const payload = { code, origin, destination, distanceKm: distance };
    try {
        if (id) {
            await apiRequest(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
        } else {
            await apiRequest('/routes', { method: 'POST', body: JSON.stringify(payload) });
        }
        routeForm.reset();
        document.getElementById('route-id').value = '';
        await loadRoutes();
    } catch (err) {
        alert('Failed to save route: ' + err.message);
    }
});

document.getElementById('route-reset').addEventListener('click', () => {
    routeForm.reset();
    document.getElementById('route-id').value = '';
    clearErrors();
});

routesTableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'delete') {
        if (!confirm('Delete this route?')) return;
        try {
            await apiRequest(`/routes/${id}`, { method: 'DELETE' });
            await loadRoutes();
        } catch (err) {
            alert('Failed to delete route: ' + err.message);
        }
    } else if (action === 'edit') {
        const row = btn.closest('tr');
        document.getElementById('route-id').value = id;
        document.getElementById('route-code').value = row.children[1].textContent;
        document.getElementById('route-origin').value = row.children[2].textContent;
        document.getElementById('route-destination').value = row.children[3].textContent;
        document.getElementById('route-distance').value = row.children[4].textContent;
    }
});

// =========================
// Scheduling
// =========================

const scheduleForm = document.getElementById('schedule-form');
const schedulesTableBody = document.querySelector('#schedules-table tbody');

async function loadSchedules() {
    const schedules = await apiRequest('/schedules', { method: 'GET' });
    schedulesTableBody.innerHTML = '';
    schedules.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.id}</td>
            <td>${s.vehicleId}</td>
            <td>${s.driverId}</td>
            <td>${s.routeId}</td>
            <td>${formatDateTime(s.departureTime)}</td>
            <td>${formatDateTime(s.arrivalTime)}</td>
            <td>
                <button class="btn btn-small btn-danger" data-action="delete" data-id="${s.id}">Delete</button>
            </td>
        `;
        schedulesTableBody.appendChild(tr);
    });
    populateScheduleDropdownForBreakdowns(schedules);
}

function populateScheduleDropdownForBreakdowns(schedules) {
    const sel = document.getElementById('breakdown-schedule');
    const currentValue = sel.value;
    sel.innerHTML = '<option value="">-- None --</option>';
    schedules.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `#${s.id} vehicle ${s.vehicleId} on route ${s.routeId}`;
        sel.appendChild(opt);
    });
    if (currentValue) sel.value = currentValue;
}

scheduleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const vehicleId = document.getElementById('schedule-vehicle').value;
    const driverId = document.getElementById('schedule-driver').value;
    const routeId = document.getElementById('schedule-route').value;
    const departure = document.getElementById('schedule-departure').value;
    const arrival = document.getElementById('schedule-arrival').value;

    let valid = true;
    if (!vehicleId) {
        setError('schedule-vehicle-error', 'Vehicle required');
        valid = false;
    }
    if (!driverId) {
        setError('schedule-driver-error', 'Driver required');
        valid = false;
    }
    if (!routeId) {
        setError('schedule-route-error', 'Route required');
        valid = false;
    }
    if (!departure) {
        setError('schedule-departure-error', 'Departure time required');
        valid = false;
    }
    if (!valid) return;

    const payload = {
        vehicleId: Number(vehicleId),
        driverId: Number(driverId),
        routeId: Number(routeId),
        departureTime: departure,
        arrivalTime: arrival || null
    };

    try {
        await apiRequest('/schedules', { method: 'POST', body: JSON.stringify(payload) });
        scheduleForm.reset();
        await loadSchedules();
    } catch (err) {
        alert('Failed to create schedule: ' + err.message);
    }
});

document.getElementById('schedule-reset').addEventListener('click', () => {
    scheduleForm.reset();
    clearErrors();
});

schedulesTableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'delete') {
        if (!confirm('Delete this schedule?')) return;
        try {
            await apiRequest(`/schedules/${id}`, { method: 'DELETE' });
            await loadSchedules();
        } catch (err) {
            alert('Failed to delete schedule: ' + err.message);
        }
    }
});

// =========================
// Breakdowns
// =========================

const breakdownForm = document.getElementById('breakdown-form');
const breakdownsTableBody = document.querySelector('#breakdowns-table tbody');

async function loadBreakdowns() {
    const breakdowns = await apiRequest('/breakdowns', { method: 'GET' });
    breakdownsTableBody.innerHTML = '';
    breakdowns.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${b.id}</td>
            <td>${b.vehicleId}</td>
            <td>${b.scheduleId || ''}</td>
            <td>${formatDateTime(b.reportedAt)}</td>
            <td>${b.description || ''}</td>
            <td>${b.status}</td>
            <td>
                <button class="btn btn-small btn-secondary" data-status="In Repair" data-id="${b.id}">In Repair</button>
                <button class="btn btn-small btn-secondary" data-status="Resolved" data-id="${b.id}">Resolved</button>
            </td>
        `;
        breakdownsTableBody.appendChild(tr);
    });
}

breakdownForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const vehicleId = document.getElementById('breakdown-vehicle').value;
    const scheduleId = document.getElementById('breakdown-schedule').value;
    const description = document.getElementById('breakdown-description').value.trim();

    let valid = true;
    if (!vehicleId) {
        setError('breakdown-vehicle-error', 'Vehicle required');
        valid = false;
    }
    if (!description) {
        setError('breakdown-description-error', 'Description required');
        valid = false;
    }
    if (!valid) return;

    const payload = {
        vehicleId: Number(vehicleId),
        scheduleId: scheduleId ? Number(scheduleId) : null,
        description
    };

    try {
        await apiRequest('/breakdowns', { method: 'POST', body: JSON.stringify(payload) });
        breakdownForm.reset();
        await loadBreakdowns();
    } catch (err) {
        alert('Failed to report breakdown: ' + err.message);
    }
});

breakdownsTableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const status = btn.getAttribute('data-status');
    try {
        await apiRequest(`/breakdowns/${id}/status?status=${encodeURIComponent(status)}`, { method: 'PUT' });
        await loadBreakdowns();
    } catch (err) {
        alert('Failed to update breakdown status: ' + err.message);
    }
});

// =========================
// Maintenance
// =========================

const maintenanceForm = document.getElementById('maintenance-form');
const maintenanceTableBody = document.querySelector('#maintenance-table tbody');

async function loadMaintenance() {
    const logs = await apiRequest('/maintenance', { method: 'GET' });
    maintenanceTableBody.innerHTML = '';
    logs.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${m.id}</td>
            <td>${m.vehicleId}</td>
            <td>${m.serviceDate}</td>
            <td>${m.description || ''}</td>
            <td>${m.cost != null ? m.cost.toFixed(2) : ''}</td>
            <td>
                <button class="btn btn-small btn-danger" data-action="delete" data-id="${m.id}">Delete</button>
            </td>
        `;
        maintenanceTableBody.appendChild(tr);
    });
}

maintenanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const vehicleId = document.getElementById('maintenance-vehicle').value;
    const serviceDate = document.getElementById('maintenance-date').value;
    const description = document.getElementById('maintenance-description').value.trim();
    const costStr = document.getElementById('maintenance-cost').value.trim();

    let valid = true;
    if (!vehicleId) {
        setError('maintenance-vehicle-error', 'Vehicle required');
        valid = false;
    }
    if (!serviceDate) {
        setError('maintenance-date-error', 'Date required');
        valid = false;
    }
    if (!description) {
        setError('maintenance-description-error', 'Description required');
        valid = false;
    }
    if (!valid) return;

    const cost = costStr ? Number(costStr) : null;
    const payload = {
        vehicleId: Number(vehicleId),
        serviceDate,
        description,
        cost
    };

    try {
        await apiRequest('/maintenance', { method: 'POST', body: JSON.stringify(payload) });
        maintenanceForm.reset();
        await loadMaintenance();
    } catch (err) {
        alert('Failed to add maintenance: ' + err.message);
    }
});

maintenanceTableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'delete') {
        if (!confirm('Delete this maintenance record?')) return;
        try {
            await apiRequest(`/maintenance/${id}`, { method: 'DELETE' });
            await loadMaintenance();
        } catch (err) {
            alert('Failed to delete maintenance record: ' + err.message);
        }
    }
});

// =========================
// Load everything after login
// =========================

async function loadAllData() {
    try {
        await Promise.all([
            loadVehicles(),
            loadDrivers(),
            loadRoutes(),
            loadSchedules(),
            loadBreakdowns(),
            loadMaintenance()
        ]);
    } catch (err) {
        console.error('Failed to load data:', err);
    }
}

// Initial check
checkCurrentUser();

