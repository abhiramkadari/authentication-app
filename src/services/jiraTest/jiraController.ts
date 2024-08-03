import { connectionObj } from "../../config/dB";
import JiraClient from 'jira-client'


// Initialize
const jira = new JiraClient({
    protocol: 'https',                   // Use 'http' if not using SSL
    host: 'crystalline.atlassian.net',    // Replace with your Jira host
    username: process.env.JIRA_USERNAME,       // Your Jira email or username from .env
    password: process.env.JIRA_API_TOKEN, // API token for cloud or password for server
    apiVersion: '2',                        // Jira API version
    strictSSL: true                         // Set to false if your Jira server uses a self-signed SSL certificate
  });

export const testJira = async()=>{
    console.log('Hello')

    try {

        // 1.const currentUser = await getCurrentUser();
        // console.log('Successfully connected to Jira:', currentUser);


        // // 2.Fetch all projects
        // const projects = await getAllProjects();
        // console.log('All Projects:', projects);


        // 3.for creating project
        // createSimpleJiraProject('JIRA API TEST', 'TESTJIRA')
        //     .then(project => {
        //         console.log('Project created successfully:', project);
        //     })
        //     .catch(error => {
        //         console.error('Failed to create project:', error);
        //     });


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
        const b = await moveIssuesToBacklog(["DMA-54"])
        

      } catch (error) {
        console.error('Error connecting to Jira:', error);
      }

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
    //i dont have permsiion try with the mainlead id
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
            projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-agility-scrum'
        };

        const project = await jira.createProject(payload);

        console.log(`Project created: ${project.name} (${project.key})`);
        console.log('whole project object',project)
        // return project;
    } catch (error) {
        console.error('Error creating project:', error);
    }
};


//adding ticket into project
const addNewTicket = async () => {
    try {
        // const givenUser = await getUserInformation('bgajjela@crystallinesoft.com');
        // console.log('givenUser',givenUser)

        const issue = {
            fields: {
                project: {
                    key: 'DMA'
                },
                summary: 'I am BHAVANI Testing JIRA API FROM NODE API 2',
                description: 'I am Abhiram Testing JIRA API FROM NODE PLS IGNORE',
                issuetype: {
                    name: 'Task'  //Bug,Story,Task
                },
                // assignee: {
                //     accountId: givenUser.accountId
                // }
            }
        };

        const createdIssue = await jira.addNewIssue(issue);
        console.log(`Issue created successfully: ${createdIssue.key}`);
        return createdIssue;
    } catch (error) {
        console.error('Error creating issue:', error);
    }
};

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

