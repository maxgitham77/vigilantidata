import {IDataSourceDocument, IQueryProp} from "@/interfaces/datasource.interface";
import {Pool, PoolClient} from "pg";
import {GraphQLError} from "graphql/error";
import {DatasourceService} from "@/services/DatasourceService";
import {decodeBase64} from "@/utils/utils";

export async function testPostgresSQLConnection(data: IDataSourceDocument): Promise<string> {
  let client: PoolClient | null = null;
  const { databaseName, databaseUrl, username, password, port } = data;
  const pool: Pool = new Pool({
    host: databaseUrl,
    user: username,
    password,
    port: parseInt(`${port}`, 10) ?? 5432,
    database: databaseName,
    max: 20, // Maximal number of clients in pool
    idleTimeoutMillis: 30000, // close idle clients after 30 seconds
    connectionTimeoutMillis: 2000 ,// return an error after 2 seconds of connection could not be established
    maxUses: 7500 // number of times a connection can be used before being closed
  });

  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    return 'Successfully connected to PostgresAQL';
  } catch (error: any) {
    throw new GraphQLError("Failed to connect to PostgresAQL", error?.message);
  } finally {
    if (client) {
      client.release();
    }
  }

}

export async function getPostgresSQLCollections(projectId: string, schema: string = 'public'): Promise<string[]> {
  let client: PoolClient | null = null;
  try {
    const project = await DatasourceService.getDataSourceByProjectId(projectId);
    const { databaseName, databaseUrl, username, password, port } = project;
    const pool: Pool = new Pool({
      host: decodeBase64(databaseUrl!)!,
      user: decodeBase64(username!)!,
      password: decodeBase64(password!)!,
      port: parseInt(`${port}`, 10) ?? 5432,
      database: decodeBase64(databaseName!)!,
      max: 20, // Maximal number of clients in pool
      idleTimeoutMillis: 30000, // close idle clients after 30 seconds
      connectionTimeoutMillis: 2000 ,// return an error after 2 seconds of connection could not be established
      maxUses: 7500 // number of times a connection can be used before being closed
    });
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = $1
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    client = await pool.connect();
    const result = await client.query(query, [schema]);
    console.log(result);
    const tables = result.rows.map((row) => row.table_name)
      return tables;
  } catch (error: any) {
    throw new GraphQLError("Failed to connect to PostgresAQL", error?.message);
  } finally {
    if (client) {
      client.release();
    }
  }

}

export async function executePostgresSQLQuery(data: IQueryProp): Promise<Record<string, unknown>[]> {
  let client: PoolClient | null = null;
  try {
    const { projectId, sqlQuery } = data;
    const project = await DatasourceService.getDataSourceByProjectId(projectId);
    const { databaseName, databaseUrl, username, password, port } = project;
    const pool: Pool = new Pool({
      host: decodeBase64(databaseUrl!)!,
      user: decodeBase64(username!)!,
      password: decodeBase64(password!)!,
      port: parseInt(`${port}`, 10) ?? 5432,
      database: decodeBase64(databaseName!)!,
      max: 20, // Maximal number of clients in pool
      idleTimeoutMillis: 30000, // close idle clients after 30 seconds
      connectionTimeoutMillis: 2000 ,// return an error after 2 seconds of connection could not be established
      maxUses: 7500 // number of times a connection can be used before being closed
    });
    client = await pool.connect();
    const result = await client.query(sqlQuery);
    return result.rows ?? [];
  } catch (error: any) {
    throw new GraphQLError("Failed to connect to PostgresAQL", error?.message);
  } finally {
    if (client) {
      client.release();
    }
  }

}
