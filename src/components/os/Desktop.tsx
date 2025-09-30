import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import Doom from '../applications/Doom';
import OregonTrail from '../applications/OregonTrail';
import ShutdownSequence from './ShutdownSequence';
// import ThisComputer from '../applications/ThisComputer';
import Henordle from '../applications/Henordle';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import Scrabble from '../applications/Scrabble';
import { IconName } from '../../assets/icons';
import Credits from '../applications/Credits';
import { ClippyAppWrapper } from '../applications/Clippy/ClippyAppWrapper';
import LangSwitch from '../LangSwitch';
import { useTranslation } from 'react-i18next';

export interface DesktopProps {}

type ExtendedWindowAppProps<T> = T & WindowAppProps;

type ApplicationConfig = {
    key: string;
    nameKey: string;
    shortcutIcon: IconName;
    component: React.FC<ExtendedWindowAppProps<any>>;
};

type LocalizedApplication = ApplicationConfig & {
    name: string;
};

type LocalizedApplicationsMap = Record<string, LocalizedApplication>;

const APPLICATIONS: {
    [key in string]: {
        key: string;
        nameKey: string;
        shortcutIcon: IconName;
        component: React.FC<ExtendedWindowAppProps<any>>;
    };
} = {
    // computer: {
    //     key: 'computer',
    //     nameKey: 'desktop.apps.thisComputer',
    //     shortcutIcon: 'computerBig',
    //     component: ThisComputer,
    // },
    showcase: {
        key: 'showcase',
        nameKey: 'desktop.apps.showcase',
        shortcutIcon: 'showcaseIcon',
        component: ShowcaseExplorer,
    },
    trail: {
        key: 'trail',
        nameKey: 'desktop.apps.oregonTrail',
        shortcutIcon: 'trailIcon',
        component: OregonTrail,
    },
    doom: {
        key: 'doom',
        nameKey: 'desktop.apps.doom',
        shortcutIcon: 'doomIcon',
        component: Doom,
    },
    scrabble: {
        key: 'scrabble',
        nameKey: 'desktop.apps.scrabble',
        shortcutIcon: 'scrabbleIcon',
        component: Scrabble,
    },
    henordle: {
        key: 'henordle',
        nameKey: 'desktop.apps.henordle',
        shortcutIcon: 'henordleIcon',
        component: Henordle,
    },
    credits: {
        key: 'credits',
        nameKey: 'desktop.apps.credits',
        shortcutIcon: 'credits',
        component: Credits,
    },
};

const Desktop: React.FC<DesktopProps> = (props) => {
    const { t } = useTranslation();
    const hasOpenedShowcase = useRef(false);
    const applications = useMemo<LocalizedApplicationsMap>(() => {
        const localized = {} as LocalizedApplicationsMap;
        Object.keys(APPLICATIONS).forEach((key) => {
            const app = APPLICATIONS[key];
            localized[key] = {
                ...app,
                name: t(app.nameKey),
            };
        });
        return localized;
    }, [t]);
    const [windows, setWindows] = useState<DesktopWindows>({});

    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);

    const [shutdown, setShutdown] = useState(false);
    const [numShutdowns, setNumShutdowns] = useState(1);

    useEffect(() => {
        if (shutdown === true) {
            rebootDesktop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shutdown]);

    useEffect(() => {
        setWindows((prev) => {
            let updated = false;
            const next: DesktopWindows = { ...prev };
            Object.keys(prev).forEach((key) => {
                const appConfig = applications[key];
                const windowData = prev[key];
                if (appConfig && windowData && windowData.name !== appConfig.name) {
                    next[key] = {
                        ...windowData,
                        name: appConfig.name,
                        icon: appConfig.shortcutIcon,
                    };
                    updated = true;
                }
            });
            return updated ? next : prev;
        });
    }, [applications]);

    const rebootDesktop = useCallback(() => {
        setWindows({});
    }, []);

    const removeWindow = useCallback((key: string) => {
        // Absolute hack and a half
        setTimeout(() => {
            setWindows((prevWindows) => {
                const newWindows = { ...prevWindows };
                delete newWindows[key];
                return newWindows;
            });
        }, 100);
    }, []);

    const minimizeWindow = useCallback((key: string) => {
        setWindows((prevWindows) => {
            const newWindows = { ...prevWindows };
            newWindows[key].minimized = true;
            return newWindows;
        });
    }, []);

    const getHighestZIndex = useCallback((): number => {
        let highestZIndex = 0;
        Object.keys(windows).forEach((key) => {
            const window = windows[key];
            if (window) {
                if (window.zIndex > highestZIndex)
                    highestZIndex = window.zIndex;
            }
        });
        return highestZIndex;
    }, [windows]);

    const toggleMinimize = useCallback(
        (key: string) => {
            const newWindows = { ...windows };
            const highestIndex = getHighestZIndex();
            if (
                newWindows[key].minimized ||
                newWindows[key].zIndex === highestIndex
            ) {
                newWindows[key].minimized = !newWindows[key].minimized;
            }
            newWindows[key].zIndex = getHighestZIndex() + 1;
            setWindows(newWindows);
        },
        [windows, getHighestZIndex]
    );

    const onWindowInteract = useCallback(
        (key: string) => {
            setWindows((prevWindows) => ({
                ...prevWindows,
                [key]: {
                    ...prevWindows[key],
                    zIndex: 1 + getHighestZIndex(),
                },
            }));
        },
        [setWindows, getHighestZIndex]
    );

    const startShutdown = useCallback(() => {
        setTimeout(() => {
            setShutdown(true);
            setNumShutdowns(numShutdowns + 1);
        }, 600);
    }, [numShutdowns]);

    // ðŸ‘‡  NUEVA versiÃ³n â€” evita los "unused vars" y centra cada ventana 
    const openWindow = useCallback(
        (appId: string) => {
            setWindows((prev) => {
                if (prev[appId]) return prev; // ya existe

                const appConfig = applications[appId];
                if (!appConfig) {
                    return prev;
                }

                const AppComponent = appConfig.component;
                const appElement = (
                    <AppComponent
                        onInteract={() => onWindowInteract(appId)}
                        onMinimize={() => minimizeWindow(appId)}
                        onClose={() => removeWindow(appId)}
                    />
                );

                return {
                    ...prev,
                    [appId]: {
                        component: appElement,
                        minimized: false,
                        name: appConfig.name,
                        icon: appConfig.shortcutIcon,
                        zIndex: getHighestZIndex() + 1,
                    },
                };
            });
        },
        [applications, getHighestZIndex, minimizeWindow, onWindowInteract, removeWindow, setWindows]
    );
    const addWindow = useCallback(
        (key: string, element: JSX.Element) => {
            const appConfig = applications[key];
            if (!appConfig) {
                return;
            }
            setWindows((prevState) => ({
                ...prevState,
                [key]: {
                    zIndex: getHighestZIndex() + 1,
                    minimized: false,
                    component: element,
                    name: appConfig.name,
                    icon: appConfig.shortcutIcon,
                },
            }));
        },
        [applications, getHighestZIndex]
    );
    useEffect(() => {
        const newShortcuts: DesktopShortcutProps[] = Object.keys(applications).map((key) => {
            const app = applications[key];
            return {
                shortcutName: app.name,
                icon: app.shortcutIcon,
                onOpen: () => {
                    addWindow(
                        app.key,
                        <app.component
                            onInteract={() => onWindowInteract(app.key)}
                            onMinimize={() => minimizeWindow(app.key)}
                            onClose={() => removeWindow(app.key)}
                            key={app.key}
                        />
                    );
                },
            };
        });

        const showcaseApp = applications['showcase'];
        if (!hasOpenedShowcase.current && showcaseApp) {
            addWindow(
                showcaseApp.key,
                <showcaseApp.component
                    onInteract={() => onWindowInteract(showcaseApp.key)}
                    onMinimize={() => minimizeWindow(showcaseApp.key)}
                    onClose={() => removeWindow(showcaseApp.key)}
                    key={showcaseApp.key}
                />
            );
            hasOpenedShowcase.current = true;
        }

        setShortcuts(newShortcuts);
    }, [applications, addWindow, minimizeWindow, onWindowInteract, removeWindow]);


    return !shutdown ? (
        <div style={styles.desktop}>
            <LangSwitch />
            {/* For each window in windows, loop over and render  */}
            {Object.keys(windows).map((key) => {
                const element = windows[key].component;
                if (!element) return <div key={`win-${key}`}></div>;
                return (
                    <div
                        key={`win-${key}`}
                        style={Object.assign(
                            {},
                            { zIndex: windows[key].zIndex },
                            windows[key].minimized && styles.minimized
                        )}
                    >
                        {React.cloneElement(element, {
                            key,
                            onInteract: () => onWindowInteract(key),
                            onClose: () => removeWindow(key),
                        })}
                    </div>
                );
            })}
            <div style={styles.shortcuts}>
                {shortcuts.map((shortcut, i) => {
                    return (
                        <div
                            style={Object.assign({}, styles.shortcutContainer, {
                                top: i * 104,
                            })}
                            key={shortcut.shortcutName}
                        >
                            <DesktopShortcut
                                icon={shortcut.icon}
                                shortcutName={shortcut.shortcutName}
                                onOpen={shortcut.onOpen}
                            />
                        </div>
                    );
                })}
            </div>
            <Toolbar
                windows={windows}
                toggleMinimize={toggleMinimize}
                shutdown={startShutdown}
            />
            <ClippyAppWrapper />
        </div>
    ) : (
        <ShutdownSequence
            setShutdown={setShutdown}
            numShutdowns={numShutdowns}
        />
    );
};

const styles: StyleSheetCSS = {
    desktop: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: Colors.turquoise,
        position: 'relative',
    },
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#1d2e2f',
    },
    shortcutContainer: {
        position: 'absolute',
    },
    shortcuts: {
        position: 'absolute',
        top: 16,
        left: 6,
    },
    minimized: {
        pointerEvents: 'none',
        opacity: 0,
    },
};

export default Desktop;




