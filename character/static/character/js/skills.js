function skillsApp() {
    return {
        allSkills: [],
        filteredSkills: [],
        expandedId: null,
        filters: { search: '', type: '', school: '', rank: '' },
        uniqueTypes: [],
        uniqueSchools: [],
        uniqueRanks: [],
        loading: false,
        submitting: false,
        showFormModal: false,
        editingSkill: null,
        formData: {},

        async init() {
            await this.fetchSkills();
        },

        async fetchSkills() {
            this.loading = true;
            try {
                const res = await fetch('/skills/');
                const data = await res.json();
                this.allSkills = data.results || data;
                this.buildFilterOptions();
                this.applyFilters();
            } catch (err) {
                console.error('Failed to fetch skills:', err);
            } finally {
                this.loading = false;
            }
        },

        buildFilterOptions() {
            const types = new Set();
            const schools = new Set();
            const ranks = new Set();
            this.allSkills.forEach(s => {
                if (s.type) types.add(s.type);
                if (s.school) schools.add(s.school);
                if (s.rank) ranks.add(s.rank);
            });
            this.uniqueTypes = [...types].sort();
            this.uniqueSchools = [...schools].sort();
            this.uniqueRanks = [...ranks].sort();
        },

        applyFilters() {
            this.filteredSkills = this.allSkills.filter(skill => {
                const matchesSearch = !this.filters.search ||
                    skill.name.toLowerCase().includes(this.filters.search.toLowerCase());
                const matchesType = !this.filters.type || skill.type === this.filters.type;
                const matchesSchool = !this.filters.school || skill.school === this.filters.school;
                const matchesRank = !this.filters.rank || skill.rank === this.filters.rank;
                return matchesSearch && matchesType && matchesSchool && matchesRank;
            });
        },

        // CRUD

        openCreateModal() {
            this.editingSkill = null;
            this.formData = {
                name: '',
                rank: '',
                type: '',
                school: '',
                description: '',
            };
            this.showFormModal = true;
        },

        openEditModal(skill) {
            this.editingSkill = skill;
            this.formData = {
                name: skill.name,
                rank: skill.rank || '',
                type: skill.type || '',
                school: skill.school || '',
                description: skill.description || '',
            };
            this.showFormModal = true;
        },

        async submitForm() {
            if (this.submitting) return;
            this.submitting = true;

            try {
                const url = this.editingSkill
                    ? `/skills/${this.editingSkill.id}/`
                    : '/skills/';
                const method = this.editingSkill ? 'PATCH' : 'POST';

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
                    await this.fetchSkills();
                } else {
                    const errors = await res.json();
                    console.error('Form errors:', errors);
                    alert('Failed to save skill. Check console for details.');
                }
            } catch (err) {
                console.error('Submit error:', err);
            } finally {
                this.submitting = false;
            }
        },

        async deleteSkill(id) {
            if (!confirm('Are you sure you want to delete this skill?')) return;

            try {
                await fetch(`/skills/${id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': this.getCsrfToken() },
                });
                this.allSkills = this.allSkills.filter(s => s.id !== id);
                this.applyFilters();
            } catch (err) {
                console.error('Delete error:', err);
            }
        },

        toggleExpand(id) {
            this.expandedId = this.expandedId === id ? null : id;
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
