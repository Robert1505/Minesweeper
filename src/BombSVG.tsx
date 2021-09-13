import React, { ReactElement } from 'react'
import bombSVG from './Assets/bomb.svg';

interface Props {
    
}

export default function BombSVG({}: Props): ReactElement {
    return (
       <img src={bombSVG} height={35} width={35}/>
    )
}
