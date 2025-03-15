import {AppContext, IDataSource} from "@/interfaces/auth.interface";
import {authenticateGraphQLRoute} from "@/utils/token.util";
import {DatasourceService} from "@/services/DatasourceService";
import {executePostgresSQLQuery, getPostgresSQLCollections} from "@/services/PGConnection";
import {IQueryProp} from "@/interfaces/datasource.interface";

export const PostgreSQLCollectionResolver = {
  Query: {
    async getPostgreSQLCollections(_: undefined, args: {projectId: string}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { projectId } = args;
      const projectIds: IDataSource[] = await DatasourceService.getDataSources(`${req.currentUser?.userId}`);
      const collections: string[] = await getPostgresSQLCollections(projectId);
      return {
        projectIds,
        collections
      }
    },
    async getSinglePostgreSQLCollections(_: undefined, args: {projectId: string}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { projectId } = args;
      req.session = {
        ...req.session,
        activeProjectId: { projectId, type: 'postgresql' }
      }
      const collections: string[] = await getPostgresSQLCollections(projectId);
      return collections;
    },
    async executePostgreSQLQuery(_: undefined, args: {data: IQueryProp}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { data } = args;
      const documents: Record<string, unknown>[] = await executePostgresSQLQuery(data);
      console.log(documents);
      return {
        documents: JSON.stringify(documents),
      };
    },
  }
}
