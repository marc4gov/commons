import React, {
    FormEvent,
    PureComponent,
    ChangeEvent
} from 'react'
import { Algorithm } from '@oceanprotocol/squid'
import shortid from 'shortid'
import Button from '../../../components/atoms/Button'
import Help from '../../../components/atoms/Form/Help'
import ItemForm from './ItemForm'
import Item from './Item'
import styles from './index.module.scss'

interface AlgorithmProps {
    algo: string
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


const buttons = [
    {
        id: 'name',
        title: '+ Add',
        titleActive: '- Cancel'
    }
]

export default class Algorithm extends PureComponent<AlgorithmProps> {

    private addStage = async (algorithm: string) => {

        this.props.algo = algorithm

        const event = {
            currentTarget: {
                name: 'algorithm',
                value: this.props.algo
            }
        }
        this.props.onChange(event as any)

        this.forceUpdate()
    }



    public render() {
        const { algo, help, placeholder, name, onChange } = this.props

        return (
            <>
                {help && <Help>{help}</Help>}

                {/* Use hidden input to collect stages */}
                <input
                    type="hidden"
                    name={name}
                    value={JSON.stringify(algo)}
                    onChange={onChange}
                    data-testid="algo"
                />

                <div className={styles.newItems}>

                        <ItemForm
                            placeholder={placeholder}
                            addStage={this.addStage}
                        />

                </div>
            </>
        )
    }
}
