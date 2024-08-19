import { MidwayConfig } from '@midwayjs/core';
import * as path from 'path';

export default {
  keys: '1723538137109_7775',
  koa: {
    port: 7001,
  },
  cors: {
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  upload: {
    // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
    mode: 'file',
    // fileSize: string, 最大上传文件大小，默认为 10mb
    fileSize: '10mb',
    // whitelist: string[]，文件扩展名白名单
    whitelist: [
      '.jpg',
      '.png',
      '.pdf',
      '.txt',
      '.zip',
      '.md',
      '.doc',
      '.docx',
      '.epub',
      '.zip',
      '.7z',
      '.mp3',
      '.mp4',
    ],
    // tmpdir: string，上传的文件临时存储路径
    tmpdir: path.join(__dirname, '../public/uploads/tmp'),
    cleanTmpdir: false,
    // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
    base64: false,
    // 是否允许多文件上传
    multipart: true,
  },
} as MidwayConfig;
