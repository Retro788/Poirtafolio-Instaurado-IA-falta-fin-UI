import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import me from '../../assets/pictures/workingAtComputer.jpg';
import meNow from '../../assets/pictures/currentme.jpg';
import { Link } from 'react-router-dom';
import ResumeDownload from './ResumeDownload';

export interface AboutProps {}

const About: React.FC<AboutProps> = (props) => {
    const { t } = useTranslation();
    return (
        // add on resize listener
        <div className="site-page-content">
            {/* <img src={me} style={styles.topImage} alt="" /> */}
            <h1 style={{ marginLeft: -16 }}>{t('showcase.about.headerTitle')}</h1>
            <h3>{t('showcase.about.headerSubtitle', { name: 'X' })}</h3>
            <br />
            <div className="text-block">
                <p>{t('showcase.about.intro.paragraph1')}</p>
                <br />
                <p>
                    <Trans
                        i18nKey="showcase.about.intro.paragraph2"
                        components={{
                            contactLink: <Link to="/contact" />,
                            emailLink: <a href="mailto:X@gmail.com" />,
                        }}
                    />
                </p>
            </div>
            <ResumeDownload />
            <div className="text-block">
                <h3>{t('showcase.about.aboutMe.title')}</h3>
                <br />
                <p>{t('showcase.about.aboutMe.paragraph1')}</p>
                <br />
                <div className="captioned-image">
                    <img src={me} style={styles.image} alt="" />
                    <p>
                        <sub>
                            <Trans
                                i18nKey="showcase.about.aboutMe.figure1"
                                components={{ bold: <b /> }}
                            />
                        </sub>
                    </p>
                </div>

                <p>
                    <Trans
                        i18nKey="showcase.about.aboutMe.paragraph2"
                        components={{
                            friendLink: (
                                <a
                                    rel="noreferrer"
                                    target="_blank"
                                    href="https://www.linkedin.com/in/scott-bass-189a7919b/"
                                />
                            ),
                            softwareLink: <Link to="/projects/software" />,
                        }}
                    />
                </p>
                <br />
                <p>{t('showcase.about.aboutMe.paragraph3')}</p>
                <br />
                <br />
                <div style={{}}>
                    <div
                        style={{
                            flex: 1,
                            textAlign: 'justify',
                            alignSelf: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <h3>{t('showcase.about.hobbies.title')}</h3>
                        <br />
                        <p>
                            <Trans
                                i18nKey="showcase.about.hobbies.paragraph1"
                                components={{
                                    musicLink: <Link to="/projects/music" />,
                                    artLink: <Link to="/projects/art" />,
                                }}
                            />
                        </p>
                        <br />
                        <p>{t('showcase.about.hobbies.paragraph2')}</p>
                    </div>
                    <div style={styles.verticalImage}>
                        <img src={meNow} style={styles.image} alt="" />
                        <p>
                            <sub>
                                <Trans
                                    i18nKey="showcase.about.hobbies.figure2"
                                    components={{ bold: <b /> }}
                                />
                            </sub>
                        </p>
                    </div>
                </div>
                <br />
                <br />
                <p>
                    <Trans
                        i18nKey="showcase.about.closing.paragraph1"
                        components={{ twitterLink: (
                            <a
                                rel="noreferrer"
                                target="_blank"
                                href="https://twitter.com/X"
                            />
                        ) }}
                    />
                </p>
                <br />
                <p>
                    <Trans
                        i18nKey="showcase.about.closing.paragraph2"
                        components={{
                            contactLink: <Link to="/contact" />,
                            emailLink: <a href="mailto:X@gmail.com" />,
                        }}
                    />
                </p>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    contentHeader: {
        marginBottom: 16,
        fontSize: 48,
    },
    image: {
        height: 'auto',
        width: '100%',
    },
    topImage: {
        height: 'auto',
        width: '100%',
        marginBottom: 32,
    },
    verticalImage: {
        alignSelf: 'center',
        // width: '80%',
        marginLeft: 32,
        flex: 0.8,

        alignItems: 'center',
        // marginBottom: 32,
        textAlign: 'center',
        flexDirection: 'column',
    },
};

export default About;





