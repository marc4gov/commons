import React, { PureComponent } from 'react'
import Input from '../../../components/atoms/Form/Input'
import Button from '../../../components/atoms/Button'
import styles from './ItemForm.module.scss'

interface ItemFormProps {
    addStage(stage: string): void
    placeholder: string
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

    private onChangeUrl = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ stageType: e.currentTarget.value })
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
                    onChange={this.onChangeUrl}
                    help="Supported stagetypes are Filter, Process, Issue, Verify"
                />
                <Input
                    label="Requirements"
                    name="requirements"
                    required
                    type="requirements"
                    placeholder={this.props.placeholder}
                    value={requirements}
                    onChange={this.onChangeUrl}
                    help="Supported requirements are Container images, comma separated"
                />
                <Input
                    label="Inputs"
                    name="inputs"
                    required
                    type="inputs"
                    placeholder={this.props.placeholder}
                    value={inputs}
                    onChange={this.onChangeUrl}
                    help="Supported inputs are DIDs and numbers, comma separated"
                />
                <Input
                    label="Transformation"
                    name="transformation"
                    required
                    type="transformation"
                    placeholder={this.props.placeholder}
                    value={transformation}
                    onChange={this.onChangeUrl}
                    help="Supported transformation: DID of transformation service"
                />               
                <Input
                    label="Outputs"
                    name="outputs"
                    required
                    type="outputs"
                    placeholder={this.props.placeholder}
                    value={outputs}
                    onChange={this.onChangeUrl}
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
