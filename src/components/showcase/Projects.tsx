import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import software from '../../assets/pictures/projects/software.gif';
import art from '../../assets/pictures/projects/art.gif';
import music from '../../assets/pictures/projects/music.gif';
import threeDIcon from '../../assets/pictures/projects/3d.svg';

export interface ProjectsProps {}

interface ProjectBoxProps {
    icon: string;
    title: string;
    subtitle: string;
    route: string;
    iconStyle: React.CSSProperties;
}

const ProjectBox: React.FC<ProjectBoxProps> = ({
    icon,
    title,
    subtitle,
    route,
    iconStyle,
}) => {
    const [, setIsHovering] = useState(false);
    const navigation = useNavigate();

    const handleClick = () => {
        navigation(`/projects/${route}`);
    };

    const onMouseEnter = () => {
        setIsHovering(true);
    };

    const onMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div
            onMouseDown={handleClick}
            className="big-button-container"
            style={styles.projectLink}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div style={styles.projectLinkLeft}>
                <img
                    src={icon}
                    style={Object.assign(
                        {},
                        styles.projectLinkImage,
                        iconStyle
                    )}
                    alt=""
                />
                <div style={styles.projectText}>
                    <h1 style={{ fontSize: 48 }}>{title}</h1>
                    <h3>{subtitle}</h3>
                </div>
            </div>
            <div style={styles.projectLinkRight}></div>
        </div>
    );
};

const Projects: React.FC<ProjectsProps> = (props) => {
    const { t } = useTranslation();
    return (
        <div className="site-page-content">
            <h1>{t('showcase.projects.title')}</h1>
            <h3>{t('showcase.projects.subtitle')}</h3>
            <br />
            <p>
                {t('showcase.projects.description')}
            </p>
            <br />
            <div style={styles.projectLinksContainer}>
                <ProjectBox
                    icon={software}
                    iconStyle={styles.computerIcon}
                    title={t('showcase.projects.tiles.software.title')}
                    subtitle={t('showcase.projects.tiles.software.subtitle')}
                    route="software"
                />
                <ProjectBox
                    icon={music}
                    iconStyle={styles.musicIcon}
                    title={t('showcase.projects.tiles.music.title')}
                    subtitle={t('showcase.projects.tiles.music.subtitle')}
                    route="music"
                />
                <ProjectBox
                    icon={art}
                    iconStyle={styles.artIcon}
                    title={t('showcase.projects.tiles.art.title')}
                    subtitle={t('showcase.projects.tiles.art.subtitle')}
                    route="art"
                />
                <ProjectBox
                    icon={threeDIcon}
                    iconStyle={styles.threeDIcon}
                    title={t('showcase.projects.tiles.threeD.title')}
                    subtitle={t('showcase.projects.tiles.threeD.subtitle')}
                    route="3d"
                />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    projectLinksContainer: {
        flexDirection: 'column',
        width: '100%',
        display: 'flex',
        flex: 1,
    },
    projectLink: {
        marginBottom: 24,
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',

        alignItems: 'center',
        justifyContent: 'space-between',
    },
    projectText: {
        justifyContent: 'center',
        flexDirection: 'column',
    },
    projectLinkImage: {
        width: 48,
        // height: 48,
        marginRight: 38,
    },
    projectLinkLeft: {
        marginLeft: 16,
        alignItems: 'center',
    },
    computerIcon: {
        width: 56,
        height: 56,
    },
    musicIcon: {
        width: 48,
        height: 48,
    },
    arrowIcon: {
        width: 48,
        height: 48,
    },
    artIcon: {
        width: 21 * 2,
        height: 37 * 2,
    },
    threeDIcon: {
        width: 48,
        height: 48,
    },
};

export default Projects;

