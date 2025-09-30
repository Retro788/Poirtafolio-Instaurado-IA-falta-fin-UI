import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import colors from '../../constants/colors';
import twitterIcon from '../../assets/pictures/contact-twitter.png';
import ghIcon from '../../assets/pictures/contact-gh.png';
import inIcon from '../../assets/pictures/contact-in.png';
import ResumeDownload from './ResumeDownload';

export interface ContactProps {}

// function to validate email
const validateEmail = (email: string) => {
    const re =
        // eslint-disable-next-line
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

interface SocialBoxProps {
    icon: string;
    link: string;
}

const SocialBox: React.FC<SocialBoxProps> = ({ link, icon }) => {
    return (
        <a rel="noreferrer" target="_blank" href={link}>
            <div className="big-button-container" style={styles.social}>
                <img src={icon} alt="" style={styles.socialImage} />
            </div>
        </a>
    );
};

const Contact: React.FC<ContactProps> = (props) => {
    const { t } = useTranslation();
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formMessage, setFormMessage] = useState('');
    const [formMessageColor, setFormMessageColor] = useState('');

    useEffect(() => {
        if (validateEmail(email) && name.length > 0 && message.length > 0) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [email, name, message]);

    async function submitForm() {
        if (!isFormValid) {
            setFormMessage(t('showcase.contact.validationError'));
            setFormMessageColor('red');
            return;
        }
        try {
            setIsLoading(true);
            const res = await fetch(
                'https://api.X.com/api/contact',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        company,
                        email,
                        name,
                        message,
                    }),
                }
            );
            // the response will be either {success: true} or {success: false, error: message}
            const data = (await res.json()) as
                | {
                      success: false;
                      error: string;
                  }
                | { success: true };
            if (data.success) {
                setFormMessage(t('showcase.contact.success', { name }));
                setCompany('');
                setEmail('');
                setName('');
                setMessage('');
                setFormMessageColor(colors.blue);
                setIsLoading(false);
            } else {
                setFormMessage(data.error);
                setFormMessageColor(colors.red);
                setIsLoading(false);
            }
        } catch (e) {
            setFormMessage(t('showcase.contact.genericError'));
            setFormMessageColor(colors.red);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (formMessage.length > 0) {
            setTimeout(() => {
                setFormMessage('');
                setFormMessageColor('');
            }, 4000);
        }
    }, [formMessage]);

    return (
        <div className="site-page-content">
            <div style={styles.header}>
                <h1>{t('showcase.contact.title')}</h1>
                <div style={styles.socials}>
                    <SocialBox
                        icon={ghIcon}
                        link={'https://github.com/henryjeff'}
                    />
                    <SocialBox
                        icon={inIcon}
                        link={'https://www.linkedin.com/in/X/'}
                    />
                    <SocialBox
                        icon={twitterIcon}
                        link={'https://twitter.com/X'}
                    />
                </div>
            </div>
            <div className="text-block">
                <p>
                    {t('showcase.contact.intro')}
                </p>
                <br />
                <p>
                    <b>{t('showcase.contact.emailLabel')}</b>
                    <a href={`mailto:${t('showcase.contact.emailAddress')}`}>
                        {t('showcase.contact.emailAddress')}
                    </a>
                </p>

                <div style={styles.form}>
                    <label>
                        <p>
                            {!name && <span style={styles.star}>*</span>}
                            <b>{t('showcase.contact.form.nameLabel')}</b>
                        </p>
                    </label>
                    <input
                        style={styles.formItem}
                        type="text"
                        name="name"
                        placeholder={t('showcase.contact.form.namePlaceholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label>
                        <p>
                            {!validateEmail(email) && (
                                <span style={styles.star}>*</span>
                            )}
                            <b>{t('showcase.contact.form.emailLabel')}</b>
                        </p>
                    </label>
                    <input
                        style={styles.formItem}
                        type="email"
                        name="email"
                        placeholder={t('showcase.contact.form.emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>
                        <p>
                            <b>{t('showcase.contact.form.companyLabel')}</b>
                        </p>
                    </label>
                    <input
                        style={styles.formItem}
                        type="company"
                        name="company"
                        placeholder={t('showcase.contact.form.companyPlaceholder')}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />
                    <label>
                        <p>
                            {!message && <span style={styles.star}>*</span>}
                            <b>{t('showcase.contact.form.messageLabel')}</b>
                        </p>
                    </label>
                    <textarea
                        name="message"
                        placeholder={t('showcase.contact.form.messagePlaceholder')}
                        style={styles.formItem}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div style={styles.buttons}>
                        <button
                            className="site-button"
                            style={styles.button}
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            onMouseDown={submitForm}
                        >
                            {!isLoading ? (
                                t('showcase.contact.form.submit')
                            ) : (
                                <p className="loading">{t('showcase.contact.form.sending')}</p>
                            )}
                        </button>
                        <div style={styles.formInfo}>
                            <p
                                style={Object.assign(
                                    {},
                                    { color: formMessageColor }
                                )}
                            >
                                <b>
                                    <sub>
                                        {formMessage ? formMessage : t('showcase.contact.form.forwardingInfo')}
                                    </sub>
                                </b>
                            </p>
                            <p>
                                <sub>
                                    {!isFormValid ? (
                                        <span>
                                            <b style={styles.star}>*</b> = {t('showcase.contact.form.required')}
                                        </span>
                                    ) : (
                                        t('showcase.contact.form.nbsp')
                                    )}
                                </sub>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ResumeDownload altText={t('showcase.contact.resumePrompt')} />
        </div>
    );
};

const styles: StyleSheetCSS = {
    form: {
        flexDirection: 'column',
        marginTop: 32,
    },
    formItem: {
        marginTop: 4,
        marginBottom: 16,
    },
    socialImage: {
        width: 36,
        height: 36,
    },
    buttons: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formInfo: {
        textAlign: 'right',

        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingLeft: 24,
    },
    star: {
        paddingRight: 4,
        color: 'red',
    },
    button: {
        minWidth: 184,
        height: 32,
    },
    header: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    socials: {
        marginBottom: 16,
        justifyContent: 'flex-end',
    },
    social: {
        width: 4,
        height: 4,
        // borderRadius: 1000,

        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
};

export default Contact;




