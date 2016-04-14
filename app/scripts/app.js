import {Main} from './modules/main/index'
import {Header} from './modules/header/index'
import {APP_BASE_HREF, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, RouteParams, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {provide, Component, Input} from 'angular2/core';

@Component({
  selector: '#application',
  viewProviders: [
    ROUTER_PROVIDERS,
    provide(APP_BASE_HREF, {useValue: '/'}),
    provide(LocationStrategy, {useClass: HashLocationStrategy})
  ],
  directives: [ROUTER_DIRECTIVES, Header],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
@RouteConfig([
  { path: '/', component: Main, name: 'Main', useAsDefault: true }
])
export class App {}
