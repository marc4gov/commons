import React, {
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

interface StagesProps {
    stages: Stage[]
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

    private async getStage(stge: string) {
        const parsedStage = JSON.parse(stge)
        const stage: Stage = {
            "index" : 0,
            "stageType" : parsedStage.stageType,
            "requirements" : {
                "container": {
                    "image": parsedStage.requirements,
                    "tag": "latest",
                    "checksum": "sha256:cb57ecfa6ebbefd8ffc7f75c0f00e57a7fa739578a429b6f72a0df19315deadc"
                }
            },
            "input": parsedStage.input.split(',').map((inp : string, index:number) => { return{
                "index" : index,
                "id" : inp,
            }}),
            "transformation": parsedStage.transformation,
            "output": {  
                "metadataUrl": "https://aquarius.net:5000/api/v1/aquarius/assets/ddo/",
                "secretStoreUrl": "http://secretstore.org:12001",
                "accessProxyUrl": "https://brizo.net:8030/api/v1/brizo/",
                "metadata":  parsedStage.output
              }   
        }
        return stage
    }

    private addStage = async (stge: string) => {

        let stage: Stage | undefined = await this.getStage(stge)
        stage.index = this.props.stages.length
        this.props.stages.push(stage)

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
        const { stages, help, placeholder, placeholders, name, onChange } = this.props
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
                            placeholders={placeholders}
                            addStage={this.addStage}
                        />
                    )}

                </div>
            </>
        )
    }
}
