import {Food} from './Food';
import {Sleep} from './Sleep';
import {useState} from 'react';

export const Ezfit = () => {
    const [mode, setMode] = useState('food')

    let currentComponent = mode === 'food' ? <Food /> : <Sleep />

    return (
        <div>
            {currentComponent}
            <select class="mode-select" onChange={e => setMode(e.target.value)}>
                <option value="food">Food</option>
                <option value="sleep">Sleep</option>
            </select>
        </div>
    )
}

