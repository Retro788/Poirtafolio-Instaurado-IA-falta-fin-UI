import React from 'react';
import { useTranslation } from 'react-i18next';
import ResumeDownload from './ResumeDownload';

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = (props) => {
    const { t } = useTranslation();
    const hoverBullets = t('showcase.experience.hover.bullets', { returnObjects: true }) as string[];
    const bracsBullets = t('showcase.experience.bracs.bullets', { returnObjects: true }) as string[];
    const kfxCredits = t('showcase.experience.kfx.credits', { returnObjects: true }) as { title: string; url: string; network: string }[];
    return (
        <div className="site-page-content">
            <ResumeDownload />
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>{t('showcase.experience.hover.company')}</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://hover.gg/'}
                        >
                            <h4>{t('showcase.experience.hover.website')}</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>{t('showcase.experience.hover.role')}</h3>
                        <b>
                            <p>{t('showcase.experience.hover.dates')}</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>{t('showcase.experience.hover.description')}</p>
                <br />
                <ul>
                    {hoverBullets.map((item, index) => (
                        <li key={`hover-bullet-${index}`}>
                            <p>{item}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>{t('showcase.experience.bracs.company')}</h1>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={'https://bracs.co/'}
                        >
                            <h4>{t('showcase.experience.bracs.website')}</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>{t('showcase.experience.bracs.role')}</h3>
                        <b>
                            <p>{t('showcase.experience.bracs.dates')}</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>{t('showcase.experience.bracs.description')}</p>
                <br />
                <ul>
                    {bracsBullets.map((item, index) => (
                        <li key={`bracs-bullet-${index}`}>
                            <p>{item}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>{t('showcase.experience.kfx.company')}</h1>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={'https://kfxnyc.com/'}
                        >
                            <h4>{t('showcase.experience.kfx.website')}</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>{t('showcase.experience.kfx.role')}</h3>
                        <b>
                            <p>{t('showcase.experience.kfx.dates')}</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>{t('showcase.experience.kfx.description')}</p>
                <br />
                <h3 style={styles.indent}>{t('showcase.experience.kfx.creditsTitle')}</h3>
                <ul>
                    {kfxCredits.map((credit, index) => (
                        <li style={styles.row} key={`kfx-credit-${index}`}>
                            <p>{credit.title}</p>
                            <p>
                                [
                                <a href={credit.url} target="_blank" rel="noreferrer">
                                    {credit.network}
                                </a>
                                ]
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    header: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    skillRow: {
        flex: 1,
        justifyContent: 'space-between',
    },
    skillName: {
        minWidth: 56,
    },
    skill: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        background: 'red',
        marginLeft: 8,
        height: 8,
    },
    hoverLogo: {
        height: 32,
        marginBottom: 16,
    },
    headerContainer: {
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'center',
    },
    hoverText: {
        marginBottom: 8,
    },
    indent: {
        marginLeft: 24,
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default Experience;



