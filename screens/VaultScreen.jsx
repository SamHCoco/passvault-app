import React from 'react';
import { Text } from 'react-native';
import Screen from '../components/Screen';
import Tile from '../components/Tile';


function VaultScreen(props) {
    const data = [
        {
            id: 1,
            username: 'john.smith@email.co.uk',
            password: 'password1'
        },
        {
            id: 2,
            username: 'ella.star@email.co.uk',
            password: 'password2'
        }
    ];

    return (
           <Screen>
                {data.map((item) => (
                    <Tile key={item.id} data={item} />
                ))}
           </Screen>
        
    );
}

export default VaultScreen;