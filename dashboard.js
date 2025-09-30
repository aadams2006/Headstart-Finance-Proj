document.addEventListener('DOMContentLoaded', () => {
    const sessionRaw = localStorage.getItem('opulusSession');
    let session = null;

    try {
        session = sessionRaw ? JSON.parse(sessionRaw) : null;
    } catch (error) {
        console.error('Unable to parse session data', error);
    }

    if (!session || !session.email) {
        window.location.replace('login.html');
        return;
    }

    const nameTarget = document.querySelector('[data-user-name]');
    const emailTarget = document.querySelector('[data-user-email]');
    const sessionTimeTarget = document.querySelector('[data-session-time]');
    const logoutButton = document.getElementById('logout-button');

    if (nameTarget) {
        nameTarget.textContent = session.name || session.email;
    }

    if (emailTarget) {
        emailTarget.textContent = session.email;
    }

    if (sessionTimeTarget) {
        const loggedInAt = session.loggedInAt ? new Date(session.loggedInAt) : null;
        if (loggedInAt && !Number.isNaN(loggedInAt.getTime())) {
            sessionTimeTarget.textContent = loggedInAt.toLocaleString();
        } else {
            sessionTimeTarget.textContent = 'Just now';
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('opulusSession');
            window.location.href = 'login.html';
        });
    }
});
