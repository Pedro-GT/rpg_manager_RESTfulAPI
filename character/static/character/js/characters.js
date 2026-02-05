function charactersApp() {
    return {
        characters: [],
        races: [],
        regions: [],
        allSkills: [],
        filters: { name: '', race: '', region: '' },
        nextCursor: null,
        loading: false,
        submitting: false,
        showFormModal: false,
        showDetailModal: false,
        editingCharacter: null,
        detailCharacter: null,
        formData: {},

        async init() {
            await Promise.all([
                this.fetchRaces(),
                this.fetchRegions(),
                this.fetchSkills(),
            ]);
            await this.fetchCharacters();
            this.setupInfiniteScroll();
        },

        // Data fetching

        async fetchCharacters(append = false) {
            if (this.loading) return;
            this.loading = true;

            try {
                const url = append && this.nextCursor
                    ? this.nextCursor
                    : this.buildFilterUrl();

                const res = await fetch(url);
                const data = await res.json();

                const results = data.results || data;
                if (append) {
                    this.characters = [...this.characters, ...results];
                } else {
                    this.characters = results;
                }
                this.nextCursor = data.next || null;
            } catch (err) {
                console.error('Failed to fetch characters:', err);
            } finally {
                this.loading = false;
            }
        },

        buildFilterUrl() {
            const params = new URLSearchParams();
            if (this.filters.name) params.set('search', this.filters.name);
            if (this.filters.race) params.set('race', this.filters.race);
            if (this.filters.region) params.set('region', this.filters.region);
            const qs = params.toString();
            return '/characters/' + (qs ? '?' + qs : '');
        },

        resetAndFetch() {
            this.characters = [];
            this.nextCursor = null;
            this.fetchCharacters();
        },

        async fetchRaces() {
            try {
                const res = await fetch('/races/');
                const data = await res.json();
                this.races = data.results || data;
            } catch (err) {
                console.error('Failed to fetch races:', err);
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

        async fetchSkills() {
            try {
                const res = await fetch('/skills/');
                const data = await res.json();
                this.allSkills = data.results || data;
            } catch (err) {
                console.error('Failed to fetch skills:', err);
            }
        },

        // Infinite scroll

        setupInfiniteScroll() {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && this.nextCursor && !this.loading) {
                    this.fetchCharacters(true);
                }
            }, { rootMargin: '200px' });
            observer.observe(this.$refs.scrollSentinel);
        },

        // CRUD operations

        openCreateModal() {
            this.editingCharacter = null;
            this.formData = {
                first_name: '',
                last_name: '',
                age: 0,
                race_id: '',
                region_id: '',
                bio: '',
                strength: 10,
                resistence: 10,
                dexterity: 10,
                intelligence: 10,
                charisma: 10,
                luck: 10,
                magic: 10,
                skills_data: [],
                picture: null,
            };
            this.showDetailModal = false;
            this.showFormModal = true;
        },

        openEditModal(char) {
            this.editingCharacter = char;
            this.formData = {
                first_name: char.first_name,
                last_name: char.last_name,
                age: char.age,
                race_id: char.race?.id || '',
                region_id: char.region?.id || '',
                bio: char.bio || '',
                strength: char.strength,
                resistence: char.resistence,
                dexterity: char.dexterity,
                intelligence: char.intelligence,
                charisma: char.charisma,
                luck: char.luck,
                magic: char.magic,
                skills_data: (char.skills || []).map(s => s.id),
                picture: null,
            };
            this.showDetailModal = false;
            this.showFormModal = true;
        },

        toggleSkill(skillId) {
            const idx = this.formData.skills_data.indexOf(skillId);
            if (idx === -1) {
                this.formData.skills_data.push(skillId);
            } else {
                this.formData.skills_data.splice(idx, 1);
            }
        },

        async submitForm() {
            if (this.submitting) return;
            this.submitting = true;

            try {
                const fd = new FormData();
                for (const [key, value] of Object.entries(this.formData)) {
                    if (key === 'skills_data') {
                        value.forEach(id => fd.append('skills_data', id));
                    } else if (key === 'picture') {
                        if (value) fd.append('picture', value);
                    } else if (value !== '' && value !== null && value !== undefined) {
                        fd.append(key, value);
                    }
                }

                const url = this.editingCharacter
                    ? `/characters/${this.editingCharacter.id}/`
                    : '/characters/';
                const method = this.editingCharacter ? 'PATCH' : 'POST';

                const res = await fetch(url, {
                    method,
                    body: fd,
                    headers: { 'X-CSRFToken': this.getCsrfToken() },
                });

                if (res.ok) {
                    this.showFormModal = false;
                    this.resetAndFetch();
                } else {
                    const errors = await res.json();
                    console.error('Form errors:', errors);
                    alert('Failed to save character. Check console for details.');
                }
            } catch (err) {
                console.error('Submit error:', err);
            } finally {
                this.submitting = false;
            }
        },

        async deleteCharacter(id) {
            if (!confirm('Are you sure you want to delete this character?')) return;

            try {
                await fetch(`/characters/${id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': this.getCsrfToken() },
                });
                this.characters = this.characters.filter(c => c.id !== id);
            } catch (err) {
                console.error('Delete error:', err);
            }
        },

        // Detail modal

        openDetailModal(char) {
            this.detailCharacter = char;
            this.showFormModal = false;
            this.showDetailModal = true;
        },

        // Increase age

        async increaseAge() {
            try {
                await fetch('/characters/increase_age/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': this.getCsrfToken(),
                        'Content-Type': 'application/json',
                    },
                });
                this.resetAndFetch();
            } catch (err) {
                console.error('Increase age error:', err);
            }
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
