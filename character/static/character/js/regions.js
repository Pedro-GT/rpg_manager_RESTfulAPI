function regionsApp() {
    return {
        allRegions: [],
        filteredRegions: [],
        searchQuery: '',
        expandedId: null,
        loading: false,
        submitting: false,
        showFormModal: false,
        editingRegion: null,
        formData: {},

        async init() {
            await this.fetchRegions();
        },

        async fetchRegions() {
            this.loading = true;
            try {
                const res = await fetch('/regions/');
                const data = await res.json();
                this.allRegions = data.results || data;
                this.applyFilter();
            } catch (err) {
                console.error('Failed to fetch regions:', err);
            } finally {
                this.loading = false;
            }
        },

        applyFilter() {
            if (!this.searchQuery) {
                this.filteredRegions = this.allRegions;
                return;
            }
            const q = this.searchQuery.toLowerCase();
            this.filteredRegions = this.allRegions.filter(r =>
                r.name.toLowerCase().includes(q)
            );
        },

        toggleExpand(id) {
            this.expandedId = this.expandedId === id ? null : id;
        },

        // CRUD

        openCreateModal() {
            this.editingRegion = null;
            this.formData = { name: '', description: '' };
            this.showFormModal = true;
        },

        openEditModal(region) {
            this.editingRegion = region;
            this.formData = {
                name: region.name,
                description: region.description || '',
            };
            this.showFormModal = true;
        },

        async submitForm() {
            if (this.submitting) return;
            this.submitting = true;

            try {
                const url = this.editingRegion
                    ? `/regions/${this.editingRegion.id}/`
                    : '/regions/';
                const method = this.editingRegion ? 'PATCH' : 'POST';

                const res = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': this.getCsrfToken(),
                    },
                    body: JSON.stringify(this.formData),
                });

                if (res.ok) {
                    this.showFormModal = false;
                    await this.fetchRegions();
                } else {
                    const errors = await res.json();
                    console.error('Form errors:', errors);
                    alert('Failed to save region. Check console for details.');
                }
            } catch (err) {
                console.error('Submit error:', err);
            } finally {
                this.submitting = false;
            }
        },

        async deleteRegion(id) {
            if (!confirm('Are you sure you want to delete this region?')) return;

            try {
                await fetch(`/regions/${id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': this.getCsrfToken() },
                });
                this.allRegions = this.allRegions.filter(r => r.id !== id);
                this.applyFilter();
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
