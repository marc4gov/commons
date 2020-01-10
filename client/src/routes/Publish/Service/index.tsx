import React, {
    FormEvent,
    PureComponent,
    ChangeEvent
} from 'react'
import Help from '../../../components/atoms/Form/Help'
import ItemForm from './ItemForm'
import styles from './index.module.scss'

interface ServiceProps {
    addService(service: string): void
    placeholder: string
    placeholders: string[]
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


export default class Service extends PureComponent<ServiceProps> {

    private addService = async (service: string) => {
        this.props.addService(service)
    }

    public render() {
        const { help, placeholder, placeholders } = this.props

        return (
            <>
                {help && <Help>{help}</Help>}

                <div className={styles.newItems}>
                        <ItemForm
                            placeholder={placeholder}
                            placeholders={placeholders}
                            addService={this.addService}
                        />
                </div>
            </>
        )
    }
}
