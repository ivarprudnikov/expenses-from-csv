import {Component} from 'angular2/core';
var Papa = require('Papa');

@Component({
  selector: 'main',
  template: `<section class="container">
    <p>Main component</p>
    <input type="file" (change)="onChange($event)"/>
    <table>
      <thead>
        <tr>
          <th>s</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>r</td>
        </tr>
      </tbody>
    </table>
  </section>`
})
export class Main {

  constructor(){
    this.data = {
      headers: [],
      rows: []
    }
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
      Papa.parse(file, {
        complete: function(results) {
          this.data.headers = results.data[0];
          this.data.rows = results.data.splice(1);
        }
      });
    }
  }

}
