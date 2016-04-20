export class Transaction {

  static all(){
    return JSON.parse(localStorage.getItem('transactions'))
  }

  constructor(values){
    this.id = null
    this.account = null
    this.date = null
    this.description = null
    this.type = null
    this.value = 0
    this.balance = 0

    if(values){
      this.setData(values)
    }
  }

  generateId(){
    return encodeURIComponent(`${this.account}-${this.date}-${this.description}-${this.value}`)
  }

  parseValue(val){
    if(typeof val === 'string'){
      return parseFloat(val.split(",").join(""));
    }
    return val
  }

  setData(data){
    this.account = data[0]
    this.date = data[1]
    this.description = data[2]
    this.type = data[7]
    this.balance = this.parseValue(data[5])
    this.value = this.parseValue(data[4]) || -(this.parseValue(data[3]))
    this.id = this.generateId()

    return this
  }

  save(){

    let items = Transaction.all()
    if(!items) {
      items = {}
    }
    items[this.id] = this;

    localStorage.setItem('transactions', JSON.stringify(items))

    return this
  }
}
