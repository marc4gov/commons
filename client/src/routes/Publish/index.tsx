import React, { ChangeEvent, Component, FormEvent } from 'react'
import { Logger, File, Workflow, Stage, StageRequirements, StageInput, StageTransformation, StageOutput } from '@oceanprotocol/squid'
import Web3 from 'web3'
import Route from '../../components/templates/Route'
import Form from '../../components/atoms/Form/Form'
import AssetModel from '../../models/AssetModel'
import AssetModelWorkflow from '../../models/AssetModelWorkflow'
import AssetModelService from '../../models/AssetModelService'


import { User, Market } from '../../context'
import Step from './Step'
import Progress from './Progress'
import ReactGA from 'react-ga'
import { allowPricing } from '../../config'
import { steps } from '../../data/form-publish.json'
import Content from '../../components/atoms/Content'
import withTracker from '../../hoc/withTracker'

type AssetType = 'dataset' | 'algorithm' | 'container' | 'workflow' | 'service' | 'other'

// hack to parse form input
interface Stage1 {
    index: number;
    stageType?: string;
    requirements: string;
    input: string;
    transformation: string;
    output: string;
}

interface PublishState {
    name?: string
    dateCreated?: string
    price?: string
    author?: string
    license?: string
    description?: string
    files?: File[]
    type?: AssetType
    copyrightHolder?: string
    categories?: string
    stages?: Stage1[]
    algo?: string
    service?: string
    currentStep?: number
    publishingStep?: number
    isPublishing?: boolean
    isPublished?: boolean
    publishedDid?: string
    publishingError?: string
    validationStatus?: any
}

if (allowPricing) {
    ;(steps as any)[0].fields.price = {
        label: 'Price',
        placeholder: 'Price in Ocean tokens',
        type: 'string',
        required: true,
        help: 'Enter the price of assets in Ocean tokens.'
    }
}

class Publish extends Component<{}, PublishState> {
    public static contextType = User

    public state = {
        name: '',
        dateCreated: new Date().toISOString(),
        description: '',
        files: [],
        stages:[],
        algo: '',
        service: '',
        price: '0',
        author: '',
        type: 'workflow' as AssetType,
        license: '',
        copyrightHolder: '',
        categories: '',
        currentStep: 1,
        isPublishing: false,
        isPublished: false,
        publishedDid: '',
        publishingError: '',
        publishingStep: 0,
        validationStatus: {
            1: { name: false, files: false, stages: false, algo: false, service: false, allFieldsValid: false },
            2: {
                description: false,
                categories: false,
                allFieldsValid: false
            },
            3: {
                author: false,
                copyrightHolder: false,
                license: false,
                allFieldsValid: false
            }
        }
    }

    public addAlgorithm = async (algo: string) => {
        let validationStatus = this.state.validationStatus
        validationStatus[1].algo = true
        this.setState({"algo": algo, "validationStatus" : validationStatus})
        this.runValidation()
    }

    public addService = async (service: string) => {
        let validationStatus = this.state.validationStatus
        validationStatus[1].service = true
        this.setState({"service": service, "validationStatus" : validationStatus})
        this.runValidation()
    }

    private inputChange = (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        this.validateInputs(event.currentTarget.name, event.currentTarget.value)

        this.setState({
            [event.currentTarget.name]: event.currentTarget.value
        })
    }

    private next = () => {
        let { currentStep } = this.state
        const totalSteps = steps.length

        currentStep =
            currentStep >= totalSteps - 1 ? totalSteps : currentStep + 1

        ReactGA.event({
            category: 'Publish',
            action: 'nextStep ' + currentStep
        })

        this.setState({ currentStep })
    }

    private prev = () => {
        let { currentStep } = this.state
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({ currentStep })
    }

    private tryAgain = () => {
        this.setState({ publishingError: '' })
    }

    private toStart = () => {
        this.setState({
            name: '',
            dateCreated: new Date().toISOString(),
            description: '',
            files: [],
            stages:[],
            price: '0',
            author: '',
            type: 'workflow' as AssetType,
            license: '',
            copyrightHolder: '',
            categories: '',
            isPublishing: false,
            isPublished: false,
            publishingStep: 0,
            currentStep: 1
        })
    }

    private validateInputs = (name: string, value: string) => {

        const hasContent = value.length > 0

        // Setting state for all fields
        if (hasContent) {
            this.setState(
                prevState => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [this.state.currentStep]: {
                            ...prevState.validationStatus[
                                this.state.currentStep
                            ],
                            [name]: true
                        }
                    }
                }),
                this.runValidation
            )
        } else {
            this.setState(
                prevState => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [this.state.currentStep]: {
                            ...prevState.validationStatus[
                                this.state.currentStep
                            ],
                            [name]: false
                        }
                    }
                }),
                this.runValidation
            )
        }
    }

    private runValidation = () => {
        const { validationStatus } = this.state
        //
        // Step 1
        //
        if (validationStatus[1].name && (validationStatus[1].files || validationStatus[1].algo || validationStatus[1].service) ) {
            this.setState(prevState => ({
                validationStatus: {
                    ...prevState.validationStatus,
                    1: {
                        ...prevState.validationStatus[1],
                        allFieldsValid: true
                    }
                }
            }))
        } else {
            this.setState(prevState => ({
                validationStatus: {
                    ...prevState.validationStatus,
                    1: {
                        ...prevState.validationStatus[1],
                        allFieldsValid: false
                    }
                }
            }))
        }

        //
        // Step 2
        //
        if (validationStatus[2].description && validationStatus[2].categories) {
            this.setState(prevState => ({
                validationStatus: {
                    ...prevState.validationStatus,
                    2: {
                        ...prevState.validationStatus[2],
                        allFieldsValid: true
                    }
                }
            }))
        } else {
            this.setState(prevState => ({
                validationStatus: {
                    ...prevState.validationStatus,
                    2: {
                        ...prevState.validationStatus[2],
                        allFieldsValid: false
                    }
                }
            }))
        }

        //
        // Step 3
        //
        if (
            validationStatus[3].author &&
            validationStatus[3].copyrightHolder &&
            validationStatus[3].license
        ) {
            this.setState(prevState => ({
                validationStatus: {
                    ...prevState.validationStatus,
                    3: {
                        ...prevState.validationStatus[3],
                        allFieldsValid: true
                    }
                }
            }))
        } else {
            this.setState(prevState => ({
                validationStatus: {
                    ...prevState.validationStatus,
                    3: {
                        ...prevState.validationStatus[3],
                        allFieldsValid: false
                    }
                }
            }))
        }
    }

    private createAsset =  ()  => {
        // remove `found` attribute from all File objects
        // in a new array
        const files = this.state.files.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ found, ...keepAttrs }: { found: boolean }) => keepAttrs
        )

        let main = Object.assign(AssetModel.main, {
            type: this.state.type,
            name: this.state.name,
            dateCreated:
                new Date(this.state.dateCreated)
                    .toISOString()
                    .split('.')[0] + 'Z', // remove milliseconds
            author: this.state.author,
            license: this.state.license,
            price: allowPricing
                ? Web3.utils.toWei(this.state.price, 'ether')
                : this.state.price,
            files
        })
        const additionalInformation = Object.assign(
            AssetModel.additionalInformation,
            {
                description: this.state.description,
                copyrightHolder: this.state.copyrightHolder,
                categories: [this.state.categories]
            }
        )
        switch(this.state.type) {
            case "service": 
                const service = JSON.parse(this.state.service)       
                const endpoints = service.endpoints.split(',').map((url: string, index: number) => { return {
                    "index" : index,
                    "url" : url,
                    "method" : "POST",
                    "contentTypes": ["application/json"]
                }})
                main.service = {
                    spec: service.spec,
                    specChecksum: service.specChecksum,
                    definition: { auth: JSON.parse(service.auth), endpoints: endpoints}
                }
                break;
            case "workflow":
                let arr: Stage[]
                arr = this.state.stages.map( (stage: Stage1, index: number) => { return {
                        "index" : index,
                        "stageType" : stage.stageType,
                        "requirements" : {
                            "container": {
                                "image": stage.requirements,
                                "tag": "latest",
                                "checksum": "sha256:cb57ecfa6ebbefd8ffc7f75c0f00e57a7fa739578a429b6f72a0df19315deadc"
                        },
                        "input": {
                            "index" : 0,
                            "id" : stage.input,
                        },
                        "transformation": {
                            "id": stage.transformation
                        },
                        "output": {  
                            "metadataUrl": "https://aquarius.net:5000/api/v1/aquarius/assets/ddo/",
                            "secretStoreUrl": "http://secretstore.org:12001",
                            "accessProxyUrl": "https://brizo.net:8030/api/v1/brizo/",
                            "metadata":  stage.output
                          }   
                }}})
                main.workflow = {
                    stages: arr
                }
                break;
            case "algorithm":
                const algorithm = JSON.parse(this.state.algo)

                break;
            default: break;        
        }
        return {main: main, additionalInformation: additionalInformation}
    }

    private registerAsset = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        ReactGA.event({ category: 'Publish', action: 'registerAsset-start' })

        this.setState({
            publishingError: '',
            isPublishing: true,
            publishingStep: 0
        })

        const { ocean } = this.context
        const account = await ocean.accounts.list()

        const newAsset = this.createAsset()
        console.log("New Asset: ", newAsset)

        try {
            const asset = await this.context.ocean.assets
                .create(newAsset, account[0])
                .next((publishingStep: number) =>
                    this.setState({ publishingStep })
                )

            this.setState({
                publishedDid: asset.id,
                isPublished: true
            })

            ReactGA.event({
                category: 'Publish',
                action: `registerAsset-end ${asset.id}`
            })
        } catch (error) {
            // make readable errors
            Logger.error('error:', error.message)
            this.setState({ publishingError: error.message })

            ReactGA.event({
                category: 'Publish',
                action: `registerAsset-error ${error.message}`
            })
        }

        this.setState({ isPublishing: false })
    }

    public render() {
        return (
            <Market.Consumer>
                {market => (
                    <Route
                        title="Publish"
                        description={`Publish a new data set into the Ocean Protocol ${market.network} Network.`}
                    >
                        <Content>
                            <Progress
                                steps={steps}
                                currentStep={this.state.currentStep}
                            />

                            <Form onSubmit={this.registerAsset}>
                                {steps.map((step: any, index: number) => (
                                    <Step
                                        key={index}
                                        index={index}
                                        title={step.title}
                                        description={step.description}
                                        currentStep={this.state.currentStep}
                                        fields={step.fields}
                                        inputChange={this.inputChange}
                                        state={this.state}
                                        next={this.next}
                                        prev={this.prev}
                                        totalSteps={steps.length}
                                        tryAgain={this.tryAgain}
                                        toStart={this.toStart}
                                        content={step.content}
                                        addAlgorithm={this.addAlgorithm}
                                        addService={this.addService}
                                    />
                                ))}
                            </Form>
                        </Content>
                    </Route>
                )}
            </Market.Consumer>
        )
    }
}

export default withTracker(Publish)
