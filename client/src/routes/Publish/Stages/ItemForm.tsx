import React, { PureComponent } from 'react'
import Input from '../../../components/atoms/Form/Input'
import Button from '../../../components/atoms/Button'
import styles from './ItemForm.module.scss'

interface ItemFormProps {
    addStage(stage: string): void
    placeholder: string
    placeholders: string[]
}

interface ItemFormStates {
    stageType: string
    input: string
    requirements: string
    transformation: string
    output: string
    hasError: boolean
}

export default class ItemForm extends PureComponent<
    ItemFormProps,
    ItemFormStates
> {
    public state: ItemFormStates = {
        stageType: '',
        input: '',
        requirements: '',
        transformation: '',
        output: '',
        hasError: false,
    }

    private handleSubmit = (e: Event) => {
        e.preventDefault()

        const { stageType, input, requirements, transformation, output } = this.state

        // return when required fields are empty, and url value is no url
        // Can't use browser validation cause we are in a form within a form
        if (!stageType || !input || !requirements || !transformation || !output) {
            this.setState({ hasError: true })
            return
        }
        const stage = {stageType: stageType, input: input, requirements: requirements, transformation: transformation, output: output}
        this.props.addStage(JSON.stringify(stage))
    }
    private onChangStageType = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ stageType: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangeInput = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ input: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangeOutput = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ output: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangeTransformation = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ transformation: e.currentTarget.value })
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
        const { stageType, input, requirements, transformation, output, hasError } = this.state

        return (
            <div className={styles.itemForm}>
                <Input
                    label="Stage Type"
                    name="stageType"
                    required
                    type="stageType"
                    placeholder={this.props.placeholder}
                    value={stageType}
                    onChange={this.onChangStageType}
                    help="Supported stagetypes are Filter, Process, Issue, Verify"
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
                    label="Input"
                    name="input"
                    required
                    type="input"
                    placeholder={this.props.placeholders[1]}
                    value={input}
                    onChange={this.onChangeInput}
                    help="Supported inputs are DIDs and numbers, comma separated"
                />
                <Input
                    label="Transformation"
                    name="transformation"
                    required
                    type="transformation"
                    placeholder={this.props.placeholders[2]}
                    value={transformation}
                    onChange={this.onChangeTransformation}
                    help="Supported transformation: DID of transformation service"
                />               
                <Input
                    label="Output"
                    name="output"
                    required
                    type="output"
                    placeholder={this.props.placeholders[3]}
                    value={output}
                    onChange={this.onChangeOutput}
                    help="Supported outputs in order: metadataUrl, secretStoreUrl, accessProxyUrl, metadata"
                />

                <Button onClick={(e: Event) => this.handleSubmit(e)}>
                    Add Stage
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
