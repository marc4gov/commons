import { MetaData, ServiceDefinition } from '@oceanprotocol/squid'

const AssetModelService: MetaData = {
    // OEP-8 Attributes
    // https://github.com/oceanprotocol/OEPs/blob/master/8/v0.4/README.md
    main: {
        name: '',
        type: 'other',
        dateCreated: '',
        author: '',
        license: '',
        price: '',
        files: [],
        service: {
            spec: '',
            specChecksum: '',
            definition: {
                auth: {
                    type: '',
                    user: '',
                    password: '',
                    token: ''
                },
                endpoints: {
                    index: 0,
                    url: '',
                    method: '',
                    contentTypes: []
                }
            }  
        }
    },
    additionalInformation: {
        description: '',
        copyrightHolder: '',
        categories: []
    }
}

export default AssetModelService
