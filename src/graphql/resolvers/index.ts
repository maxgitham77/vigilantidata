import {AuthResolver} from "@/graphql/resolvers/auth";
import {CoreDataSourceResolver} from "@/graphql/resolvers/datasource";
import {PostgreSQLCollectionResolver} from "@/graphql/resolvers/PGCollection";
import {AiChartResolver} from "@/graphql/resolvers/aiChart";
import {ChartInfResolver} from "@/graphql/resolvers/chartInfo";

export const mergedGQLResolvers = [
  AuthResolver,
  CoreDataSourceResolver,
  PostgreSQLCollectionResolver,
  AiChartResolver,
  ChartInfResolver
];
