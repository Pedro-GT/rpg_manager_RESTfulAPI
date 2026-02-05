function missionsApp() {
    return {
        allMissions: [],
        filteredMissions: [],
        regions: [],
        monsters: [],
        rankChoices: ['S', 'A', 'B', 'C', 'D', 'E', 'F'],
        filters: { search: '', rank: '', region: '' },
        expandedId: null,
        loading: false,
        submitting: false,
        showFormModal: false,
        editingMission: null,
        formData: {},

        async init() {
            await Promise.all([
                this.fetchMissions(),
                this.fetchRegions(),
                this.fetchMonsters(),
            ]);
        },

        async fetchMissions() {
            this.loading = true;
            try {
                const res = await fetch('/mission/missions/');
                const data = await res.json();
                this.allMissions = data.results || data;
                this.applyFilters();
            } catch (err) {
                console.error('Failed to fetch missions:', err);
            } finally {
                this.loading = false;
            }
        },

        async fetchRegions() {
            try {
                const res = await fetch('/regions/');
                const data = await res.json();
                this.regions = data.results || data;
            } catch (err) {
                console.error('Failed to fetch regions:', err);
            }
        },

        async fetchMonsters() {
            try {
                const res = await fetch('/monster/monsters/');
                const data = await res.json();
                this.monsters = data.results || data;
            } catch (err) {
                console.error('Failed to fetch monsters:', err);
            }
        },

        applyFilters() {
            this.filteredMissions = this.allMissions.filter(m => {
                const matchesSearch = !this.filters.search ||
                    m.task.toLowerCase().includes(this.filters.search.toLowerCase());
                const matchesRank = !this.filters.rank || m.rank === this.filters.rank;
                const matchesRegion = !this.filters.region ||
                    String(m.region?.id) === String(this.filters.region);
                return matchesSearch && matchesRank && matchesRegion;
            });
        },

        toggleExpand(id) {
            this.expandedId = this.expandedId === id ? null : id;
        },

        getMonsterName(monsterId) {
            if (!monsterId) return null;
            const monster = this.monsters.find(m => m.id === monsterId);
            return monster ? monster.name : 'Unknown';
        },

        // CRUD

        openCreateModal() {
            this.editingMission = null;
            this.formData = {
                task: '',
                reward: '',
                details: '',
                region_id: '',
                duration: '',
                deadline: '',
                client: '',
                notes: '',
                rank: '',
                monster: '',
            };
            this.showFormModal = true;
        },

        openEditModal(mission) {
            this.editingMission = mission;
            this.formData = {
                task: mission.task || '',
                reward: mission.reward || '',
                details: mission.details || '',
                region_id: mission.region?.id || '',
                duration: mission.duration || '',
                deadline: mission.deadline || '',
                client: mission.client || '',
                notes: mission.notes || '',
                rank: mission.rank || '',
                monster: mission.monster || '',
            };
            this.showFormModal = true;
        },

        async submitForm() {
            if (this.submitting) return;
            this.submitting = true;

            try {
                const payload = {};
                for (const [key, value] of Object.entries(this.formData)) {
                    if (value !== '' && value !== null && value !== undefined) {
                        payload[key] = value;
                    }
                }

                const url = this.editingMission
                    ? `/mission/missions/${this.editingMission.id}/`
                    : '/mission/missions/';
                const method = this.editingMission ? 'PATCH' : 'POST';

                const res = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': this.getCsrfToken(),
                    },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    this.showFormModal = false;
                    await this.fetchMissions();
                } else {
                    const errors = await res.json();
                    console.error('Form errors:', errors);
                    alert('Failed to save mission. Check console for details.');
                }
            } catch (err) {
                console.error('Submit error:', err);
            } finally {
                this.submitting = false;
            }
        },

        async deleteMission(id) {
            if (!confirm('Are you sure you want to delete this mission?')) return;

            try {
                await fetch(`/mission/missions/${id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': this.getCsrfToken() },
                });
                this.allMissions = this.allMissions.filter(m => m.id !== id);
                this.applyFilters();
                if (this.expandedId === id) this.expandedId = null;
            } catch (err) {
                console.error('Delete error:', err);
            }
        },

        closeModal() {
            this.showFormModal = false;
        },

        getCsrfToken() {
            const match = document.cookie.match(/csrftoken=([^;]+)/);
            return match ? match[1] : '';
        },
    };
}
