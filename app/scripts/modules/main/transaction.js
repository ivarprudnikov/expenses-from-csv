export class Transaction {

  static list(){
    JSON.parse(localStorage.getItem('transactions'))
  }

  constructor(){
    this.id = null
    this.account = null
    this.date = null
    this.description = null
    this.type = null
    this.value = 0
  }

  generateId(){
    return encodeURIComponent(`${this.account}-${this.date}-${this.description}-${this.value}`)
  }

  setData(data){
    this.account = data[0]
    this.date = data[1]
    this.description = data[2]
    this.type = data[7]
    this.value = data[4] || -data[3]
    this.id = this.generateId()

    return this
  }

  save(){

    let items = Transaction.list()
    if(!items)
      items = {}
    items[this.id] = this;

    console.debug(items);

    localStorage.setItem('transactions', JSON.stringify(items))

    return this
  }
}
