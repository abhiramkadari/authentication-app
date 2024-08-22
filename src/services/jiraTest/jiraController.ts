import axios from "axios";
import { connectionObj } from "../../config/dB";
import JiraClient from 'jira-client'
import fetch from 'node-fetch';


// Initialize
const jira = new JiraClient({
    protocol: 'https',                      // Use 'http' if not using SSL
    host: 'mannelabs.atlassian.net',      // Replace with your Jira host
    username: process.env.JIRA_USERNAME,    // Your Jira email or username from .env
    password: process.env.JIRA_API_TOKEN,   // API token for cloud or password for server
    apiVersion: '2',                        // Jira API version
    strictSSL: true                         // Set to false if your Jira server uses a self-signed SSL certificate
});

const email = process.env.JIRA_USERNAME;
const apiToken = process.env.JIRA_API_TOKEN;

export const testJira = async()=>{
    console.log('Hello')

    try {

        // 1.const currentUser = await getCurrentUser();
        // console.log('Successfully connected to Jira:', currentUser);


        // // 2.Fetch all projects
        // const projects = await getAllProjects();
        // console.log('All Projects:', projects);


        // 3.for creating project
        // createSimpleJiraProject('TEST FOR SCREEN', 'HII')
        //     .then(project => {
        //         console.log('Project created successfully:', project);
        //     })
        //     .catch(error => {
        //         console.error('Failed to create project:', error);
        //     });


        //for deleting a project
        // const a = await deleteProject()


        // 4.getMYorOTHERaccount info
        // const givenUser = await getUserInformation('bgajjela@crystallinesoft.com');


        // 5.createTicketorIssueintoExistingProject
        // const createTikcet = await addNewTicket()


        // 6 get iisue from project'
        // const getTicket = await getIssue('DMA-54')


        //7 delete issue
        // const a = await deleteIssue('DMR-43')


        //8 update issue
        // const b = await updateIssueTicket('DMA-54')


        //9 add comment to ticket in project
        // let a = addCommentToIssue('DMA-54', 'This is a ABHIRAM Commenting second time from node api');


        //10get comments of a tikcte
        // const b = await getCommentsofTicket('DMA-54')


        //11 move tickets to backlog
        // const b = await moveIssuesToBacklog(['DMA-54'])


        // 12 search any thing in jira like proects tickets issue filters something acc to requirement
        // const b = await searchJiraTotal()


        // 13 get all possible status of issue
        // const statuses = await jira.listStatus();
        // console.log('issuee',statuses)


        // 13 get all avilable transitions of issue
        // const transitions = await jira.listTransitions('APITEST4-1');
        // console.log('issuee',transitions)


        // 14 update transition to ticket
        // middle number is the tarnsition id;
        // const transitions = await changeIssueTransition('DMA-54', 11, { comment: 'Moving to In Completed' })
        //     .then(() => {
        //         console.log('Transition complete.');
        //     })
        //     .catch(error => {
        //         console.error('Failed to transition issue:', error);
        //     });


        // 15 deleting issues in project
        // i dont have perimsiion to delete
        // const issueIdOrKey = 'DMA-54';
        // await jira.deleteIssue(issueIdOrKey)
        // console.log(`Issue ${issueIdOrKey} deleted successfully.`);




        // 16 get all issue trypes
        // const issueTypes = await jira.listIssueTypes();
        // console.log('Issue Types:', issueTypes);



        // 17 create a new issue type
        // const newIssueType = await createNewIssueTypeInJira()

         // 20 assign the default scheme to project of ours
        // const createITScheme = await assignIssueTypeSchemeToProject()






        //workflow related content below

        // 18 get all workflows
        // const workflowss = await getAllWorkflows()

        //19.1 create a new workflow
        // const createworkflow = await createNewWorkflow()


        // 19.2 create a new workflow scheme
        // const create = await createWorkflowScheme()
       

        // 19.3 get all workflow schemes and delete some
        // const a = await getWorkflowSchemesAndPerform()

        // 19.4 get project workflow schemes and associate workflow scheme for project
        // const b = await associateWorlflowSchemeForProject()

        // 20 add issurtype to a workflow scheme
        // const isuueType = await setIssueTypeForworkflowscheme()


        // 21 GET ALL STATUSES
        // const a = await getAllStatusInJira()

        // 22create statuses
        // const a = await createBulkStatuses()

        // 23 create issue with api
        // const b = await createIssueWithAPi()
        // return b


        // 24 GET SCREENS
        const b = await getScreens()

        // 15 get priorities
        // const c = getPrioritiesForIssue()
        // console.log('getPrioritiesForIssue:', c);
        

      } catch (error) {
        console.error('Error connecting to Jira:', error);
      }

}

const getPrioritiesForIssue = async()=>{
    fetch('https://mannelabs.atlassian.net/rest/api/3/priority', {
        method: 'GET',
        headers: {
          'Authorization':`Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
        .then(response => {
          console.log(
            `Response: ${response.status} ${response.statusText}`
          );
          return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
}

// Method to get the current user
const getCurrentUser = async () => {
    try {
        return await jira.getCurrentUser();
    } catch (error) {
        console.error('Error fetching current user:', error);
    }
};

// Method to get all projects
const getAllProjects = async () => {
    try {
        return await jira.listProjects();
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};


// Method to get the user Information
const getUserInformation = async (username:any) => {
    try {
        const users = await jira.searchUsers({ query: username });
        console.log("USER OBJECT",users)
        if (users && users.length > 0) {
            return users[0] // Assuming the first match is the desired user
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user accountId:', error);
        throw error;
    }
};

const createSimpleJiraProject = async (projectName:any, projectKey:any) => {
    
    try {
        // const accountId = await getUserAccountId(process.env.JIRA_USERNAME);
        const user = await jira.getCurrentUser();
        console.log("USER OBJECT",user);

        let myId = user.accountId

        // const OURHEADID = await getUserAccountId('ranjith@crystallinesoft.com');
        // const LeadaccountId = OURHEADID 

        let payload:any = {
            key: projectKey,
            name: projectName,
            "leadAccountId": myId,
            projectTypeKey: 'software', 
            description: 'Description of the new project from node while creating',
            assigneeType: 'UNASSIGNED',
            projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-kanban-classic'
        };

        // com.pyxis.greenhopper.jira:gh-simplified-kanban-classic
        //company managed software project link

        const project = await jira.createProject(payload);

        console.log(`Project created: ${project.name} (${project.key})`);
        console.log('whole project object',project)
        // return project;
    } catch (error) {
        console.error('Error creating project:', error);
    }
};

const deleteProject = async()=>{
    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;

    let myProjectKey = 'APITEST'

    const apiUrl = `https://mannelabs.atlassian.net/rest/api/3/project/${myProjectKey}`;

    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        }
      })
      .then(response => {
            console.log(
            `Response ABhiram: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
}


//adding ticket into project
const addNewTicket = async () => {
    try {
        const givenUser = await getUserInformation('akadari@mannelabs.com');
        console.log('givenUser',givenUser)

        // let issue:any = {
        //     fields: {
        //         project: {
        //             key: 'TESTJIRA'
        //         },
        //         summary: 'HELLO NODE TICKET 2',
        //         description: 'I am Abhiram Testing JIRA API FROM NODE PLS IGNORE',
        //         issuetype: {
        //             "name":'Story'
        //         },
        //         assignee: {
        //             accountId: givenUser.accountId
        //         }
        //     }
        // };

        // const createdIssue = await jira.addNewIssue(issue);
        // console.log(`Issue created successfully: ${createdIssue.key}`);
        // return createdIssue;

        const bodyData = `{
            "fields": {
                "project": {
                    "id": "10010"
                },
                "summary": "BASIC AXIOS TYPE 222",
                "description": {
                    "content": [
                        {
                            "content": [
                                {
                                "text": "HELLO THIS IS TICKET DESCRIPTION.",
                                "type": "text"
                                }
                            ],
                            "type": "paragraph"
                        }
                    ],
                    "type": "doc",
                    "version": 1
                },
                "issuetype": {
                    "name": "Story"
                },
                "assignee": {
                    "id": "${givenUser.accountId}"
                }
            }
        }`;

        //node issue type should create manually in project

        const email = process.env.JIRA_USERNAME;
        const apiToken = process.env.JIRA_API_TOKEN;

        //create ticket in project using body data
        // fetch('https://mannelabs.atlassian.net/rest/api/3/issue', {
        //     method: 'POST',
        //     headers: {
        //       'Authorization':`Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        //       'Accept': 'application/json',
        //       'Content-Type': 'application/json'
        //     },
        //     body: bodyData
        //   })
        //     .then(response => {
        //       console.log(
        //         `Response: ${response.status} ${response.statusText}`
        //       );
        //       return response.text();
        //     })
        //     .then(text => console.log(text))
        //     .catch(err => console.error(err));
        try {
            const response = await axios.post('https://mannelabs.atlassian.net/rest/api/3/issue', bodyData, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Response: ${response.status} ${response.statusText}`);
            console.log(response.data);
        } catch (error:any) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }

        
    } catch (error) {
        console.error('Error creating issue:', error);
    }
};

//get issuetypes for project
const getIssueTypesForProject = async ()=>{

    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;

    fetch(`https://mannelabs.atlassian.net/rest/api/3/issuetype/project?projectId=${10001}`, {
        method: 'GET',
        headers: {
          'Authorization':`Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
        .then(response => {
          console.log(
            `Response: ${response.status} ${response.statusText}`
          );
          return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
}

//geting issue form project
const getIssue = async (issueIdOrKey:any, fields = '*all', expand = '') => {
    try {
        const issue = await jira.findIssue(issueIdOrKey,  fields, expand );
        
        // const issue = await jira.getIssue(issueIdOrKey ); // can use both
        console.log('Issue details:', issue);
        return issue;
    } catch (error) {
        console.error('Error getting issue:', error);
    }
};

//deleteIssue
const deleteIssue = async (issueId: string) => {
    try {
        const response = await jira.deleteIssue(issueId);
        console.log(`Issue ${issueId} deleted successfully.`);
        console.log('Response from Jira:', response);
    } catch (error) {
        console.error(`Error deleting issue ${issueId}:`, error);
    }
};

//update issue in jira
const updateIssueTicket = async (issueId:any) => {
    try {
        const givenUser = await getUserInformation('bgajjela@crystallinesoft.com');
        console.log('givenUser',givenUser)

        const issueUpdate = {
            fields: {
                summary: 'Updated Issue Summary from NODE API',
                description: 'Updated Issue Description',
                issuetype: {
                    name: 'Story'  //Bug,Story,Task
                },
                assignee: {
                    id: givenUser.accountId  // Replace with the actual account ID of the user
                }
            }
        };

        // Optional query parameters, if needed
        const query = {};

        const updatedIssue = await jira.updateIssue(issueId, issueUpdate, query);
        console.log(`Issue ${issueId} updated successfully:`, updatedIssue);
    } catch (error) {
        console.error(`Error updating issue ${issueId}:`, error);
    }
};

//addcommntin jira'
const addCommentToIssue = async (issueId:any, comment:any) => {
    try {
        const response = await jira.addComment(issueId, comment);
        console.log(`Comment added to issue ${issueId}:`, response);
    } catch (error) {
        console.error(`Error adding comment to issue ${issueId}:`, error);
    }
};

//get comments of ticket
const getCommentsofTicket = async (issueId:any) => {
    try {
        const response = await jira.getComments(issueId);
        console.log(`Comments of the  ${issueId}:`, response);
    } catch (error) {
        console.error(`Error adding comment to issue ${issueId}:`, error);
    }
};

//move tickets to backloig
const moveIssuesToBacklog = async (issueKeys:any[]) => {
    try {

        // issueKeys.map(async (id:any)=>{
        //     const getTicket = await getIssue(id)
        //     // console.log('HI TICKET',getTicket)
        // })
        const response = await jira.moveToBacklog(issueKeys);
        console.log(`Issues moved to backlog:`, response);
    } catch (error) {
        console.error(`Error moving issues to backlog:`, error);
    }
};

const searchJiraTotal = async ()=> {

    const jqlQuery = 'project = "DMA" AND assignee = "Bhavani Gajjela"';
    // const jqlQuery = 'project = "DMA" AND assignee IS NOT EMPTY';
    // const jqlQuery = 'project = "DMA" AND assignee IS EMPTY';
    // const jqlQuery = 'project = "DMA" AND assignee IN (user1, user2)';
    const options = {
        fields: ['summary', 'status', 'assignee'],  // Fields to retrieve
        maxResults: 50,                             // Limit the number of results
    };
    
    try {
        const results = await jira.searchJira(jqlQuery, options);
        return results;
    } catch (error) {
        console.error('Error performing Jira search:', error);
        throw error;
    }
}


//change ticket transitions
export const changeIssueTransition = async (issueNumber:any, transitionId:any, transitionData = {}) => {
    try {
        await jira.transitionIssue(issueNumber, {
            transition: {
                id: transitionId
            },
            ...transitionData
        });
        console.log(`Issue ${issueNumber} transitioned successfully.`);
    } catch (error) {
        console.error('Error transitioning issue:', error);
        throw error;
    }
};


export const getFieldOptionFukl = async (fieldKey:any, optionId:any) => {
    try {
        const fieldId:any = await jira.getFieldOption(fieldKey,optionId);
        return fieldId
    } catch (error) {
        console.error('Error fetching field option:', error);
        throw error;
    }
};

//get backlog issues in baord
const fetchBacklogIssues = async (boardId:any) => {
    const startAt = 0;
    const maxResults = 50;
    const jql = ''; // Leave empty if no specific JQL filter is needed
    const validateQuery = true;
    const fields = 'summary,status,assignee'; // Specify the fields you need


    // const startAt = 0;
    // const maxResults = 50;
    const type = ''; // Leave empty to get all types
    const name = ''; // Leave empty to get all boards regardless of name
    const projectKeyOrId = ''; // Leave empty to get all boards regardless of project

    const boards = await jira.getAllBoards(startAt, maxResults, type, name, projectKeyOrId);
    console.log('ABHIRAM', boards);
    //for getting all boards


    //for getting issues of backlog in board
    // try {
    //     const issues = await jira.getIssuesForBacklog(boardId, startAt, maxResults, jql, validateQuery, fields);
    //     console.log('Backlog issues:', issues);
    // } catch (error) {
    //     console.error('Error fetching backlog issues:', error);
    // }
}

const createNewIssueTypeInJira = async ()=>{
    const bodyData = JSON.stringify({
        description: "Description of the new issue type",
        name: "NODEISSUETYPE2",
        type: "standard",
        hierarchyLevel:0
      });

    
    const apiUrl = 'https://mannelabs.atlassian.net/rest/api/3/issuetype';
    // const apiUrl = `https://mannelabs.atlassian.net/rest/api/3/issuetype/project?projectId={10025}`

    
    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: bodyData
      })
      .then((response:any) => {
        console.log(
          `Response: ${response.status} ${response.statusText}`
        );
        return response.text();
      })
      .then(text => console.log(text))
      .catch(err => console.error(err));
}

export const assignIssueTypeSchemeToProject = async ()=>{

    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;

    let myIssueTypeIds:any = []

    let apiUrl1 = `https://mannelabs.atlassian.net/rest/api/3/issuetype/project?projectId=${10010}`  //get all issue types project

    let apiUrl2 = 'https://mannelabs.atlassian.net/rest/api/3/issuetype'    //get all issuetypes global

    let apiUrl3 = 'https://mannelabs.atlassian.net/rest/api/3/issuetypescheme' //get issue type schemes

    let apiUrl4 = `https://mannelabs.atlassian.net/rest/api/3/issuetypescheme/project?projectId=${10011}` //get issue type schemes for project

    // let myResponse = fetch(apiUrl4, {
    // method: 'GET',
    // headers: {
    //     'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //     'Accept': 'application/json'
    // }
    // })
    // .then(response => {
    //     return response.json();
    // })
    // .catch(err => console.error(err));

    // myResponse.then((data) => {
    //     console.log('ABHIRAM',data)
    //     console.log('ABHIRAM2',data.values)
    //     // data.map((obj:any)=>{myIssueTypeIds.push(obj.id)})
    //     // console.log('ABHIRAM22222',[...myIssueTypeIds,10014])
    // });


    //for getting all listIssuetypes
    // try {
    //     const issue = await  jira.listIssueTypes();
    //     console.log('Issue Types:', issue);
    //     return issue;
    // } catch (error) {
    //     console.error('Error getting issue:', error);
    // }


    // for adding issuetypes to the issuetype scheme
    // const bodyData = `{
    //     "issueTypeIds": [
    //       "10019"
    //     ]
    //   }`;

    //10156 is issuetypescheme id that  already exist for the project
      
    //   fetch(`https://mannelabs.atlassian.net/rest/api/3/issuetypescheme/${10156}/issuetype`, {
    //     method: 'PUT',
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: bodyData
    //   })
    //     .then(response => {
    //       console.log(
    //         `Response: ${response.status} ${response.statusText}`
    //       );
    //       return response.text();
    //     })
    //     .then(text => console.log(text))
    //     .catch(err => console.error(err))






    const bodyDataForAssigningScheme = `{
        "issueTypeSchemeId": "10000",
        "projectId": "10001"
      }`;
      
    //   fetch('https://mannelabs.atlassian.net/rest/api/3/issuetypescheme/project', {
    //     method: 'PUT',
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: bodyDataForAssigningScheme
    //   })
    //     .then(response => {
    //       console.log(
    //         `Response: ${response.status} ${response.statusText}`
    //       );
    //       return response.text();
    //     })
    //     .then(text => console.log(text))
    //     .catch(err => console.error(err));



    





    //down code for creating issur type scheme

    // const bodyData = `{
    //  "defaultIssueTypeId": "10002",
    //     "description": "A collection of issue types suited to use in a kanban style project.",
    //      "issueTypeIds": ${[...myIssueTypeIds,"10014"]},
    //     "name": "Kanban Issue Type Scheme"
    // }`;

    // console.log('BIDY',bodyData)
       

    //   fetch('https://mannelabs.atlassian.net/rest/api/3/issuetypescheme', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: bodyData
    //   })
    //     .then(response => {
    //       console.log(
    //         `Response: ${response.status} ${response.statusText}`
    //       );
    //       return response.text();
    //     })
    //     .then(text => console.log(text))
    //     .catch(err => console.error(err));
}

const getAllWorkflows = async ()=>{
    
    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;

    const apiUrl = 'https://mannelabs.atlassian.net/rest/api/3/workflow';

    fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
        .then(response => {
          console.log(
            `Response existing workflows: ${response.status} ${response.statusText}`
          );
          return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
}

const createNewWorkflow = async ()=>{
    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;

    const apiUrl = 'https://mannelabs.atlassian.net/rest/api/3/workflow';


    //for getting all existing statuses with jira client
    // try {
    //     const issue = await  jira.listStatus();
    //     console.log('Issue details:', issue);
    //     return issue;
    // } catch (error) {
    //     console.error('Error getting issue:', error);
    // }

    

    //payload correct for creating a normal workflow
    const bodyData = `{
    "description": "This is a workflow created while creating new statuses",
    "name": "TESTING TRANISTIONs",
    "statuses": [
        {
            "id": "1"
        },
        {
            "id": "10026"
        },
        {
            "id": "10027"
        },
        {
            "id": "10028"
        }
    ],
    "transitions": [
    {
        "from": [],
        "name": "OpenDESC",
        "to": "1",
        "type": "initial"
    },
    {
        "from": ["1"],
        "name": "STATUS1111",
        "to": "10026",
        "type": "directed"
    },
    {
        "from": ["1"],
        "name": "STATUS222",
        "to": "10027",
        "type": "directed"
    },
    {
        "from": ["1"],
        "name": "STATUS333",
        "to": "10028",
        "type": "directed"
    },
    {
        "from": ["10026"],
        "name": "STATUS222",
        "to": "10027",
        "type": "directed"
    },
    {
        "from": ["10026"],
        "name": "OpenDESC",
        "to": "1",
        "type": "directed"
    },
    {
        "from": ["10026"],
        "name": "STATUS333",
        "to": "10028",
        "type": "directed"
    },
    {
        "from": ["10027"],
        "name": "STATUS1111",
        "to": "10026",
        "type": "directed"
    },
    {
        "from": ["10027"],
        "name": "OpenDESC",
        "to": "1",
        "type": "directed"
    },
    {
        "from": ["10027"],
        "name": "STATUS333",
        "to": "10028",
        "type": "directed"
    },
    {
        "from": ["10028"],
        "name": "STATUS1111",
        "to": "10026",
        "type": "directed"
    },
    {
        "from": ["10028"],
        "name": "STATUS222",
        "to": "10027",
        "type": "directed"
    },
    {
        "from": ["10028"],
        "name": "OpenDESC",
        "to": "1",
        "type": "directed"
    }
]

    }`;
      
    //for creating new worklow
    fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: bodyData
      })
    .then(response => {
        console.log(
        `Response: ${response.status} ${response.statusText}`
        );
        return response.text();
    })
    .then(text => console.log(text))
    .catch(err => console.error(err));
}


const getWorkflowSchemesAndPerform = async ()=>{
    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;

    //for deleting a worrkflow scheme
    // let apiUrl2 = `https://mannelabs.atlassian.net/rest/api/3/workflowscheme/${10009}`

    // let b = fetch(apiUrl2, {
    //     method: 'DELETE',
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //       'Accept': 'application/json'
    //     }
    //   })
    //     .then(response => {
    //       console.log(
    //         `Response: ${response.status} ${response.statusText}`
    //       );
    //       return response.text();
    //     })
    //     .then(text => console.log(text))
    //     .catch(err => console.error(err));




    const apiUrl1 = 'https://mannelabs.atlassian.net/rest/api/3/workflowscheme'; //get all workflow schemes

    let a = fetch(apiUrl1, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
        .then(response => {
          console.log(
            `Response: ${response.status} ${response.statusText}`
          );
          return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err))
}

const createWorkflowScheme = async ()=>{

    //for getting all issue types
    try {
        const issue = await  jira.listIssueTypes();
        console.log('Issue Types:', issue);
        return issue;
    } catch (error) {
        console.error('Error getting issue:', error);
    }


    // payload is correct for creating workflwo scheme and below ids are issuetypeids
    //define workflow by name
    const bodyData = `{
        "defaultWorkflow": "jira",
        "description": "The description of the example NODE SAMPLE WORKFLOW scheme.",
        "issueTypeMappings": {
          "10004": "NODE SAMPLE WORKFLOW",
          "10018": "NODE SAMPLE WORKFLOW",
          "10001":"NODE SAMPLE WORKFLOW",
          "10014":"NODE SAMPLE WORKFLOW"
        },
        "name": "NODE SAMPLE WORKFLOW SCHEME"
      }`;

    // const email = process.env.JIRA_USERNAME;
    // const apiToken = process.env.JIRA_API_TOKEN;

      // let a = fetch('https://mannelabs.atlassian.net/rest/api/3/workflowscheme', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json'
      //   },
      //   body: bodyData
      // })
      //   .then(response => {
      //     console.log(
      //       `Response: ${response.status} ${response.statusText}`
      //     );
      //     return response.text();
      //   })
      //   .then(text => console.log(text))
      //   .catch(err => console.error(err));
}

const associateWorlflowSchemeForProject = async ()=>{
    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;

    // get all workflow schemes associated with porject
    let a = fetch(`https://mannelabs.atlassian.net/rest/api/3/workflowscheme/project?projectId=${10010}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
        .then(response => {
          console.log(
            `Response: ${response.status} ${response.statusText}`
          );
          return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));



    //for associating a workflow scheme with project 
    //we can assign a new workflow for only a newly created project
    // const bodyData = `{
    //     "projectId": "10010",
    //     "workflowSchemeId": "10014"
    //   }`;
      
    //   let b = fetch('https://mannelabs.atlassian.net/rest/api/3/workflowscheme/project', {
    //     method: 'PUT',
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: bodyData
    //   })
    //     .then(response => {
    //       console.log(
    //         `Response: ${response.status} ${response.statusText}`
    //       );
    //       return response.text();
    //     })
    //     .then(text => console.log(text))
    //     .catch(err => console.error(err));

}

const setIssueTypeForworkflowscheme = async()=>{

    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;

    // try {
    //     const issue = await  jira.listIssueTypes();
    //     console.log('Issue Types:', issue);
    // } catch (error) {
    //     console.error('Error getting issue:', error);
    // }


    // let a = fetch(`https://mannelabs.atlassian.net/rest/api/3/workflowscheme/project?projectId=${10010}`, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //       'Accept': 'application/json'
    //     }
    //   })
    //     .then(response => {
    //       console.log(
    //         `Response: ${response.status} ${response.statusText}`
    //       );
    //       return response.text();
    //     })
    //     .then(text => console.log(text))
    //     .catch(err => console.error(err));


    const bodyData = `{
        "issueTypes": [
          "10019",
          "10001","10014","10004","10018"
        ],
        "updateDraftIfNeeded": true,
        "workflow": "jira"
      }`;
      
      fetch(`https://mannelabs.atlassian.net/rest/api/3/workflowscheme/${10014}/workflow?workflowName=${'NODE SAMPLE WORKFLOW'}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: bodyData
    })
      .then(response => {
        console.log(
          `Response: ${response.status} ${response.statusText}`
        );
        return response.text();
      })
      .then(text => console.log(text))
      .catch(err => console.error(err));
}

const getAllStatusInJira = async ()=>{
    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;



   //for getting all the statuses in the jiraaa
   let a = await fetch(`https://mannelabs.atlassian.net/rest/api/3/statuses/search`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
      'Accept': 'application/json',
    }
  })
    .then(response => {
      console.log(`Response STATUSES: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

const createBulkStatuses = async ()=>{
    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;
    // try {
    //     let a = await jira.listProjects();
    //     console.log('óiudhgh',a)
    //     return a
    // } catch (error) {
    //     console.error('Error fetching projects:', error);
    // }


    //for creating statuses in bulk

    const bodyData = `{
        "scope": {
            "type": "GLOBAL"
        },
        "statuses": [
            {
            "description": "Status 6 description",
            "name": "STATUS6",
            "statusCategory": "TODO"
          },
        
          {
            "description": "Status 7 description",
            "name": "STATUS7",
            "statusCategory": "TODO"
          },
          {
            "description": "Status 8 description",
            "name": "STATUS8",
            "statusCategory": "DONE"
          }
        ]
      }`;
      
    //  let b = await fetch('https://mannelabs.atlassian.net/rest/api/3/statuses', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: bodyData
    //   })
    //     .then(response => {
    //       console.log(
    //         `Response: ${response.status} ${response.statusText}`
    //       );
    //       return response.text();
    //     })
    //     .then(text => console.log(text))
    //     .catch(err => console.error(err));
          
      
}

const createIssueWithAPi = async ()=>{
    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;

    const givenUser = await getUserInformation('akadari@mannelabs.com');

    const bodyData = `{
        "fields": {
          "assignee": {
            "id": "712020:b935c98a-ceae-43ba-8aae-2f2620d71a19"
          },
          "description": {
            "content": [
              {
                "content": [
                  {
                    "text": "Hello Testing",
                    "type": "text"
                  }
                ],
                "type": "paragraph"
              }
            ],
            "type": "doc",
            "version": 1
          },
          "priority": {
                "id": "1"
            },
          "issuetype": {
            "name": "Task"
          },
         
          "project": {
            "id": "10012"
          },
          "duedate": "2024-08-23",
          "timetracking": {
            "originalEstimate": "10"
          },
          "summary": "VERY NEW ISSUE time"
         
        },
        "update": {}
    }`;

    fetch('https://mannelabs.atlassian.net/rest/api/3/issue', {
    method: 'POST',
    headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: bodyData
    })
    .then(response => {
        console.log(
        `Response: ${response.status} ${response.statusText}`
        );
        return response.text();
    })
    .then(text => console.log(text))
    .catch(err => console.error(err));
}

const getScreens = async ()=>{
    const email = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;


    //for getting all screens in jira
    // fetch('https://mannelabs.atlassian.net/rest/api/3/screens', {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //       'Accept': 'application/json'
    //     }
    //   })
    //     .then(response => {
    //       console.log(
    //         `Response: ${response.status} ${response.statusText}`
    //       );
    //       return response.text();
    //     })
    //     .then(text => console.log(text))
    //     .catch(err => console.error(err));

    // filter the screens values with the required project key in starting



    // get all pending fields that can be assigned for a screen
    // fetch(`https://mannelabs.atlassian.net/rest/api/3/screens/${10038}/availableFields`, {
    // method: 'GET',
    // headers: {
    //     'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //     'Accept': 'application/json'
    // }
    // })
    // .then(response => {
    //     console.log(
    //     `Response: ${response.status} ${response.statusText}`
    //     );
    //     return response.text();
    // })
    // .then(text => console.log(text))
    // .catch(err => console.error(err));


    //get all screen tabs
    //  fetch(`https://mannelabs.atlassian.net/rest/api/3/screens/tabs`, {
    // method: 'GET',
    // headers: {
    //     'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //     'Accept': 'application/json'
    // }
    // })
    // .then(response => {
    //     console.log(
    //     `Response: ${response.status} ${response.statusText}`
    //     );
    //     return response.text();
    // })
    // .then(text => console.log(text))
    // .catch(err => console.error(err));


    //add field to screen using that particular tabId
    // const bodyData = `{
    //     "fieldId": "versions"
    //   }`;
      
    //   fetch(`https://mannelabs.atlassian.net/rest/api/3/screens/${10038}/tabs/${10041}/fields`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: bodyData
    //   })
    //     .then(response => {
    //       console.log(
    //         `Response: ${response.status} ${response.statusText}`
    //       );
    //       return response.text();
    //     })
    //     .then(text => console.log(text))
    //     .catch(err => console.error(err));



}
 