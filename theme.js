/**
 * Theme Manager - Shared Dark Mode Functionality
 * Used by both index.html and progress.html
 */

const ThemeManager = {
    STORAGE_KEY: 'pi-app-theme',
    THEMES: { LIGHT: 'light', DARK: 'dark' },

    init() {
        const theme = this.getPreferredTheme();
        this.applyTheme(theme);
        this.setupToggleButton();
        this.watchSystemPreference();
        this.updateToggleIcon(theme);
    },

    getPreferredTheme() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved && Object.values(this.THEMES).includes(saved)) {
            return saved;
        }
        return this.getSystemPreference();
    },

    getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? this.THEMES.DARK
            : this.THEMES.LIGHT;
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeLight = document.querySelector('meta[name="theme-color"][media*="light"]');
        const metaThemeDark = document.querySelector('meta[name="theme-color"][media*="dark"]');

        if (theme === this.THEMES.DARK) {
            if (metaThemeLight) metaThemeLight.content = '#1a1a1a';
            if (metaThemeDark) metaThemeDark.content = '#1a1a1a';
        } else {
            if (metaThemeLight) metaThemeLight.content = '#667eea';
            if (metaThemeDark) metaThemeDark.content = '#667eea';
        }
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === this.THEMES.DARK ? this.THEMES.LIGHT : this.THEMES.DARK;
        this.setTheme(next);
    },

    setTheme(theme) {
        this.applyTheme(theme);
        localStorage.setItem(this.STORAGE_KEY, theme);
        this.updateToggleIcon(theme);
    },

    updateToggleIcon(theme) {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');

        if (!sunIcon || !moonIcon) return;

        if (theme === this.THEMES.DARK) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    },

    setupToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    watchSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (!saved) {
                const newTheme = e.matches ? this.THEMES.DARK : this.THEMES.LIGHT;
                this.applyTheme(newTheme);
                this.updateToggleIcon(newTheme);
            }
        });
    }
};

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
    ThemeManager.init();
}
