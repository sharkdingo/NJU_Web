import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as cors from '@koa/cors';
import { join } from 'path';
import * as upload from '@midwayjs/upload';
import { ReportMiddleware } from './middleware/report.middleware';
import * as crossDomain from '@midwayjs/cross-domain';
import * as koaStatic from 'koa-static';

@Configuration({
  imports: [
    koa,
    crossDomain,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    {
      component: cors,
      enabledEnvironment: ['local'],
    },
    upload,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
    this.app.use(
      cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      })
    );
    this.app.use(koaStatic(join(__dirname, '/public/avatars')));
  }
}
