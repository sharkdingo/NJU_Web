import { Post, Provide, Inject } from '@midwayjs/core';
import { DataService } from './data.service';
import { IUserOptions } from '../interface';

@Provide()
export class UserService {
  @Inject()
  dataService: DataService;

  @Post('/login')
  async login(username: string, password: string) {
    const user = this.dataService.users.find(u => u.username === username);
    if (user) {
      if (user.password === password) {
        return { success: true, message: 'Login successful' };
      } else {
        return {
          success: false,
          message: 'Login failed for incorrect password',
        };
      }
    } else {
      return {
        success: false,
        isRegister: true, // 通知前端这是注册流程
        message: 'User not found. Please confirm your password to register.',
      };
    }
  }

  async register(username: string, password: string) {
    const users = this.dataService.loadUsers();
    const newUser: IUserOptions = {
      username: username,
      password: password,
      board: { name: 'Board', taskLists: [] }, // 初始化 projects 为空数组
      avatar: '',
    };
    users.push(newUser);
    await this.dataService.saveUsers(users);
    return {
      success: true,
      message: 'User added successfully',
    };
  }
}
