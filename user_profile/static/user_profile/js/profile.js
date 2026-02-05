function profileApp() {
    return {
        loading: true,
        userId: null,
        username: '',
        profile: {},
        characters: [],
        logs: [],
        logModal: false,
        editingLog: null,
        logForm: { title: '', content: '' },
        submitting: false,
        editingInventory: false,
        inventoryEdit: '',

        init() {
            this.userId = localStorage.getItem('user_id');
            const token = localStorage.getItem('access_token');

            if (!this.userId || !token) {
                window.location.href = '/auth/app/login/';
                return;
            }

            this.fetchProfile();
        },

        getAuthHeaders() {
            return {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            };
        },

        async fetchProfile() {
            this.loading = true;
            try {
                const [profileRes, charsRes] = await Promise.all([
                    fetch(`/user-profile/user-profiles/${this.userId}/`, {
                        headers: this.getAuthHeaders()
                    }),
                    fetch('/characters/', {
                        headers: this.getAuthHeaders()
                    })
                ]);

                if (profileRes.status === 401) {
                    this.handleUnauthorized();
                    return;
                }

                const profileData = await profileRes.json();
                this.profile = profileData;
                this.username = profileData.user_username || `User ${this.userId}`;
                this.inventoryEdit = profileData.inventory || '';

                // Fetch all characters for name resolution
                const charsData = await charsRes.json();
                this.characters = charsData.results || charsData;

                // Fetch logs that belong to this profile
                this.logs = profileData.logs || [];

            } catch (e) {
                console.error('Failed to fetch profile:', e);
            } finally {
                this.loading = false;
            }
        },

        getCharacterName(charId) {
            const char = this.characters.find(c => c.id === charId);
            return char ? `${char.first_name} ${char.last_name}` : `Character #${charId}`;
        },

        async saveInventory() {
            try {
                const res = await fetch(`/user-profile/user-profiles/${this.userId}/`, {
                    method: 'PATCH',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({ inventory: this.inventoryEdit })
                });

                if (res.ok) {
                    this.profile.inventory = this.inventoryEdit;
                    this.editingInventory = false;
                }
            } catch (e) {
                console.error('Failed to save inventory:', e);
            }
        },

        openLogModal(log = null) {
            this.editingLog = log;
            this.logForm = log
                ? { title: log.title, content: log.content }
                : { title: '', content: '' };
            this.logModal = true;
        },

        async submitLog() {
            this.submitting = true;
            try {
                const method = this.editingLog ? 'PATCH' : 'POST';
                const url = this.editingLog
                    ? `/user-profile/logs/${this.editingLog.id}/`
                    : '/user-profile/logs/';

                const res = await fetch(url, {
                    method,
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify(this.logForm)
                });

                if (res.ok) {
                    const logData = await res.json();

                    if (this.editingLog) {
                        const idx = this.logs.findIndex(l => l.id === this.editingLog.id);
                        if (idx !== -1) this.logs[idx] = logData;
                    } else {
                        this.logs.push(logData);
                        // Associate log with profile
                        await this.associateLogToProfile(logData.id);
                    }

                    this.logModal = false;
                }
            } catch (e) {
                console.error('Failed to save log:', e);
            } finally {
                this.submitting = false;
            }
        },

        async associateLogToProfile(logId) {
            const currentLogIds = this.profile.logs ? this.profile.logs.map(l => l.id) : [];
            currentLogIds.push(logId);
            try {
                await fetch(`/user-profile/user-profiles/${this.userId}/`, {
                    method: 'PATCH',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({ logs_data: currentLogIds })
                });
            } catch (e) {
                console.error('Failed to associate log:', e);
            }
        },

        async deleteLog(logId) {
            if (!confirm('Delete this log?')) return;

            try {
                const res = await fetch(`/user-profile/logs/${logId}/`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') }
                });

                if (res.ok) {
                    this.logs = this.logs.filter(l => l.id !== logId);
                }
            } catch (e) {
                console.error('Failed to delete log:', e);
            }
        },

        handleUnauthorized() {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_id');
            window.location.href = '/auth/app/login/';
        },

        logout() {
            const refreshToken = localStorage.getItem('refresh_token');
            fetch('/auth/logout/', {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ refresh_token: refreshToken })
            }).finally(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_id');
                window.location.href = '/auth/app/login/';
            });
        }
    };
}
