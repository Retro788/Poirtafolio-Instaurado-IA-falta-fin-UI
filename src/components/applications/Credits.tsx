import React, { useEffect, useState } from 'react';
import Window from '../os/Window';
import { useInterval } from 'usehooks-ts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface CreditsProps extends WindowAppProps {}

type CreditsSection = {
    title: string;
    rows: [string, string][];
};

const Credits: React.FC<CreditsProps> = (props) => {
    const { t } = useTranslation();
    const sections = t('credits.sections', { returnObjects: true }) as CreditsSection[];
    const totalSlides = sections.length || 1;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [time, setTime] = useState(0);

    const currentSection: CreditsSection =
        sections.length > 0 ? sections[currentSlide % totalSlides] : { title: '', rows: [] };

    useEffect(() => {
        if (currentSlide >= totalSlides) {
            setCurrentSlide(0);
        }
    }, [currentSlide, totalSlides]);

    useInterval(() => {
        setTime((prev) => prev + 1);
    }, 1000);

    useEffect(() => {
        if (time > 5) {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
            setTime(0);
        }
    }, [time, totalSlides]);

    const nextSlide = () => {
        setTime(0);
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    return (
        <Window
            top={48}
            left={48}
            width={1100}
            height={800}
            windowTitle={t('credits.windowTitle')}
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={t('credits.windowFooter')}
        >
            <div onMouseDown={nextSlide} className="site-page" style={styles.credits}>
                <h2>{t('credits.heading')}</h2>
                <p>{t('credits.subtitle')}</p>
                <br />
                <br />
                <br />
                <div style={styles.slideContainer}>
                    <motion.div
                        animate={{ opacity: 1, y: -20 }}
                        transition={{ duration: 0.5 }}
                        key={`section-${currentSection.title}`}
                        style={styles.section}
                    >
                        <h3 style={styles.sectionTitle}>{currentSection.title}</h3>
                        {currentSection.rows.map((row, index) => (
                            <div key={`row-${index}`} style={styles.row}>
                                <p>{row[0]}</p>
                                <p>{row[1]}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
                <p>{t('credits.clickPrompt')}</p>
                <br />
                <div style={styles.nextSlideTimer}>
                    {Array.from({ length: time }).map((_, index) => (
                        <div key={`timer-${index}`}>
                            <p>.</p>
                        </div>
                    ))}
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    credits: {
        width: '100%',
        backgroundColor: 'black',
        paddingTop: 64,
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 64,
        color: 'white',
        overflow: 'hidden',
    },
    row: {
        overflow: 'none',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: 600,
        alignSelf: 'center',
    },
    section: {
        overflow: 'none',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 32,
        opacity: 0,
    },
    sectionTitle: {
        marginBottom: 32,
    },
    slideContainer: {
        width: '100%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    nextSlideTimer: {
        width: 64,
        height: 32,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
};

export default Credits;
