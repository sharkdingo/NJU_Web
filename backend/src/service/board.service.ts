import { Inject, Provide } from '@midwayjs/decorator';
import { Attachment, Board, Task, TaskList } from '../interface'; // 只导入必要的接口
import { DataService } from './data.service';

@Provide()
export class BoardService {
  @Inject()
  dataService: DataService;

  async getBoardInfo(username: string): Promise<Board | null> {
    const user = this.dataService.users.find(u => u.username === username);
    if (user) {
      return user.board;
    }
    return null;
  }

  async updateBoardName(username: string, boardName: string): Promise<boolean> {
    try {
      const users = this.dataService.users;
      const user = users.find(u => u.username === username);
      if (user && user.board.name) {
        user.board.name = boardName;
      }
      await this.dataService.saveUsers(users);
      console.log('update boardName', boardName);
      return true;
    } catch (error) {
      console.error('更新看板名称失败:', error.message);
      return false;
    }
  }

  async addTaskList(username: string, taskListName: string): Promise<boolean> {
    try {
      const users = this.dataService.users;
      const user = users.find(u => u.username === username);
      const newTaskList: TaskList = {
        id: user.board.taskLists.length
          ? user.board.taskLists[user.board.taskLists.length - 1].id + 1
          : 0,
        name: taskListName,
        tasks: [],
        lastModifiedDate: JSON.stringify(new Date()),
      };
      user.board.taskLists.push(newTaskList);
      await this.dataService.saveUsers(users);
      return true;
    } catch (error) {
      console.error('添加任务列表失败:', error.message);
      return false;
    }
  }

  async updateTaskListName(
    username: string,
    taskListName: string,
    taskListId: number
  ): Promise<boolean> {
    try {
      const users = this.dataService.loadUsers();
      const user = users.find(u => u.username === username);
      const taskList: TaskList = user.board.taskLists.find(
        l => l.id === taskListId
      );
      taskList.name = taskListName;
      taskList.lastModifiedDate = JSON.stringify(new Date());
      await this.dataService.saveUsers(users);
      return true;
    } catch (error) {
      console.error('更新看板名称失败:', error.message);
      return false;
    }
  }

  async deleteTaskList(username: string, taskListId: number) {
    try {
      const user = this.dataService
        .loadUsers()
        .find(u => u.username === username);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      user.board.taskLists = user.board.taskLists.filter(
        l => l.id !== taskListId
      );
      await this.dataService.saveUsers(this.dataService.users);
      return { success: true, message: 'Delete task list.' };
    } catch (error) {
      console.error('删除任务列表失败:', error.message);
      return { success: false, message: 'Failed to delete task list' };
    }
  }

  async addTask(
    username: string,
    taskListId: number,
    taskName: string
  ): Promise<boolean> {
    const users = this.dataService.loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('用户未找到');
      return false;
    }
    const taskList: TaskList = user.board.taskLists.find(
      l => l.id === taskListId
    );
    if (!taskList) {
      console.log('taskList未找到');
      return false;
    }
    taskList.lastModifiedDate = JSON.stringify(new Date());
    const newTask: Task = {
      id: taskList.tasks.length
        ? taskList.tasks[taskList.tasks.length - 1].id + 1
        : 0,
      name: taskName,
      comments: [],
      attachments: [],
    };
    taskList.tasks.push(newTask);
    await this.dataService.saveUsers(users);
    return true;
  }

  async updateTask(
    username: string,
    taskListId: number,
    taskId: number,
    taskName: string
  ) {
    const users = this.dataService.loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
      return { success: false, message: 'user not found' };
    }
    const taskList = user.board.taskLists.find(l => l.id === taskListId);
    taskList.lastModifiedDate = JSON.stringify(new Date());
    const task = taskList.tasks.find(l => l.id === taskId);
    if (!task) {
      return { success: false, message: 'task not found' };
    }
    task.name = taskName;
    await this.dataService.saveUsers(users);
    return { success: true, message: 'task updated successfully' };
  }

  async deleteTask(username: string, taskListId: number, taskId: number) {
    const user = this.dataService
      .loadUsers()
      .find(u => u.username === username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    const taskList = user.board.taskLists.find(l => l.id === taskListId);
    taskList.lastModifiedDate = JSON.stringify(new Date());
    if (!taskList) {
      return {
        success: false,
        code: 'TASK_LIST_NOT_FOUND',
        message: `Task list with id ${taskListId} not found`,
      };
    }
    // 检查 taskList.tasks 是否存在且为数组
    if (!Array.isArray(taskList.tasks)) {
      return {
        success: false,
        code: 'TASK_LIST_INVALID',
        message: 'Task list is invalid or tasks is not an array',
      };
    }
    // 检查 taskList.tasks 是否为空
    if (taskList.tasks.length === 0) {
      return {
        success: false,
        code: 'NO_TASKS',
        message: `Task list with id ${taskListId} has no tasks`,
      };
    }
    taskList.tasks = taskList.tasks.filter(t => t.id !== taskId);
    try {
      await this.dataService.saveUsers(this.dataService.users);
      return { success: true, message: 'Task removed successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to save changes' };
    }
  }

  async updateComments(
    username: string,
    taskListId: number,
    taskId: number,
    comments: { id: string; text: string }[] | null
  ) {
    try {
      const users = this.dataService.loadUsers();
      const user = users.find(u => u.username === username);
      const taskList = user.board.taskLists.find(l => l.id === taskListId);
      taskList.lastModifiedDate = JSON.stringify(new Date());
      const task = taskList.tasks.find(l => l.id === taskId);
      task.comments = comments;
      await this.dataService.saveUsers(users);
      return { success: true, message: 'Comments updated successfully' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Comments updated failed' };
    }
  }

  async addAttachment(
    username: string,
    taskListId: number,
    taskId: number,
    attachment: Attachment
  ) {
    try {
      const users = this.dataService.loadUsers();
      const user = users.find(u => u.username === username);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      const taskList = user.board.taskLists.find(l => l.id === taskListId);
      taskList.lastModifiedDate = JSON.stringify(new Date());
      if (!taskList) {
        return { success: false, message: 'Task list not found' };
      }
      const task = taskList.tasks.find(t => t.id === taskId);
      if (!task) {
        return {
          success: false,
          message: 'Task not found',
          attachment: attachment,
        };
      }
      if (!task.attachments) {
        task.attachments = [];
      }
      task.attachments.push(attachment);
      await this.dataService.saveUsers(users);
      return {
        success: true,
        message: 'Attachment added successfully',
        attachment: attachment,
      };
    } catch (error) {
      console.error('添加附件失败:', error.message);
      return {
        success: false,
        message: 'Failed to add attachment',
        attachment: attachment,
      };
    }
  }

  async deleteAttachment(
    username: string,
    taskListId: number,
    taskId: number,
    filename: string
  ) {
    try {
      const user = this.dataService
        .loadUsers()
        .find(u => u.username === username);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      const taskList = user.board.taskLists.find(l => l.id === taskListId);
      taskList.lastModifiedDate = JSON.stringify(new Date());
      if (!taskList) {
        return { success: false, message: 'Task list not found' };
      }
      const task = taskList.tasks.find(t => t.id === taskId);
      if (!task) {
        return {
          success: false,
          message: 'Task not found',
          filename: filename,
        };
      }
      task.attachments = task.attachments.filter(a => a.filename !== filename);
      await this.dataService.saveUsers(this.dataService.users);
      return { success: true, message: 'Attachment deleted successfully' };
    } catch (error) {
      console.error('删除附件失败:', error.message);
      return { success: false, message: 'Failed to delete attachment' };
    }
  }

  async updateAvatar(username: string, extname: string) {
    try {
      const users = this.dataService.loadUsers();
      const user = users.find(u => u.username === username);
      user.avatar = `/${username}/avatar${extname}`;
      console.log(user.avatar);
      await this.dataService.saveUsers(users);
    } catch (e) {
      console.error(e);
    }
  }

  async getAvatarInfo(username: string) {
    const user = this.dataService.users.find(u => u.username === username);
    if (user) {
      return user.avatar;
    }
    return null;
  }
}
