import {AppContext, IAuth, IDataSource} from "@/interfaces/auth.interface";
import {AuthService} from "@/services/auth/AuthService";
import {IAuthPayload} from "@/interfaces/datasource.interface";
import {authenticateGraphQLRoute} from "@/utils/token.util";
import {DatasourceService} from "@/services/DatasourceService";
import {getPostgresSQLCollections} from "@/services/PGConnection";

export const AuthResolver = {
  Query: {
    async checkCurrentUser(_: undefined, __: undefined, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      let collections: string[] = [];

      const result: IDataSource[] = await DatasourceService.getDataSources(`${req.currentUser?.userId}`);
      if (result.length > 0) {
        const activeProject = req.currentUser?.activeProject ? req.currentUser?.activeProject : result[0];
        if (activeProject.type === 'postgresql') {
          collections = await getPostgresSQLCollections(activeProject.projectId);
        }
      }

      return {
        user: {
          id: req.currentUser?.userId,
          email: req.currentUser?.email,
        },
        projectIds: result,
        collections
      }
    }
  },
  Mutation: {
    async loginUser(_: undefined, args: { email: string, password: string}, contextValue: AppContext) {
      const user: IAuth = { email: args.email, password: args.password };
      const result = await AuthService.login(user, contextValue);
      return result;
    },
    async registerUser(_: undefined, args: { user: IAuth }, contextValue: AppContext) {
      const result: IAuthPayload = await AuthService.register(args.user, contextValue);
      return result;
    },
    async logout(_: undefined, __: undefined, contextValue: AppContext) {
      const result: string = AuthService.logout(contextValue);
      return {
        message: result
      };
    }
  }
};
