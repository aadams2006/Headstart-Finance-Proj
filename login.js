(function () {
    const STORAGE_KEY_USERS = 'opulusUsers';
    const STORAGE_KEY_SESSION = 'opulusSession';

    const form = document.getElementById('auth-form');
    const feedback = document.getElementById('feedback');
    const tabs = document.querySelectorAll('.tab-group [role="tab"]');
    const nameField = document.querySelector('[data-field="name"]');
    const confirmField = document.querySelector('[data-field="confirm"]');
    const passwordInput = document.getElementById('password');

    let mode = 'login';

    function loadUsers() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_USERS);
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            console.error('Unable to parse stored users', error);
            return [];
        }
    }

    function persistUsers(users) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }

    function createSession(email) {
        const users = loadUsers();
        const match = users.find((user) => user.email === email);
        const sessionData = {
            email,
            name: match ? match.name : '',
            loggedInAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    }

    function updateMode(nextMode) {
        mode = nextMode;
        tabs.forEach((tab) => {
            const isActive = tab.dataset.mode === mode;
            tab.setAttribute('aria-selected', String(isActive));
            tab.setAttribute('aria-pressed', String(isActive));
        });

        const showSignupFields = mode === 'signup';
        nameField.hidden = !showSignupFields;
        confirmField.hidden = !showSignupFields;
        passwordInput.setAttribute('autocomplete', showSignupFields ? 'new-password' : 'current-password');
        form.reset();
        feedback.textContent = '';
        feedback.removeAttribute('data-variant');
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => updateMode(tab.dataset.mode));
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const email = String(formData.get('email') || '').trim().toLowerCase();
        const password = String(formData.get('password') || '');
        const users = loadUsers();

        if (!email || !password) {
            showFeedback('Please complete every required field.', 'error');
            return;
        }

        if (mode === 'signup') {
            const name = String(formData.get('name') || '').trim();
            const confirmPassword = String(formData.get('confirm-password') || '');

            if (!name) {
                showFeedback('Add your name so we can personalize your dashboard.', 'error');
                return;
            }

            if (password.length < 6) {
                showFeedback('Choose a password with at least six characters.', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showFeedback('Passwords need to match before we can continue.', 'error');
                return;
            }

            if (users.some((user) => user.email === email)) {
                showFeedback('Looks like you already have an account. Try logging in instead.', 'error');
                return;
            }

            users.push({
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            });
            persistUsers(users);
            createSession(email);
            showFeedback('Account created! Redirecting you to your workspace…', 'success');
            redirectToDashboard();
            return;
        }

        const existingUser = users.find((user) => user.email === email);
        if (!existingUser || existingUser.password !== password) {
            showFeedback('We couldn’t find a matching account. Double-check your email and password.', 'error');
            return;
        }

        createSession(email);
        showFeedback('Welcome back! Loading your workspace…', 'success');
        redirectToDashboard();
    });

    function redirectToDashboard() {
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    }

    function showFeedback(message, variant) {
        feedback.textContent = message;
        feedback.setAttribute('data-variant', variant);
    }

    // If the user already has an active session, skip the login screen entirely.
    const activeSessionRaw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (activeSessionRaw) {
        try {
            const activeSession = JSON.parse(activeSessionRaw);
            if (activeSession && activeSession.email) {
                window.location.replace('dashboard.html');
            }
        } catch (error) {
            console.error('Unable to parse existing session', error);
        }
    }
})();
