import { Controller, Get, Post, Body, Inject } from '@midwayjs/core';
import { UserService } from '../service/user.service';

@Controller('/user')
export class HomeController {
  @Inject()
  userService: UserService;

  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return await this.userService.login(username, password);
  }

  @Post('/register')
  async register(@Body() body: { username: string; password: string }) {
    return await this.userService.register(body.username, body.password);
  }
}
