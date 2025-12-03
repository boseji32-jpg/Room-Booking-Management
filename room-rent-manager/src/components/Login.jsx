import React, { useState } from 'react';
import { login, register } from '../services/authService';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
        } catch (err) {
            // Improve error messages
            let msg = err.message;
            if (msg.includes('auth/invalid-email')) msg = 'Invalid email address.';
            if (msg.includes('auth/user-not-found')) msg = 'No account found with this email.';
            if (msg.includes('auth/wrong-password')) msg = 'Incorrect password.';
            if (msg.includes('auth/email-already-in-use')) msg = 'Email already in use.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Enter your details to access your account' : 'Get started with your free account'}</p>
                </div>

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <span className="spinner"></span> Processing...
                            </span>
                        ) : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="toggle-auth">
                    <button onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}>
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
