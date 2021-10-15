import React, { ReactElement } from 'react'
import flagSVG from './Assets/flag-minesweeper.png';

interface Props {
    
}

export default function FlagSVG({}: Props): ReactElement {
    return (
       <img src={flagSVG} height={35} width={35}/>
    )
}
