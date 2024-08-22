import axios from "axios";
import { connectionObj } from "../../config/dB";
import JiraClient from 'jira-client'
import fetch from 'node-fetch';

const email = process.env.JIRA_USERNAME;
const apiToken = process.env.JIRA_API_TOKEN;

const domain = 'mannelabs';

let myIssueTypes:any = ['Risk Accept','Risk Reset','Risk Delete','Risk Mitigate','Training Task','Compliance Task','Audit Task'];

let myStatuses:any = ['Not Started','Approval','Pending','Completed','Overdue','Pending Evidence','Evidence Uploaded','Not Applicable','Terminated']; 

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
}

export const setupJira = async()=>{

    try {
        console.log('Hello');

        //STEP1 for cretaing issue types

        // myIssueTypes.map(async (name:any,index:any)=>{
        //     const apiUrl = `https://${domain}.atlassian.net/rest/api/3/issuetype`;

        //     const bodyData = {
        //         "description":`Description of the new issue type ${name}`,
        //         "name": `${name}`,
        //         "type": "standard",
        //         "hierarchyLevel":`${0}`
        //       };

        //       let result1 = await axios.post(apiUrl, bodyData, {
        //         headers: {
        //           'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        //           'Accept': 'application/json',
        //           'Content-Type': 'application/json'
        //         }
        //       })
        //       .then((response:any) => {
        //         // console.log(
        //         //   `Response: ${response.status} ${response.statusText}`
        //         // );
        //         console.log(`ISSUE TYPE ${index+1} CREATED`)
        //         console.log(response.data);
        //       })
        //       .catch(err => console.error(err));
        // })



        //STEP2 for cretaing Statuses

        //prepare payload for bulk creation

        // let statusesArray:any = [];

        // myStatuses.map((status:any, index:any) => {
        //    let a = {
        //     "description": `${status} description`,
        //     "name": `${status}`,
        //     "statusCategory": "TODO"
        //     }

        //     statusesArray.push(a);
        // });

        // const statusCreatePayload:any = {
        //     "scope": {
        //         "type": "GLOBAL"
        //     },
        //     "statuses": statusesArray
        // };

        // // console.log('GUBJVJ',JSON.stringify(statusCreatePayload))
        // try {
        //     let response = await axios.post(`https://${domain}.atlassian.net/rest/api/3/statuses`, statusCreatePayload, {
        //         headers: {
        //         'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //         }
        //     });
            
        //     // console.log(`Response: ${response.status} ${response.statusText}`);
        //     console.log('ALL STATUSES CREATED')
        //     console.log(response.data);
        
        // } catch (err) {
        //     console.error(err);
        // }





        //STEP 3 CREATE NEW WORKFLOWS WITH THE STATUSES

        // let existingStatuses = await axios.get(`https://${domain}.atlassian.net/rest/api/3/statuses/search`, {
        //     headers: {
        //       'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        //       'Accept': 'application/json',
        //     }
        //   })
        //   .then(response => {
        //     return response.data.values;
        //   })
        //   .catch(err => console.error(err));

        // // console.log('existingStatuses',existingStatuses)

        // dynematrixWorkflows.map(async (workObj:any,index:any)=>{

        //     let presentStatusesArr:any = [];
        //     let idsArray:any = [];

        //     //getting filtered statuses objects for this particular workflow

        //     workObj.requiredStatuses.map((statusName:any)=>{
        //         let findObj = existingStatuses.find((obj:any)=>{return obj.name == statusName});
        //         let a = {id:findObj.id};
        //         let b = {id:findObj.id,name:findObj.name};
        //         idsArray.push(a)
        //         presentStatusesArr.push(b)
        //     })

        //     let myTransitions = createAllToAllTransitions(presentStatusesArr)

        //     const workflowPayload = {
        //         "description": `Description for the worflow ${workObj.name}`,
        //         "name": `${workObj.name}`,
        //         "statuses": idsArray,
        //         "transitions": myTransitions
        //     };

        //     // console.log(`HIIIIIIIIIIIIII${index + 1}`,workflowPayload)

        //     let result = await axios.post(`https://${domain}.atlassian.net/rest/api/3/workflow`, workflowPayload, {
        //         headers: {
        //             'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     .then(response => {
        //         // console.log(`Response: ${response.status} ${response.statusText}`);
        //         console.log(`WORKFLOW ${index+1} Created`)
        //         return response.data;
        //     })
        //     .then(data => console.log(data))
        //     .catch(err => console.error(err));

        // })



        //STEP 4 CREATE A WORKFLOW SCHEME WITH EXISTING ISSUETYPES AND WORKFLOWS

        //get all Issue types
        let globalIssueTypes = await axios.get(`https://${domain}.atlassian.net/rest/api/3/issuetype`, {
            headers: {
              'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
              'Accept': 'application/json',
            }
          })
          .then(response => {
            return response.data;
          })
          .catch(err => console.error(err));
        
        //Prepare Payload for the create workflow scheme call;

        let dynematricWorkflowSchemePayload:any = {
            "defaultWorkflow": "jira",
            "description": "The description of the example NODE SAMPLE WORKFLOW scheme.",
            "name": "DYNEMATRIX SAMPLE WORKFLOW SCHEME",
            "issueTypeMappings": {}
        }

        for(let array of Object.entries(dynematricWorkflowScheme.issueTypeMappings)){
            let issueTypeObj:any = globalIssueTypes.find((obj:any)=>{return obj.name == array[0]});
            if(issueTypeObj != undefined){
                dynematricWorkflowSchemePayload.issueTypeMappings[`${issueTypeObj.id}`] = array[1]
            }
        }

        //create worklow scheme api
        try {
            const response = await axios.post(`https://${domain}.atlassian.net/rest/api/3/workflowscheme`, dynematricWorkflowSchemePayload, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
    
            console.log(`Response: ${response.status} ${response.statusText}`);
            console.log(response.data);
    
        } catch (err) {
            console.error(err);
        }


        
    } catch (error) {
        console.error('Error Setting up to Jira:', error);
    }
}


function createAllToAllTransitions(idsArray:any) {
    const transitions:any = [];

    if (idsArray.length === 0) {
        return transitions;
    }

    // Initial transition
    const initialStatus = idsArray[0];
    transitions.push({
        from: [],
        name: initialStatus.name,
        to: initialStatus.id,
        type: "initial"
    });

    // Directed transitions
    for (let i = 0; i < idsArray.length; i++) {
        for (let j = 0; j < idsArray.length; j++) {
            if (i !== j) {
                transitions.push({
                    from: [idsArray[i].id],
                    name: idsArray[j].name,
                    to: idsArray[j].id,
                    type: "directed"
                });
            }
        }
    }

    return transitions;
}