import React from 'react';
import './Projects3D.css';

const demos = [
  { title: 'Nova One', url: 'https://nova-one-proyect.vercel.app', description: 'An interactive 3D space exploration game built with Three.js and WebGL.' },
  { title: 'Three.js Journey', url: 'https://threejs-journey.com/', description: 'A comprehensive Three.js learning platform with interactive 3D examples.' },
  { title: 'Bruno Simon Portfolio', url: 'https://bruno-simon.com/', description: 'An award-winning 3D portfolio website showcasing creative WebGL development.' },
  // añade aquí más demos…
];

export interface Projects3DProps {}

const Projects3D: React.FC<Projects3DProps> = (props) => {
  return (
    <div className="site-page-content">
      <h1>3D Projects</h1>
      <h3>Interactive Demos</h3>
      <br />
      <p>
        Below are some of my favorite 3D projects and interactive demos.
        Each project is fully interactive and can be explored directly in the browser.
        Click on any demo to interact with it!
      </p>
      <br />
      
      {demos.map(({ title, url, description }, index) => (
        <div key={url} className="text-block">
          <h2>{title}</h2>
          <br />
          <p>{description}</p>
          <br />
          <div className="captioned-image">
            <div className="iframe-container">
              <iframe
                src={url}
                title={title}
                className="project-iframe"
                allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; xr-spatial-tracking"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
            <p style={styles.caption}>
              <sub>
                <b>Figure {index + 1}:</b> {title} - Interactive 3D Demo
              </sub>
            </p>
          </div>
          <br />
          <h3>Links:</h3>
          <ul>
            <li>
              <a
                rel="noreferrer"
                target="_blank"
                href={url}
              >
                <p>
                  <b>[Live Demo]</b> - {title}
                </p>
              </a>
            </li>
          </ul>
          {index < demos.length - 1 && <br />}
        </div>
      ))}
    </div>
  );
};

const styles: StyleSheetCSS = {
  caption: {
    width: '80%',
  },
};

export default Projects3D;