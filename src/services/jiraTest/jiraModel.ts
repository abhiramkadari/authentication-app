import axios from "axios";
import { connectionObj } from "../../config/dB";
import JiraClient from 'jira-client'
import fetch from 'node-fetch';
import { response } from "express";

const email = process.env.JIRA_USERNAME;
const apiToken = process.env.JIRA_API_TOKEN;

const domain = 'mannelabs';

let myIssueTypes:any = ['Risk Accept','Risk Reset','Risk Delete','Risk Mitigate','Training Task','Compliance Task','Audit Task'];

let myStatuses:any = ['Not Started','Approval','Pending','Completed','Overdue','Pending Evidence','Evidence Uploaded','Not Applicable','Terminated','Approved','Rejected','In Review']; 

let dynematrixWorkflows:any = [
    {
        name:'Risk Apporval Task Workflow 1',
        requiredStatuses:['Pending','Approved','Rejected']
    },
    {
        name:'Risk Mitigate Task Workflow 1',
        requiredStatuses:['Open','In Progress','Approval','In Review','Closed']
    },
    {
        name:'Training Task Workflow 1',
        requiredStatuses:['Not Started','In Progress','Overdue','Completed']
    },
    {
        name:'Audit Task Workflow 1',
        requiredStatuses:['Not Started','In Review','Pending Evidence','Evidence Uploaded','Completed','Not Applicable','Terminated']
    }
];

let dynematricWorkflowScheme:any = {
     "defaultWorkflow": "jira",
    "description": "The description of the example NODE SAMPLE WORKFLOW scheme.",
    "name": "DYNEMATRIX SAMPLE WORKFLOW SCHEME",
    "issueTypeMappings": {
        "Risk Accept" : "Risk Apporval Task Workflow 1",
        "Risk Reset" : "Risk Apporval Task Workflow 1",
        "Risk Delete" : "Risk Apporval Task Workflow 1",
        "Risk Mitigate" : "Risk Mitigate Task Workflow 1",
        "Training Task" : "Training Task Workflow 1",
        "Compliance Task" : "Audit Task Workflow 1",
        "Audit Task" : "Audit Task Workflow 1"
    }
};

let incomingMailId = 'akadari@mannelabs.com';




export const setupJira = async()=>{

    try {
        console.log('Hello');

        //STEP1 for cretaing issue types

        for (const name of myIssueTypes) {
            const apiUrl = `https://${domain}.atlassian.net/rest/api/3/issuetype`;

            const bodyData = {
                "description": `Description of the new issue type ${name}`,
                "name": `${name}`,
                "type": "standard",
                "hierarchyLevel": `${0}`
            };

            try {
                let result1 = await axios.post(apiUrl, bodyData, {
                    headers: {
                        'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`ISSUE TYPE CREATED: ${name}`);
                console.log(result1.data);
            } catch (err) {
                console.error(err);
            }
        }






        //STEP2 for cretaing Statuses

        //prepare payload for bulk creation

        const statusesArray = myStatuses.map((status:any) => ({
            "description": `${status} description`,
            "name": `${status}`,
            "statusCategory": "TODO"
        }));

        const statusCreatePayload:any = {
            "scope": {
                "type": "GLOBAL"
            },
            "statuses": statusesArray
        };

        // console.log('GUBJVJ',JSON.stringify(statusCreatePayload))
        try {
            let response = await axios.post(`https://${domain}.atlassian.net/rest/api/3/statuses`, statusCreatePayload, {
                headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                }
            });
            
            console.log('ALL STATUSES CREATED')
        
        } catch (err) {
            console.error(err);
        }






        //STEP 3 CREATE NEW WORKFLOWS WITH THE STATUSES

        let existingStatuses = await axios.get(`https://${domain}.atlassian.net/rest/api/3/statuses/search`, {
            headers: {
              'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
              'Accept': 'application/json',
            }
          }).then(response => {
            return response.data.values;
          }).catch(err => console.error(err));

        // console.log('existingStatuses',existingStatuses)

        for (const workObj of dynematrixWorkflows) {
            let statusIdsArray = [];
            let presentStatusesArr = [];

            // Filter statuses for this particular workflow
            for (const statusName of workObj.requiredStatuses) {
                const findObj = existingStatuses.find((obj:any) => obj.name === statusName);
                if (findObj) {
                    statusIdsArray.push({ id: findObj.id });
                    presentStatusesArr.push({ id: findObj.id, name: findObj.name });
                }
            }

            const myTransitions = createAllToAllTransitions(presentStatusesArr);

            const workflowPayload = {
                "description": `Description for the workflow ${workObj.name}`,
                "name": `${workObj.name}`,
                "statuses": statusIdsArray,
                "transitions": myTransitions
            };

            try {
                const result = await axios.post(`https://${domain}.atlassian.net/rest/api/3/workflow`, workflowPayload, {
                    headers: {
                        'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`WORKFLOW CREATED: ${workObj.name}`);
                console.log(result.data);
            } catch (err) {
                console.error(err);
            }
        }







        //STEP 4 CREATE A WORKFLOW SCHEME WITH EXISTING ISSUETYPES AND WORKFLOWS

        //get all Issue types

        let globalIssueTypes = await axios.get(`https://${domain}.atlassian.net/rest/api/3/issuetype`, {
            headers: {
              'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
              'Accept': 'application/json',
            }
          }).then(response => {
            return response.data;
          }).catch(err => console.error(err));
        
        //Prepare Payload for the create workflow scheme call;

        let dynematrixWorkflowSchemePayload:any = {
            "defaultWorkflow": "jira",
            "description": "The description of the example NODE SAMPLE WORKFLOW scheme.",
            "name": "DYNEMATRIX SAMPLE WORKFLOW SCHEME 1",
            "issueTypeMappings": {}
        }

        for(let array of Object.entries(dynematricWorkflowScheme.issueTypeMappings)){
            let issueTypeObj:any = globalIssueTypes.find((obj:any)=>{return obj.name == array[0]});
            if(issueTypeObj != undefined){
                dynematrixWorkflowSchemePayload.issueTypeMappings[`${issueTypeObj.id}`] = array[1]
            }
        }

        // create worklow scheme api
        const dynematrixWorkflowScheme = await axios.post(`https://${domain}.atlassian.net/rest/api/3/workflowscheme`, dynematrixWorkflowSchemePayload, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.data;
        })
        .catch(err => console.error(err))

        console.log('CREATED WORKFLOW SCHEME',dynematrixWorkflowScheme)






        // STEP 5 CREATE PROJECT

        const allUsers = await axios.get(`https://${domain}.atlassian.net/rest/api/3/users/search`, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json'
            }
        }).then(response=>{
            return response.data
        }).catch(err=> console.log(err))

        let presentUser = allUsers.find((obj:any)=>{return obj.emailAddress == incomingMailId});

        var projectPayload = {
            "assigneeType": "PROJECT_LEAD",
            "description": "Dynematrix Project Description",
            "key": "DM1",
            "leadAccountId": `${presentUser != undefined ? presentUser.accountId : ""}`,
            "name": "Dynematrix 1",
            "projectTemplateKey": "com.pyxis.greenhopper.jira:gh-simplified-kanban-classic",
            "projectTypeKey": "software"
        };

        const myProject:any = await axios.post(`https://${domain}.atlassian.net/rest/api/3/project`, projectPayload, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.data;
        }).catch(err => console.error(err))

        // INCOMING RESULT OF NEW PROJECTTT {
        //     self: 'https://mannelabs.atlassian.net/rest/api/3/project/10013',
        //     id: 10013,
        //     key: 'DM1'
        //   }






        //STEP 6 ADD OUR ISSUE TYPES TO PROJECT'S ISSUE TYPE SCHEME OTHER THAN (Task, SubTask, story, Bug, Epic)

        //get issuetypeschemes for project

        const myProjectIssueScheme:any = await axios.get(`https://${domain}.atlassian.net/rest/api/3/issuetypescheme/project?projectId=${myProject.id}`, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json'
            }
        }).then(response=>{
            return response.data.values
        }).catch(err=> console.log(err))

        let presentSchemeId:any = myProjectIssueScheme[0].issueTypeScheme.id;

        const myIssueTypeIds = myIssueTypes.map((name:any) => {
            const findObject = globalIssueTypes.find((obj:any) => obj.name === name);
            return findObject ? findObject.id : null;
        }).filter((id:any) => id !== null);

        const issueTypesPayload:any = {
            "issueTypeIds":myIssueTypeIds
        }

        try {
            const addIssueTypesToScheme = await axios.put(`https://${domain}.atlassian.net/rest/api/3/issuetypescheme/${presentSchemeId}/issuetype`, issueTypesPayload, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log('ADDED IDS for scheme', addIssueTypesToScheme);
        } catch (err) {
            console.error(err);
        }








        //STEP7 ASSOCIATE WORKFLOW SCHEME WITH PROJECT OF OUR

        const associateDataPayload:any = {
            "projectId": `${myProject.id}`,
            "workflowSchemeId":`${dynematrixWorkflowScheme.id}`
        };

        const response = await axios.put(`https://${domain}.atlassian.net/rest/api/3/workflowscheme/project`, associateDataPayload, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response=>{
            console.log('associated workflow scheme with project',response.data)
        }).catch(err=> console.log(err))



        
    } catch (error) {
        console.error('Error Setting up to Jira:', error);
    }
}


function createAllToAllTransitions(statusIdsArray:any) {
    const transitions:any = [];

    if (statusIdsArray.length === 0) {
        return transitions;
    }

    // Initial transition
    const initialStatus = statusIdsArray[0];
    transitions.push({
        from: [],
        name: initialStatus.name,
        to: initialStatus.id,
        type: "initial"
    });

    // Directed transitions
    for (let i = 0; i < statusIdsArray.length; i++) {
        for (let j = 0; j < statusIdsArray.length; j++) {
            if (i !== j) {
                transitions.push({
                    from: [statusIdsArray[i].id],
                    name: statusIdsArray[j].name,
                    to: statusIdsArray[j].id,
                    type: "directed"
                });
            }
        }
    }

    return transitions;
}