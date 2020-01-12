import React, { PureComponent, FormEvent, ChangeEvent } from 'react'
import Input from '../../components/atoms/Form/Input'
import Label from '../../components/atoms/Form/Label'
import Row from '../../components/atoms/Form/Row'
import Button from '../../components/atoms/Button'
import { User, Market } from '../../context'
import Files from './Files/'
import Stages from './Stages'
import Algorithm from './Algorithm'
import Service from './Service'

import StepRegisterContent from './StepRegisterContent'
import styles from './Step.module.scss'
import Web3message from '../../components/organisms/Web3message'

interface Fields {
    label: string
    placeholder?: string
    help?: string
    type: string
    required?: boolean
    options?: string
    rows?: number
}

interface StepProps {
    currentStep: number
    index: number
    inputChange(
        event:
            | FormEvent<HTMLInputElement>
            | ChangeEvent<HTMLInputElement>
            | ChangeEvent<HTMLSelectElement>
            | ChangeEvent<HTMLTextAreaElement>
    ): void
    fields?: Fields
    state: any
    title: string
    description: string
    next(): void
    prev(): void
    totalSteps: number
    tryAgain(): void
    toStart(): void
    publishedDid?: string
    content?: string
    addAlgorithm(algo: string): void
    addService(service:string): void
}

export default class Step extends PureComponent<StepProps, {}> {
    public static contextType = User

    public previousButton() {
        const { currentStep, prev } = this.props

        if (currentStep !== 1) {
            return (
                <Button link onClick={prev}>
                    ← Previous
                </Button>
            )
        }
        return null
    }

    public nextButton() {
        const { currentStep, next, totalSteps, state } = this.props

        if (currentStep < totalSteps) {
            return (
                <Button
                    disabled={
                        !state.validationStatus[currentStep].allFieldsValid
                    }
                    onClick={next}
                >
                    Next →
                </Button>
            )
        }
        return null
    }

    public addAlgorithm = async (algo: string) => {
        this.props.addAlgorithm(algo)
    }
    public addService = async (service: string) => {
        this.props.addService(service)
    }

    public render() {
        const {
            currentStep,
            index,
            title,
            description,
            fields,
            inputChange,
            state,
            totalSteps,
            tryAgain,
            toStart,
            content
        } = this.props

        if (currentStep !== index + 1) {
            return null
        }

        const lastStep = currentStep === totalSteps

        console.log(state)
        return (
            <>
                <header className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                </header>

                {fields &&
                    Object.entries(fields).map(([key, value]) => {
                        if (key === 'selection') {
                            const key1 = "files"
                            const filefields = value[key1]
                            switch(state.type) {
                                case "dataset":
                                    return (
                                        <Row key={key1}>
                                            <Label htmlFor={key1} required>
                                                {filefields.label}
                                            </Label>
                                            <Files
                                                placeholder={filefields.placeholder}
                                                name={key1}
                                                help={filefields.help}
                                                files={state.files}
                                                onChange={inputChange}
                                            />
                                        </Row>
                                    )
                                case "workflow":
                                    const key2 = "stages"
                                    const stagefields = value[key2]
                                    return (

                                        <Row key={key2}>
                                            <Label htmlFor={key2} required>
                                                {stagefields.label}
                                            </Label>
                                            <Files
                                                placeholder={filefields.placeholder}
                                                name={key1}
                                                help={filefields.help}
                                                files={state.files}
                                                onChange={inputChange}
                                            />
                                            <Stages
                                                placeholder={stagefields.placeholder}
                                                placeholders={['e.g tensorflow/tensorflow, kong, mysql', 'e.g. did:op:x02d, 123', 'e.g. did:op:x02d', 'e.g. reference to metadata output']}
                                                name={key2}
                                                help={stagefields.help}
                                                stages={state.stages}
                                                onChange={inputChange}
                                            />
                                        </Row>
                                    )
                                case "algorithm":
                                    const key3 = "algorithm"
                                    const algofields = value[key3]
                                    return (
                                        <Row key={key3}>
                                            <Label htmlFor={key3} required>
                                                {algofields.label}
                                            </Label>
                                            <Files
                                                placeholder={filefields.placeholder}
                                                name={key1}
                                                help={filefields.help}
                                                files={state.files}
                                                onChange={inputChange}
                                            />
                                            <Algorithm
                                                placeholder={algofields.placeholder}
                                                placeholders={['a', 'b', 'c', 'd']}
                                                name={key3}
                                                help={algofields.help}
                                                addAlgorithm={this.addAlgorithm}
                                                onChange={inputChange}
                                            />
                                        </Row>
                                    )
                                case "service":
                                    const key4 = "service"
                                    const servicefields = value[key4]
                                    return (
                                        <Row key={key4}>
                                            <Label htmlFor={key4} required>
                                                {servicefields.label}
                                            </Label>
                                            <Files
                                                placeholder={filefields.placeholder}
                                                name={key1}
                                                help={filefields.help}
                                                files={state.files}
                                                onChange={inputChange}
                                            />
                                            <Service
                                                placeholder={servicefields.placeholder}
                                                placeholders={['a', 'b', 'c', 'd']}
                                                name={key4}
                                                help={servicefields.help}
                                                addService={this.addService}
                                                onChange={inputChange}
                                            />
                                        </Row>
                                    )
                                default: 
                                    
                            }
                        }


                        return (
                            <Input
                                key={key}
                                name={key}
                                label={value.label}
                                placeholder={value.placeholder}
                                required={value.required}
                                type={value.type}
                                help={value.help}
                                options={value.options}
                                onChange={inputChange}
                                rows={value.rows}
                                value={(state as any)[key]}
                            />
                        )
                    })}

                {lastStep && (
                    <StepRegisterContent
                        tryAgain={tryAgain}
                        toStart={toStart}
                        state={state}
                        content={content}
                    />
                )}

                <div className={styles.actions}>
                    {this.previousButton()}
                    {this.nextButton()}

                    {lastStep && (
                        <Market.Consumer>
                            {market => (
                                <Button
                                    disabled={
                                        !this.context.isLogged ||
                                        !market.networkMatch ||
                                        this.props.state.isPublishing
                                    }
                                    primary
                                >
                                    Register asset
                                </Button>
                            )}
                        </Market.Consumer>
                    )}
                </div>
                <div className={styles.account}>
                    {!lastStep && <Web3message />}
                </div>
            </>
        )
    }
}
