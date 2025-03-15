import {AppContext, IDataSource} from "@/interfaces/auth.interface";
import {authenticateGraphQLRoute} from "@/utils/token.util";
import {DatasourceService} from "@/services/DatasourceService";
import {IDataSourceDocument} from "@/interfaces/datasource.interface";
import {testPostgresSQLConnection} from "@/services/PGConnection";

export const CoreDataSourceResolver = {
  Query: {
    async getDataSources(_: undefined, __: undefined, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const result: IDataSource[] = await DatasourceService.getDataSources(`${req.currentUser?.userId}`);
      return {
        dataSource: result,
      }
    },
    async getDataSourceByProjectId(_: undefined, args: {projectId: string}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { projectId } = args;
      const result: IDataSourceDocument = await DatasourceService.getDataSourceByProjectId(projectId);
      return result;
    }
  },
  Mutation: {
    async checkPostgresqlConnection(_: undefined, args: {datasource: IDataSourceDocument}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { datasource } = args;
      const result: string = await testPostgresSQLConnection(datasource);
      return {
        message: result
      };
    },
    async createPostgresqlDataSource(_: undefined, args: {source: IDataSourceDocument}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { source } = args;
      await DatasourceService.createNewDataSource({
        ...source,
        userId: `${req.currentUser?.userId}`,
        type: "postgresql",
      });
      req.session = {
        ...req.session,
        activeProject: { projectId:source.projectId, type: "postgresql" }
      };
      const dataSource = await DatasourceService.getDataSources(`${req.currentUser?.userId}`);
      return { dataSource: dataSource };
    },
    async editDataSource(_: undefined, args: {source: IDataSourceDocument}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { source } = args;
      const result = await DatasourceService.editDataSource(source);
      return {
        dataSource: result
      };
    },
    async deleteDatasource(_: undefined, args: {datasourceId: string}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { datasourceId } = args;
      const result = await DatasourceService.deleteDatasource(datasourceId);
      return {
        id: datasourceId
      };
    },
  },
  SingleDataSource: {
    createdAt: (datasource: IDataSourceDocument) => JSON.stringify(datasource.createdAt),
  }
};
