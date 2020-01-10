import React, { PureComponent } from 'react'
import Input from '../../../components/atoms/Form/Input'
import Button from '../../../components/atoms/Button'
import styles from './ItemForm.module.scss'

interface ItemFormProps {
    addService(service: string): void
    placeholder: string
    placeholders: string[]
}

interface ItemFormStates {
    spec?: string
    specChecksum?: string
    auth: string
    endpoints: string
    hasError: boolean
}

export default class ItemForm extends PureComponent<
    ItemFormProps,
    ItemFormStates
> {
    public state: ItemFormStates = {
        spec: '',
        specChecksum: '',
        auth: '',
        endpoints: '',
        hasError: false,
    }

    private handleSubmit = (e: Event) => {
        e.preventDefault()

        const { spec, specChecksum, auth, endpoints } = this.state

        // return when required fields are empty, and url value is no url
        // Can't use browser validation cause we are in a form within a form
        if (!spec || !specChecksum || !auth || !endpoints) {
            this.setState({ hasError: true })
            return
        }
        const service = {
            spec: spec, 
            specChecksum: specChecksum, 
            auth: auth,
            endpoints: endpoints
        }
        this.props.addService(JSON.stringify(service))
    }

    private onChangeSpec = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ spec: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangeSpecChecksum= (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ specChecksum: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangeAuth = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ auth: e.currentTarget.value })
        this.clearErrors()
    }
    private onChangeEndpoints = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ endpoints: e.currentTarget.value })
        this.clearErrors()
    }

    private clearErrors() {
        if (this.state.hasError) this.setState({ hasError: false })
    }

    public render() {
        const { spec, specChecksum, auth, endpoints, hasError } = this.state

        return (
            <div className={styles.itemForm}>
                <Input
                    label="Spec"
                    name="spec"
                    type="spec"
                    placeholder={this.props.placeholder}
                    value={spec}
                    onChange={this.onChangeSpec}
                    help="Supported specs are ..."
                />
                <Input
                    label="Spec Checksum"
                    name="specChecksum"
                    type="specChecksum"
                    placeholder={this.props.placeholders[0]}
                    value={specChecksum}
                    onChange={this.onChangeSpecChecksum}
                    help="Enter Spec Checksum"
                />
                <Input
                    label="Authorization"
                    name="auth"
                    required
                    type="auth"
                    placeholder={this.props.placeholders[1]}
                    value={auth}
                    onChange={this.onChangeAuth}
                    help="Supported formats:"
                />
                <Input
                    label="Endpoints"
                    name="endpoints"
                    required
                    type="endpoints"
                    placeholder={this.props.placeholders[2]}
                    value={endpoints}
                    onChange={this.onChangeEndpoints}
                    help="Supported formats:"
                />

                <Button onClick={(e: Event) => this.handleSubmit(e)}>
                    Add Service
                </Button>

                {hasError && (
                    <span className={styles.error}>
                        Please fill in all required fields.
                    </span>
                )}
            </div>
        )
    }
}
