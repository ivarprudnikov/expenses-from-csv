import {Component} from 'angular2/core';
import {Transaction} from './transaction';
var Papa = require('Papa');

@Component({
  selector: 'main',
  template: `<section class="container">
    <p>Upload exported CSV from AIB</p>
    <input type="file" (change)="onChange($event)"/>
    <table class="table table-condensed table-bordered table-striped">
      <thead>
        <tr>
          <th *ngFor="#k of data.headers">{{k}}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="#transaction of data.rows">
          <td *ngFor="#k of data.headers">{{transaction[k]}}</td>
        </tr>
      </tbody>
    </table>
  </section>`
})
export class Main {

  constructor(){
    let transactions = Transaction.list()
    let list = []
    if(transactions){
      list = Object.keys(transactions).map((v) => transactions[v])
    }
    this.data = {
      headers: ['id'],
      rows: list
    }
  }

  setData(headers, rows){
    this.data.headers = ['id'];
    this.data.rows = rows.map(v => (new Transaction()).setData(v).save());
  }

  parseFile(file){
    let that = this;
    Papa.parse(file, {
      complete: (results) => {
        that.setData(results.data[0], results.data.splice(1))
      }
    });
  }

  onChange(event){

    var files = event.srcElement.files;
    var file;
    if(files.length){
      file = files[0]
    } else {
      file = null;
    }

    if(file){
      this.parseFile(file);
    }
  }

}
