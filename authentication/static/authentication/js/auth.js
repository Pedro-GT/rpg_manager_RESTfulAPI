function authApp() {
    return {
        mode: 'login',
        submitting: false,
        error: '',
        success: '',
        loginData: { username: '', password: '' },
        registerData: { username: '', password: '', confirmPassword: '' },

        init() {
            const token = localStorage.getItem('access_token');
            if (token) {
                window.location.href = '/app/characters/';
            }
        },

        async login() {
            this.error = '';
            this.success = '';
            this.submitting = true;

            try {
                const res = await fetch('/auth/login/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.loginData.username,
                        password: this.loginData.password
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    this.error = data.error || 'Login failed.';
                    return;
                }

                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user_id', data.user);
                window.location.href = '/app/characters/';
            } catch (e) {
                this.error = 'Network error. Please try again.';
            } finally {
                this.submitting = false;
            }
        },

        async register() {
            this.error = '';
            this.success = '';

            if (this.registerData.password !== this.registerData.confirmPassword) {
                this.error = 'Passwords do not match.';
                return;
            }

            this.submitting = true;

            try {
                const res = await fetch('/auth/register/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.registerData.username,
                        password: this.registerData.password
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    const msg = data.username?.[0] || data.password?.[0] || data.error || 'Registration failed.';
                    this.error = msg;
                    return;
                }

                this.success = 'Account created! You can now sign in.';
                this.registerData = { username: '', password: '', confirmPassword: '' };
                this.mode = 'login';
            } catch (e) {
                this.error = 'Network error. Please try again.';
            } finally {
                this.submitting = false;
            }
        }
    };
}
