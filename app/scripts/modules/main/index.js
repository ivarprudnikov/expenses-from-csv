import {Component} from 'angular2/core';
import {Transaction} from './transaction';
import {Chart} from './chart'
var Papa = require('Papa');

@Component({
  selector: 'main',
  directives: [Chart],
  template: `<section class="container">
    <p class="select-file-input-box">
      <label for="file-input">Upload exported CSV from AIB</label>
      <input id="file-input" type="file" (change)="onChange($event)"/>
    </p>

    <div *ngIf="data?.rows?.length">
      <h3>Balance</h3>
      <chart-d3-line [transactions]="data.rows"></chart-d3-line>
      <hr>
    </div>

    <table *ngIf="data?.rows?.length" class="table table-condensed table-bordered table-striped">
      <thead>
        <tr>
          <th></th>
          <th *ngFor="#k of data.headers">{{k}}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="#transaction of data.rows; #i = index">
          <td>{{i + 1}}</td>
          <td *ngFor="#k of data.headers">{{transaction[k]}}</td>
        </tr>
      </tbody>
    </table>
  </section>`
})
export class Main {

  constructor(){
    let transactions = Transaction.all()
    let list = []
    if(transactions){
      list = Object.keys(transactions).map((v) => transactions[v])
    }
    this.data = {
      headers: ['account', 'date', 'description', 'type', 'value', 'balance'],
      rows: list
    }
  }

  setRows(rows){
    this.data.rows = rows.map(v => (new Transaction(v)).save());
  }

  parseFile(file){
    let that = this;
    Papa.parse(file, {
      complete: (results) => {
        let columns = results.data[0]
        that.setRows(results.data.splice(1))
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

  chartClicked(e) {
    console.log(e);
  }

  chartHovered(e) {
    console.log(e);
  }

}
