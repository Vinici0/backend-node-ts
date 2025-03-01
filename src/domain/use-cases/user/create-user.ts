import { bcryptAdapter } from "../../../config/bcrypt.adapter";
import { CreateUserDto } from "../../dtos";
import { UserEntity } from "../../entities/user.entity";
import { UserQueryRepository } from "../../repositories/user-query.repository";
import { UserRepository } from "../../repositories/user.repository";

export interface CreateUserUseCase {
  execute(dto: CreateUserDto): Promise<UserEntity>;
}

export class CreateUser implements CreateUserUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userQueryRepository.findByUsernameOrEmail(dto.username);
    if (user) {
      throw new Error("User already exists");
    }
    const hashedPassword = bcryptAdapter.hash(dto.password);
    const newDto = { ...dto, password: hashedPassword };
    const createdUser = await this.repository.create(newDto);
    return createdUser;
  }
}
