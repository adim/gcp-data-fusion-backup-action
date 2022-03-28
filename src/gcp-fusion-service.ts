import axios from 'axios';
const {GoogleAuth} = require('google-auth-library');


export class GCPFusionService {
    private readonly fusionUrl: string;
    private googleAuth: any;
    constructor(fusionUrl: string) {
        this.fusionUrl = fusionUrl;
        this.googleAuth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
          });    
    }

    async getNamespaces(): Promise<string[]> {
        const tokenApi = await this.googleAuth.getAccessToken();
        const token = tokenApi.toString().split('...')[0];
        const response = await axios.request<any>({      
            url: `https://${this.fusionUrl}/api/v3/namespaces`,
            headers: {'Authorization': 'Bearer '+token}
            
        });
        return response.data.map(x => x.name);
    }
    async getNamespacePipelines(namespace: string): Promise<string[]> {
        const tokenApi = await this.googleAuth.getAccessToken();
        const token = tokenApi.toString().split('...')[0];
        const response = await axios.request<any>({      
            url: `https://${this.fusionUrl}/api/v3/namespaces/${namespace}/apps`,
            headers: {'Authorization': 'Bearer '+token}
            
        });
        return response.data.map(x => x.name);
    }

    async getPipeline(namespace: string,pipeline: string): Promise<any> {
        const tokenApi = await this.googleAuth.getAccessToken();
        const token = tokenApi.toString().split('...')[0];
        const response = await axios.request<any>({      
            url: `https://${this.fusionUrl}/api/v3/namespaces/${namespace}/apps/${pipeline}`,
            headers: {'Authorization': 'Bearer '+token}
            
        });
        return response.data;
    }
}
