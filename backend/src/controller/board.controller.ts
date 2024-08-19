import {
  Body,
  Controller,
  Del,
  Fields,
  File,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { DataService } from '../service/data.service';
import { BoardService } from '../service/board.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('/board')
export class BoardController {
  @Inject()
  dataService: DataService;

  @Inject()
  ctx: Context;

  @Inject()
  boardService: BoardService;

  @Get('/:username')
  async getBoard(@Param('username') username: string) {
    try {
      const board = await this.boardService.getBoardInfo(username);
      if (board) {
        return { success: true, board: board };
      } else {
        console.error('getBoard not found');
        return { success: false, message: 'Failed to get board.', board: null };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to get board.', board: null };
    }
  }

  @Put('/:username/boardName')
  async updateBoardName(
    @Param('username') username: string,
    @Body() body: { boardName: string }
  ) {
    console.log(body);
    const result = await this.boardService.updateBoardName(
      username,
      body.boardName
    );
    if (result) {
      return {
        success: true,
        message: 'BoardName updated successfully',
        name: body.boardName,
      };
    } else {
      return { success: false, message: 'Failed to update boardName.' };
    }
  }

  @Post('/:username/board')
  async addTaskList(
    @Param('username') username: string,
    @Body() body: { taskListName: string }
  ) {
    const result = await this.boardService.addTaskList(
      username,
      body.taskListName
    );
    if (result) {
      return { success: true, message: 'TaskList added successfully' };
    } else {
      return { success: false, message: 'Failed to add taskList.' };
    }
  }

  @Put('/:username/board/taskLists')
  async updateTaskListName(
    @Param('username') username: string,
    @Body() body: { taskListId: number; taskListName: string }
  ) {
    const result = await this.boardService.updateTaskListName(
      username,
      body.taskListName,
      body.taskListId
    );
    if (result) {
      return { success: true, message: 'TaskListName updated successfully' };
    } else {
      return { success: false, message: 'Failed to update taskListName.' };
    }
  }

  @Del('/:username/board/taskLists/deleteTaskList')
  async deleteTaskList(
    @Param('username') username: string,
    @Body() body: { taskListId: number }
  ) {
    return await this.boardService.deleteTaskList(username, body.taskListId);
  }

  @Post('/:username/board/taskLists/tasks/addTask')
  async addTask(
    @Param('username') username: string,
    @Body() body: { taskListId: number; taskName: string }
  ) {
    const result = await this.boardService.addTask(
      username,
      body.taskListId,
      body.taskName
    );
    if (result) {
      return { success: true, message: 'Task added successfully' };
    } else {
      return { success: false, message: 'Failed to add task.' };
    }
  }

  @Put('/:username/board/taskLists/tasks/updateTask')
  async updateTask(
    @Param('username') username: string,
    @Body() body: { taskListId: number; taskId: number; taskName: string }
  ) {
    const result = await this.boardService.updateTask(
      username,
      body.taskListId,
      body.taskId,
      body.taskName
    );
    if (result.success) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  }

  @Del('/:username/board/taskLists/tasks/deleteTask')
  async deleteTask(
    @Param('username') username: string,
    @Body() body: { taskListId: number; taskId: number }
  ) {
    return await this.boardService.deleteTask(
      username,
      body.taskListId,
      body.taskId
    );
  }

  @Put('/:username/board/taskLists/tasks/comments/updateComments')
  async updateComments(
    @Param('username') username: string,
    @Body()
    body: {
      taskListId: number;
      taskId: number;
      comments: { id: string; text: string }[] | null;
    }
  ) {
    return await this.boardService.updateComments(
      username,
      body.taskListId,
      body.taskId,
      body.comments
    );
  }

  @Post('/:username/board/taskLists/tasks/attachments')
  async addAttachment(
    @Param('username') username: string,
    @Fields()
    fields: {
      taskListId: string;
      taskId: string;
      originalName: string;
      filename: string;
    },
    @File() file: any
  ) {
    const { taskListId, taskId, originalName, filename } = fields;
    console.log('Received file:', file);
    if (!file) {
      console.error('No files uploaded');
      return { success: false, message: 'No files uploaded' };
    }
    const uploadDir = path.join(
      __dirname,
      '../public/uploads',
      username,
      'taskList' + taskListId,
      'task' + taskId
    );
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    console.log(filePath);
    try {
      fs.copyFileSync(file.data, filePath);
      await this.boardService.addAttachment(
        username,
        Number(taskListId),
        Number(taskId),
        {
          originalName: originalName,
          filename: filename,
          url: `/uploads/${username}/taskList${taskListId}/task${taskId}/${filename}`,
        }
      );
      return {
        success: true,
        message: 'Attachment added successfully',
        data: file.data,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('/:username/board/taskLists/tasks/attachments')
  async downloadAttachment(
    @Param('username') username: string,
    @Query()
    query: {
      taskListId: number;
      taskId: number;
      filename: string;
      originalName: string;
    }
  ) {
    const filePath = path.join(
      __dirname,
      '../public/uploads',
      username,
      'taskList' + query.taskListId,
      'task' + query.taskId,
      query.filename
    );
    if (fs.existsSync(filePath)) {
      console.log(`Downloading file from: ${filePath}`);
      const encodedFilename = encodeURIComponent(query.originalName);
      this.ctx.set(
        'Content-Disposition',
        `attachment; filename=${encodedFilename}`
      );
      this.ctx.type = 'application/octet-stream'; // 设置响应类型
      this.ctx.body = fs.createReadStream(filePath); // 以流的方式返回文件内容
    } else {
      console.error(`File failed to found: ${filePath}`);
      return {
        success: false,
        message: 'failed to download attachment',
      };
    }
  }

  @Del('/:username/board/taskLists/tasks/attachments')
  async deleteAttachment(
    @Param('username') username: string,
    @Body()
    body: {
      taskListId: number;
      taskId: number;
      filename: string;
    }
  ) {
    const filePath = path.join(
      __dirname,
      '../public/uploads',
      username,
      'taskList' + body.taskListId,
      'task' + body.taskId,
      body.filename
    );
    if (fs.existsSync(filePath)) {
      console.log(`delete file from ${filePath}`);
      try {
        fs.unlinkSync(filePath);
        await this.boardService.deleteAttachment(
          username,
          body.taskListId,
          body.taskId,
          body.filename
        );
        console.log('File deleted successfully');
      } catch (err) {
        console.error(`Failed to delete file: ${err}`);
      }
    }
  }

  @Post('/:username/avatar')
  async updateAvatar(@Param('username') username: string, @File() file: any) {
    if (!file) {
      console.error('No files uploaded');
      return { success: false, message: 'No files uploaded' };
    }
    const uploadDir = path.join(__dirname, '../public/avatars', username);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    else {
      const files = fs.readdirSync(uploadDir);
      files.forEach(file => {
        const filePath = path.join(uploadDir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) fs.unlinkSync(filePath);
      });
    }
    const filePath = path.join(
      uploadDir,
      'avatar' + path.extname(file.filename)
    );
    console.log(filePath);
    try {
      fs.copyFileSync(file.data, filePath);
      await this.boardService.updateAvatar(
        username,
        path.extname(file.filename)
      );
      return {
        success: true,
        message: 'Avatar updated successfully',
        data: file.data,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('/:username/avatar')
  async getAvatar(@Param('username') username: string) {
    try {
      const avatar = await this.boardService.getAvatarInfo(username);
      if (avatar) {
        return { success: true, avatar: avatar };
      } else {
        console.error('getAvatar not found');
        return {
          success: false,
          message: 'Failed to get avatar.',
          avatar: null,
        };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to get avatar.', avatar: null };
    }
  }
}
