import React from 'react';
import { Window } from '../os/WindowNew';

export interface WindowExampleProps extends WindowAppProps {}

const WindowExample: React.FC<WindowExampleProps> = (props) => {
    return (
        <Window
            title="Ejemplo de Ventana"
            initialSize={{ width: 600, height: 400 }}
            minSize={{ width: 300, height: 200 }}
            style={{ position: 'absolute' }}
        >
            <div style={{ padding: '10px' }}>
                <h2>Ejemplo de uso del nuevo componente Window</h2>
                <p>Este es un ejemplo de cómo usar el nuevo componente Window con la función safe() para evitar errores TS2345.</p>
                <p>La función safe() devuelve 0 cuando minSize.width o minSize.height son undefined, así Math.max siempre recibe números.</p>
            </div>
        </Window>
    );
};

export default WindowExample;