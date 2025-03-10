import { LightningElement } from 'lwc';

export default class CommunityChat extends LightningElement {
    hasRendered = false;

    renderedCallback() {
        if (this.hasRendered) {
            return;
        }
        this.hasRendered = true;

        let script = document.createElement('script');
        script.src = '/embeddedservice/5.0/esw.min.js'; // Load from Salesforce instead of external source
        script.onload = () => {
            this.initESW(null);
        };
        document.body.appendChild(script);
    }

    initESW(gslbBaseURL) {
        embedded_svc.settings.displayHelpButton = true;
        embedded_svc.settings.language = 'en';
        embedded_svc.settings.enabledFeatures = ['LiveAgent'];
        embedded_svc.settings.entryFeature = 'LiveAgent';

        embedded_svc.init(
            'https://kriittechnologies44-dev-ed.develop.my.salesforce.com', 
            'https://kriittechnologies44-dev-ed.develop.my.site.com/', 
            gslbBaseURL,
            '00DdL00000JDyBm', 
            'SEP_Help', 
            {
                baseLiveAgentContentURL: 'https://c.la11-core1.sfdc-y37hzm.salesforceliveagent.com/content',
                deploymentId: '572dL00000C3GED',
                buttonId: '573dL0000035QHt',
                baseLiveAgentURL: 'https://d.la11-core1.sfdc-y37hzm.salesforceliveagent.com/chat',
                eswLiveAgentDevName: 'EmbeddedServiceLiveAgent_Parent04IdL00000062LhUAI_19566070995',
                isOfflineSupportEnabled: false
            }
        );
    }
}
