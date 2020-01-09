import React, {
    FormEvent,
    PureComponent,
    ChangeEvent
} from 'react'
import Help from '../../../components/atoms/Form/Help'
import ItemForm from './ItemForm'
import styles from './index.module.scss'

interface AlgorithmProps {
    addAlgorithm(algo: string): void
    placeholder: string
    help?: string
    name: string
    onChange(
        event:
            | ChangeEvent<HTMLInputElement>
            | FormEvent<HTMLInputElement>
            | ChangeEvent<HTMLSelectElement>
            | ChangeEvent<HTMLTextAreaElement>
    ): void
}

export default class Algorithm extends PureComponent<AlgorithmProps> {

    private addAlgo = async (algo: string) => {
        console.log(algo)
        this.props.addAlgorithm(algo)
    }



    public render() {
        const { help, placeholder } = this.props

        return (
            <>
                {help && <Help>{help}</Help>}

                <div className={styles.newItems}>

                        <ItemForm
                            placeholder={placeholder}
                            addAlgo={this.addAlgo}
                        />

                </div>
            </>
        )
    }
}
