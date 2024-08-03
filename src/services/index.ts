import routes from './authRoutes';
import testRoutes from '../services/test/testRoutes';
import jiraRoutes from '../services/jiraTest/routes'

export default [...routes,...testRoutes,...jiraRoutes]