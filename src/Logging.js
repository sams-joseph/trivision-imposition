class Logging {
    constructor(jobNumber, operator, adobeVersion, macName, macVersion) {
        this.jobNumber = jobNumber;
        this.operator = operator;
        this.adobeVersion = adobeVersion;
        this.macName = macName;
        this.macVersion = macVersion;
    }

    logger(error) {
        let currentdate = new Date();
        let datetime = currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/"
                        + currentdate.getFullYear() + " @ "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":"
                        + currentdate.getSeconds();

          let filepath = `G33STORE-1/4_Joe/scripts/_logs/trivision/${this.jobNumber}.txt`;
          let write_file = File(filepath);
          let bar = '====================';

          if (!write_file.exists) {
            write_file = new File(filepath);
                  let out;
              if (write_file !== '') {
                out = write_file.open('w', undefined, undefined);
                write_file.encoding = "UTF-8";
                write_file.lineFeed = "Macintosh";
              }
              if (out !== false) {
                write_file.writeln(
`${this.operator} worked ${this.jobNumber} at ${datetime}\n
System Specs - Adobe Version: ${this.adobeVersion} | Mac Name: ${this.macName} | Mac Version: ${this.macVersion}\n
Any Errors: ${error}\n${bar}\n`
                );
                write_file.close();
              }
          } else {
            let append_file = File(filepath);
              append_file.open('a', undefined, undefined);
              if (append_file !== '') {
                append_file.writeln(
`${this.operator} worked ${this.jobNumber} at ${datetime}\n
System Specs - Adobe Version: ${this.adobeVersion} | Mac Name: ${this.macName} | Mac Version: ${this.macVersion}\n
Any Errors: ${error}\n${bar}\n`
                );

              append_file.close();
            }
          }
      }
}

export default Logging;
