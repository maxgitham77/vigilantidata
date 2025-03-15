import {AppContext, IDataSource} from "@/interfaces/auth.interface";
import {authenticateGraphQLRoute} from "@/utils/token.util";
import {IAiChartInfo, IAiSqlQuery} from "@/interfaces/datasource.interface";
import {generateChart, getSQLQueryData} from "@/services/AIChartService";

export const AiChartResolver = {
  Query: {
    async getSQLQueryData(_: undefined, args: { info: IAiSqlQuery }, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { info} = args;
      const result = await getSQLQueryData(info);
      console.log(result);
      return JSON.stringify(result);
    },
    async generateChart(_: undefined, args: { info: IAiChartInfo }, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { info} = args;
      const result = await generateChart(info);
      console.log(result);
      return JSON.stringify(result);
    },
  },
};
