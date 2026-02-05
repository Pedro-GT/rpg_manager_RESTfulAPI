function monstersApp() {
    return {
        allMonsters: [],
        filteredMonsters: [],
        regions: [],
        rankChoices: ['S', 'A', 'B', 'C', 'D', 'E', 'F'],
        filters: { search: '', rank: '', region: '' },
        loading: false,
        submitting: false,
        showFormModal: false,
        showDetailModal: false,
        editingMonster: null,
        detailMonster: null,
        formData: {},

        async init() {
            await Promise.all([
                this.fetchMonsters(),
                this.fetchRegions(),
            ]);
        },

        async fetchMonsters() {
            this.loading = true;
            try {
                const res = await fetch('/monster/monsters/');
                const data = await res.json();
                this.allMonsters = data.results || data;
                this.applyFilters();
            } catch (err) {
                console.error('Failed to fetch monsters:', err);
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

        applyFilters() {
            this.filteredMonsters = this.allMonsters.filter(m => {
                const matchesSearch = !this.filters.search ||
                    m.name.toLowerCase().includes(this.filters.search.toLowerCase());
                const matchesRank = !this.filters.rank || m.rank === this.filters.rank;
                const matchesRegion = !this.filters.region ||
                    String(m.region?.id) === String(this.filters.region);
                return matchesSearch && matchesRank && matchesRegion;
            });
        },

        // CRUD

        openCreateModal() {
            this.editingMonster = null;
            this.formData = {
                name: '',
                type: '',
                rank: '',
                region_id: '',
                bio: '',
                picture: null,
            };
            this.showDetailModal = false;
            this.showFormModal = true;
        },

        openEditModal(monster) {
            this.editingMonster = monster;
            this.formData = {
                name: monster.name,
                type: monster.type || '',
                rank: monster.rank || '',
                region_id: monster.region?.id || '',
                bio: monster.bio || '',
                picture: null,
            };
            this.showDetailModal = false;
            this.showFormModal = true;
        },

        async submitForm() {
            if (this.submitting) return;
            this.submitting = true;

            try {
                const fd = new FormData();
                for (const [key, value] of Object.entries(this.formData)) {
                    if (key === 'picture') {
                        if (value) fd.append('picture', value);
                    } else if (value !== '' && value !== null && value !== undefined) {
                        fd.append(key, value);
                    }
                }

                const url = this.editingMonster
                    ? `/monster/monsters/${this.editingMonster.id}/`
                    : '/monster/monsters/';
                const method = this.editingMonster ? 'PATCH' : 'POST';

                const res = await fetch(url, {
                    method,
                    body: fd,
                    headers: { 'X-CSRFToken': this.getCsrfToken() },
                });

                if (res.ok) {
                    this.showFormModal = false;
                    await this.fetchMonsters();
                } else {
                    const errors = await res.json();
                    console.error('Form errors:', errors);
                    alert('Failed to save monster. Check console for details.');
                }
            } catch (err) {
                console.error('Submit error:', err);
            } finally {
                this.submitting = false;
            }
        },

        async deleteMonster(id) {
            if (!confirm('Are you sure you want to delete this monster?')) return;

            try {
                await fetch(`/monster/monsters/${id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': this.getCsrfToken() },
                });
                this.allMonsters = this.allMonsters.filter(m => m.id !== id);
                this.applyFilters();
            } catch (err) {
                console.error('Delete error:', err);
            }
        },

        // Detail modal

        openDetailModal(monster) {
            this.detailMonster = monster;
            this.showFormModal = false;
            this.showDetailModal = true;
        },

        // Utilities

        closeModals() {
            this.showFormModal = false;
            this.showDetailModal = false;
        },

        getCsrfToken() {
            const match = document.cookie.match(/csrftoken=([^;]+)/);
            return match ? match[1] : '';
        },
    };
}
