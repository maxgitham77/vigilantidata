import {AppContext, IActiveProject, IAuth, IDataSource, TokenPayload} from "@/interfaces/auth.interface";
import {AppDataSource} from "@/database/config";
import {User} from "@/entities/user.entity";
import {ValidatorService} from "@/services/auth/ValidatorService";
import {hashPassword, verifyPassword} from "@/utils/utils";
import {generateAccessToken} from "@/utils/token.util";
import {GraphQLError} from "graphql/error";
import {IAuthPayload, IDataSourceProjectID} from "@/interfaces/datasource.interface";
import {DatasourceService} from "@/services/DatasourceService";
import {getPostgresSQLCollections} from "@/services/PGConnection";

export class AuthService {
  static async register(input: IAuth, context: AppContext): Promise<IAuthPayload> {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = input;
    const { req } = context;

    await ValidatorService.validateUser(input, userRepository, 'register');

    const hashedPassword: string = await hashPassword(password);
    const user = userRepository.create({
      email,
      password: hashedPassword,
    });
    const userData = await userRepository.save(user);
    const payload: TokenPayload = {
      userId: userData?.id,
      email: userData?.email,
      activeProject: {} as IActiveProject,
    };
    const accessToken: string = generateAccessToken(payload);
    req.session = {
      access: accessToken
    }

    return {
      projectIds: [],
      collections: [],
      user: {
        id: user.id,
        email: user.email,
      }
    }

  }

  static async login(input: IAuth, context: AppContext): Promise<IAuthPayload> {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = input;
    const { req } = context;
    await ValidatorService.validateUser(input, userRepository, 'login');

    const user: User | null = await userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new GraphQLError("User does not exist");
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new GraphQLError("Invalid credentials");
    }

    const result: IDataSource[] = await DatasourceService.getDataSources(`${user.id}`);
    let activeProject: IActiveProject = {} as IActiveProject;
    let collections: string[] = [];
    if (result.length > 0) {
      activeProject = {
        projectId: result[0].projectId,
        type: result[0].type
      }
      if (activeProject.type === "postgresql") {
        collections = await getPostgresSQLCollections(result[0].projectId);
      }
    }

    const payload: TokenPayload = {
      userId: user?.id,
      email: user?.email,
      activeProject,
    };
    const accessToken: string = generateAccessToken(payload);
    req.session = {
      access: accessToken
    }
    return {
      projectIds: result,
      collections,
      user: {
        id: user.id,
        email: user.email,
      }
    }
  }

  static logout(context: AppContext): string {
    const { req } = context;
    req.session = null;
    req.currentUser = undefined;
    return "Logout successfully";
  }

}
