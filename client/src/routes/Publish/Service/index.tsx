import React, {
    FormEvent,
    PureComponent,
    ChangeEvent
} from 'react'
import Help from '../../../components/atoms/Form/Help'
import ItemForm from './ItemForm'
import styles from './index.module.scss'

interface ServiceProps {
    service: string
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

export default class Service extends PureComponent<ServiceProps> {

    private addService = async (service: string) => {

        const event = {
            currentTarget: {
                name: 'algorithm',
                value: this.props.service
            }
        }
        this.props.onChange(event as any)

        this.forceUpdate()
    }



    public render() {
        const { service, help, placeholder, name, onChange } = this.props

        return (
            <>
                {help && <Help>{help}</Help>}

                {/* Use hidden input to collect stages */}
                <input
                    type="hidden"
                    name={name}
                    value={JSON.stringify(service)}
                    onChange={onChange}
                    data-testid="service"
                />

                <div className={styles.newItems}>

                        <ItemForm
                            placeholder={placeholder}
                            addService={this.addService}
                        />

                </div>
            </>
        )
    }
}
