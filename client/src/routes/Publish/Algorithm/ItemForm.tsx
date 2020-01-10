import React, { PureComponent } from 'react'
import Input from '../../../components/atoms/Form/Input'
import Button from '../../../components/atoms/Button'
import styles from './ItemForm.module.scss'

interface ItemFormProps {
    addAlgo(algo: string): void
    placeholder: string
    placeholders: string[]
    
}


interface ItemFormStates {
    language: string;
    format?: string;
    version?: string;
    entrypoint: string;
    requirements: string;
    hasError: boolean
}

export default class ItemForm extends PureComponent<
    ItemFormProps,
    ItemFormStates
> {
    public state: ItemFormStates = {
        language: '',
        format: '',
        version: '',
        entrypoint: '',
        requirements: '',
        hasError: false,
    }

    private handleSubmit = (e: Event) => {
        e.preventDefault()

        const { language, format, version, entrypoint, requirements } = this.state

        // return when required fields are empty, and url value is no url
        // Can't use browser validation cause we are in a form within a form
        if (!language || !format || !version || !entrypoint || !requirements) {
            this.setState({ hasError: true })
            return
        }
        const algo = {language: language, format: format, version: version, entrypoint: entrypoint, requirements: requirements}
        this.props.addAlgo(JSON.stringify(algo))
    }

    private onChangeLanguage = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ language: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangFormat = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ format: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangeVersion = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ version: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangeEntrypoint = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ entrypoint: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangeRequirements = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ requirements: e.currentTarget.value })
        this.clearErrors()
    }

    private clearErrors() {
        if (this.state.hasError) this.setState({ hasError: false })
    }

    public render() {
        const {  language, format, version, entrypoint, requirements, hasError } = this.state

        return (
            <div className={styles.itemForm}>
                <Input
                    label="Language"
                    name="language"
                    required
                    type="language"
                    placeholder={this.props.placeholder}
                    value={language}
                    onChange={this.onChangeLanguage}
                    help="Supported languages are Java, Process, Issue, Verify"
                />
                <Input
                    label="Requirements"
                    name="requirements"
                    required
                    type="requirements"
                    placeholder={this.props.placeholders[0]}
                    value={requirements}
                    onChange={this.onChangeRequirements}
                    help="Supported requirements are Container images, comma separated"
                />
                <Input
                    label="Format"
                    name="format"
                    required
                    type="format"
                    placeholder={this.props.placeholders[1]}
                    value={format}
                    onChange={this.onChangFormat}
                    help="Supported formats:"
                />
                <Input
                    label="Entrypoint"
                    name="entrypoint"
                    required
                    type="entrypoint"
                    placeholder={this.props.placeholders[2]}
                    value={entrypoint}
                    onChange={this.onChangeEntrypoint}
                    help="Supported entrypoints:  service"
                />               
                <Input
                    label="Version"
                    name="version"
                    required
                    type="version"
                    placeholder={this.props.placeholders[3]}
                    value={version}
                    onChange={this.onChangeVersion}
                    help="Supported outputs in order: , secretStoreUrl, accessProxyUrl, metadata"
                />

                <Button onClick={(e: Event) => this.handleSubmit(e)}>
                    Add Algorithm
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
