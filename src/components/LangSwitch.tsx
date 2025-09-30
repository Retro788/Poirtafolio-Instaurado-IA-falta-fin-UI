import React from 'react';
import { useTranslation } from 'react-i18next';

import '../styles/lang-switch.css';

const LangSwitch: React.FC = () => {
    const { i18n, t } = useTranslation();
    const activeLang = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];

    const handleChange = (lng: 'en' | 'es') => () => {
        if (activeLang !== lng) {
            i18n.changeLanguage(lng);
        }
    };

    return (
        <div className="lang-switch pixel-font" role="group" aria-label={t('language.switchLabel')}>
            <button
                type="button"
                className={`lang-btn ${activeLang === 'en' ? 'active' : ''}`.trim()}
                aria-pressed={activeLang === 'en'}
                onClick={handleChange('en')}
            >
                EN
            </button>
            <span className="sep">/</span>
            <button
                type="button"
                className={`lang-btn ${activeLang === 'es' ? 'active' : ''}`.trim()}
                aria-pressed={activeLang === 'es'}
                onClick={handleChange('es')}
            >
                ES
            </button>
        </div>
    );
};

export default LangSwitch;
