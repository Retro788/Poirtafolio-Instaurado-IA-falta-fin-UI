import '98.css';
import './css/98.extended.css';
import './css/Theme.css';
import './css/App.css';

import { Clippy } from './Clippy';
import { WindowPortal } from './WindowPortal';
import { Bubble } from './BubbleWindow';
import { useChat } from '../contexts/ChatContext';

export function App() {
    const { isChatWindowOpen } = useChat();

    return (
        <div
            className="clippy"
            style={{
                position: 'fixed',
                bottom: 40,
                right: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                pointerEvents: 'none',
                width: '124px',
                height: '93px',
            }}
        >
            {/* enable pointer events only on the assistant elements */}
            <div style={{ pointerEvents: 'auto' }}>
                <Clippy />
            </div>

            <WindowPortal
                width={400}              // ancho = portrait 400px
                height={700}             // alto  = portrait 700px
                bottom={-72}             // distancia al footer
                right={20}               // distancia al icono
                active={isChatWindowOpen}
            >
                {isChatWindowOpen && <Bubble />}
            </WindowPortal>
        </div>
    );
}
