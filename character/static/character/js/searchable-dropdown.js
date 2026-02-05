document.addEventListener('alpine:init', () => {
    Alpine.data('searchSelect', () => ({
        open: false,
        search: '',
        toggle() {
            this.open = !this.open;
            if (this.open) {
                this.search = '';
                this.$nextTick(() => {
                    this.$refs.searchInput?.focus();
                });
            }
        },
        close() {
            this.open = false;
            this.search = '';
        },
    }));
});
