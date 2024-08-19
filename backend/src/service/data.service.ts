import { Provide } from '@midwayjs/decorator';
import { IUserOptions } from '../interface';
import * as fs from 'fs';
import * as path from 'path';

@Provide()
export class DataService {
  private usersFilePath = path.join(
    __dirname,
    process.env.NODE_ENV === 'production'
      ? '../data/user.json'
      : '../../src/data/user.json'
  );

  public users: IUserOptions[] = [];

  constructor() {
    this.loadUsers();
  }

  // 加载用户数据
  loadUsers(): IUserOptions[] {
    try {
      const data = fs.readFileSync(this.usersFilePath, 'utf-8');
      this.users = JSON.parse(data);
      return this.users;
    } catch (err) {
      console.error('无法读取用户数据:', err);
      return [];
    }
  }

  // 保存用户数据
  async saveUsers(users: IUserOptions[]) {
    try {
      console.log('正在保存用户数据到文件:', this.usersFilePath);
      console.log('保存的数据:', JSON.stringify(users, null, 2));
      fs.writeFileSync(this.usersFilePath, JSON.stringify(users, null, 2));
    } catch (err) {
      console.error('无法保存用户数据:', err);
    }
  }
}
