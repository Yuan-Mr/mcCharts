@Observed
export class Options {
  constructor(options) {
    for (const key in options) {
      this[key] = options[key]
    }
  }
  setVal (options) {
    for (const key in options) {
      this[key] = options[key]
    }
  }
}