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
    inputs: string
    requirements: string
    transformation: string
    outputs: string
    hasError: boolean
}

export default class ItemForm extends PureComponent<
    ItemFormProps,
    ItemFormStates
> {
    public state: ItemFormStates = {
        stageType: '',
        inputs: '',
        requirements: '',
        transformation: '',
        outputs: '',
        hasError: false,
    }

    private handleSubmit = (e: Event) => {
        e.preventDefault()

        const { stageType, inputs, requirements, transformation, outputs } = this.state

        // return when required fields are empty, and url value is no url
        // Can't use browser validation cause we are in a form within a form
        if (!stageType || !inputs || !requirements || !transformation || !outputs) {
            this.setState({ hasError: true })
            return
        }
        const stage = {stageType: stageType, inputs: inputs, requirements: requirements, transformation: transformation, outputs: outputs}
        this.props.addStage(JSON.stringify(stage))
    }
    private onChangStageType = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ stageType: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangeInputs = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ inputs: e.currentTarget.value })
        this.clearErrors()
    }

    private onChangeOutputs = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ outputs: e.currentTarget.value })
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
        const { stageType, inputs, requirements, transformation, outputs, hasError } = this.state

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
                    label="Inputs"
                    name="inputs"
                    required
                    type="inputs"
                    placeholder={this.props.placeholders[1]}
                    value={inputs}
                    onChange={this.onChangeInputs}
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
                    label="Outputs"
                    name="outputs"
                    required
                    type="outputs"
                    placeholder={this.props.placeholders[3]}
                    value={outputs}
                    onChange={this.onChangeOutputs}
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
