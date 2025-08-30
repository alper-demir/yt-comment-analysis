import i18n from 'i18next';

// Date Format
export const formatDate = (date, options = {}) => {
    console.log(i18n.language)
    if (!date) return '';
    const locale = i18n.language || 'tr-TR';
    const dt = new Date(date);

    return dt.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    });
};

// Tooltip Date Format
export const formatDateTimeTooltip = (date, options = {}) => {
    if (!date) return '';
    const locale = i18n.language || 'tr-TR';
    const dt = new Date(date);

    return dt.toLocaleString(locale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: locale.startsWith('en'), // AM/PM for en-US
        ...options,
    });
};

// Time ago
export const dateAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const locale = i18n.language || 'tr-TR';

    const translations = {
        'tr-TR': {
            second: 'saniye önce',
            minute: 'dakika önce',
            hour: 'saat önce',
            day: 'gün önce',
        },
        'en-US': {
            second: 'second ago',
            minute: 'minute ago',
            hour: 'hour ago',
            day: 'day ago',
        },
        // other langs
    };

    const t = translations[locale] || translations['tr-TR'];

    if (days > 0) return `${days} ${t.day}`;
    if (hours > 0) return `${hours} ${t.hour}`;
    if (minutes > 0) return `${minutes} ${t.minute}`;
    return `${seconds} ${t.second}`;
};