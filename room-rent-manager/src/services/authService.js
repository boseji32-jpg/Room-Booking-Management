const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api') + '/auth';

let observers = [];

const notifyObservers = (user) => {
    observers.forEach(observer => observer(user));
};

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    notifyObservers(data.user);
    return data.user;
};

export const register = async (email, password) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    notifyObservers(data.user);
    return data.user;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    notifyObservers(null);
    window.location.reload();
};

export const subscribeToAuth = (callback) => {
    observers.push(callback);

    const userStr = localStorage.getItem('user');
    if (userStr) {
        callback(JSON.parse(userStr));
    } else {
        callback(null);
    }

    return () => {
        observers = observers.filter(obs => obs !== callback);
    };
};
