import React from 'react'
import styles from './Item.module.scss'
import Dotdotdot from 'react-dotdotdot'

const Item = ({
    item,
    removeStage
}: {
    item: {
        stageType: string
        requirements: string
        inputs: string
        transformation: string
        outputs: string
    }
    removeStage(): void
}) => (
    <li>
        <Dotdotdot clamp={2}>{item.stageType}</Dotdotdot>
        
        <button
            type="button"
            className={styles.remove}
            title="Remove item"
            onClick={removeStage}
        >
            &times;
        </button>
    </li>
)

export default Item
