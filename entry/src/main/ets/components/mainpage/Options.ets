import { InterfaceObj } from '../../utils/chartInterface'
@Observed
export class Options {
  constructor(options: InterfaceObj) {
    this.setVal(options)
  }
  setVal (options: InterfaceObj) {
    const keys = Object.keys(options)
    keys.forEach(item => {
      this[item] = options[item]
    })
  }
}