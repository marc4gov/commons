import React, {
    lazy,
    Suspense,
    FormEvent,
    PureComponent,
    ChangeEvent
} from 'react'
import { Stage } from '@oceanprotocol/squid'
import shortid from 'shortid'
import Button from '../../../components/atoms/Button'
import Help from '../../../components/atoms/Form/Help'
import ItemForm from './ItemForm'
import Item from './Item'
import styles from './index.module.scss'

import { serviceUri } from '../../../config'
import cleanupContentType from '../../../utils/cleanupContentType'
import Spinner from '../../../components/atoms/Spinner'

interface StagesProps {
    stages: Stage[]
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

interface StagesStates {
    isFormShown: boolean
}

const buttons = [
    {
        id: 'name',
        title: '+ Add',
        titleActive: '- Cancel'
    }
]

export default class Stages extends PureComponent<StagesProps, StagesStates> {
    public state: StagesStates = {
        isFormShown: false,
    }
    private toggleForm = (e: Event, form: string) => {
        e.preventDefault()

        this.setState({
            isFormShown: !this.state.isFormShown
        })
    }
    private addStage = async (stage: string) => {

        this.props.stages.push(JSON.parse(stage))

        const event = {
            currentTarget: {
                name: 'stages',
                value: this.props.stages
            }
        }
        this.props.onChange(event as any)

        this.setState({
            isFormShown: false
        })

        this.forceUpdate()
    }

    private removeStage = (index: number) => {
        this.props.stages.splice(index, 1)
        const event = {
            currentTarget: {
                name: 'stages',
                value: this.props.stages
            }
        }
        this.props.onChange(event as any)
        this.forceUpdate()
    }

    public render() {
        const { stages, help, placeholder, name, onChange } = this.props
        const { isFormShown } = this.state

        return (
            <>
                {help && <Help>{help}</Help>}

                {/* Use hidden input to collect stages */}
                <input
                    type="hidden"
                    name={name}
                    value={JSON.stringify(stages)}
                    onChange={onChange}
                    data-testid="stages"
                />

                <div className={styles.newItems}>
                    {stages.length > 0 && (
                        <ul className={styles.itemsList}>
                            {stages.map((item: any, index: number) => (
                                <Item
                                    key={shortid.generate()}
                                    item={item}
                                    removeStage={() => this.removeStage(index)}
                                />
                            ))}
                        </ul>
                    )}

                    {buttons.map(button => {
                        const isActive =
                            (isFormShown) 
                        return (
                            <Button
                                key={shortid.generate()}
                                link
                                onClick={(e: Event) =>
                                    this.toggleForm(e, button.id)
                                }
                            >
                                {isActive ? button.titleActive : button.title}
                            </Button>
                        )
                    })}

                    {isFormShown && (
                        <ItemForm
                            placeholder={placeholder}
                            addStage={this.addStage}
                        />
                    )}

                </div>
            </>
        )
    }
}
