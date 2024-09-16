import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    it('should call UserService with CreateUserDto and return user and token', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      const result = {
        user: {
          id: 1,
          email: createUserDto.email,
          password: createUserDto.password,
          categories: [], // Добавляем поле categories
          transactions: [], // Добавляем поле transactions
          createdAt: new Date(), // Добавляем createdAt
          updatedAt: new Date(), // Добавляем updatedAt
        },
        token: 'test-token',
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(result);

      const response = await userController.createUser(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(response).toEqual(result);
    });
  });
});
