import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../showcase/Home';
import About from '../showcase/About';
import Window from '../os/Window';
import Experience from '../showcase/Experience';
import Projects from '../showcase/Projects';
import Contact from '../showcase/Contact';
import SoftwareProjects from '../showcase/projects/Software';
import MusicProjects from '../showcase/projects/Music';
import ArtProjects from '../showcase/projects/Art';
import Projects3D from '../showcase/projects/Projects3D';
import VerticalNavbar from '../showcase/VerticalNavbar';
import { useInitialWindowSize } from '../../hooks/useInitialWindowSize';

export interface ShowcaseExplorerProps extends WindowAppProps {}

const ShowcaseExplorer: React.FC<ShowcaseExplorerProps> = (props) => {
    const { width: initWidth, height: initHeight } = useInitialWindowSize({
        defaultWidth: window.innerWidth - 100,
        defaultHeight: window.innerHeight - 100
    });

    return (
        <Window
            top={24}
            left={56}
            width={initWidth}
            height={initHeight}
            windowTitle="RetroTheDev - Showcase 2022"
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'© Copyright 2022 X'}
        >
            <div className="site-page">
                <VerticalNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                        path="/projects/software"
                        element={<SoftwareProjects />}
                    />
                    <Route
                        path="/projects/music"
                        element={<MusicProjects />}
                    />
                    <Route path="/projects/art" element={<ArtProjects />} />
                    <Route path="/projects/3d" element={<Projects3D />} />
                </Routes>
            </div>
        </Window>
    );
};

export default ShowcaseExplorer;
