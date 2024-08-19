/**
 * @description User-Service parameters
 */
export interface Comment {
  id: string;
  text: string;
}

export interface Attachment {
  originalName: string;
  filename: string;
  url: string;
}

export interface Task {
  id: number;
  name: string;
  comments: Comment[];
  attachments: Attachment[];
}

export interface TaskList {
  id: number;
  name: string;
  tasks: Task[];
  lastModifiedDate: string;
}

export interface Board {
  name: string;
  taskLists: TaskList[];
}

export interface IUserOptions {
  username: string;
  password: string;
  board: Board;
  avatar: string;
}
