import { mergeTypeDefs } from "@graphql-tools/merge";
import {authSchema} from "@/graphql/schemas/auth";
import {postgresqlCollectionSchema} from "@/graphql/schemas/pgCollection";
import {coreDataSourceSchema} from "@/graphql/schemas/datasource";
import {aiChartSchema} from "@/graphql/schemas/aiChart";
import {chartInfoSchema} from "@/graphql/schemas/chartInfo";

export const mergedGQLSchema = mergeTypeDefs([
  authSchema,
  postgresqlCollectionSchema,
  coreDataSourceSchema,
  aiChartSchema,
  chartInfoSchema
]);
