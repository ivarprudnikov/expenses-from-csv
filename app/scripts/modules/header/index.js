import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Component} from 'angular2/core';

@Component({
  selector: 'app-header',
  directives: [ROUTER_DIRECTIVES],
  template: `
  <header class="navbar navbar-default navbar-main navbar-static-top" role="banner">
    <div class="container">
      <div class="navbar-header">
        <a [routerLink]="['Main']" class="navbar-brand logo">Expenses</a>
      </div>
      <nav role="navigation">
        <ul class="nav navbar-nav navbar-right">
        </ul>
      </nav>
    </div>
  </header>
  `
})
export class Header {}
