class PrettyPrinter {
  private static _asterisk = '*****************************************';

  /**
   * console.log a line with 41 asterisks
   *
   * @remarks
   * Logs an asterisks line
   *
   */
  static printAsterisk() {
    console.log(this._asterisk);
  }

  /**
   * console.log a sting formatted with the 41 asterisks
   *
   * @remarks
   * Logs a string formated to the 41 asterisks with 2 at start and 2 more at end
   *
   */
  static prettyLog(msg: string) {
    console.log('** ' + msg.padEnd(this._asterisk.length - 5, ' ') + '**');
  }

  /**
   * Returns form input type for a input data type
   *
   * @remarks
   * With a input data type, this function returns the form input type [string|number]
   *
   */

  static getFormInputType(inputDataType: any) {
    switch (inputDataType) {
      case 'u8':
      case 'i8':
      case 'u16':
      case 'i16':
      case 'u32':
      case 'i32':
      case 'u64':
      case 'i64':
      case 'BigUint':
      case 'BigInt':
      case 'isize':
      case 'usize':
        return 'number';
      default:
        return 'string';
    }
  }
}

export default PrettyPrinter;