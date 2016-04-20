import {Component, ElementRef} from 'angular2/core';
var d3 = require('d3');

@Component({
  selector: 'chart-d3-line',
  template: ``,
  providers: [ElementRef],
  inputs: [ 'transactions' ]
})
export class Chart {

  static get parameters() {
    return [[ElementRef]];
  }

  constructor(elementRef){

    this.el = elementRef;

    this.margin = {top: 20, right: 80, bottom: 30, left: 80}
    this.width = 960 - this.margin.left - this.margin.right
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.formatDate = d3.time.format("%d/%m/%Y");
    this.color = d3.scale.category10();

    let self = this

    this.x = d3.time.scale()
      .range([0, this.width]);

    this.y = d3.scale.linear()
      .range([this.height, 0]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

    this.line = d3.svg.line()
      .x(function(d) { return self.x(self.formatDate.parse(d.date)); })
      .y(function(d) { return self.y(d.balance); });

    this.svg = d3.select(this.el.nativeElement).append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


  }

  ngOnInit(){
    this.setData(this.transactions)
  }

  ngOnChanges(record){
    this.setData(record.transactions.currentValue)
  }

  setData(data){

    data = data || [];

    let self = this

    let transactions = data.reduce((memo, transaction) => {
      memo[transaction.account] = memo[transaction.account] || [];
      memo[transaction.account].push(transaction)
      return memo;
    }, {});

    this.color.domain(d3.keys(transactions));

    var accounts = this.color.domain().map(function(acc) {
      return {
        name: acc,
        values: transactions[acc]
      };
    });

    this.x.domain(d3.extent(data, function(d) {
      return self.formatDate.parse(d.date);
    }));

    this.y.domain([
      d3.min(accounts, function(acc) { return d3.min(acc.values, function(v) { return v.balance; }); }),
      d3.max(accounts, function(acc) { return d3.max(acc.values, function(v) { return v.balance; }); })
    ]);

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis);

    this.svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Amount (€)");

    var account = this.svg.selectAll(".account")
      .data(accounts)
      .enter().append("g")
      .attr("class", "account");

    account.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return self.line(d.values); })
      .style("stroke", function(d) { return self.color(d.name); });

    account.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + self.x(self.formatDate.parse(d.value.date)) + "," + self.y(d.value.balance) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

  }

}
