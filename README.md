# TestTaxamoTransactionAPI
This solution is just an example how to test RESTfull API  using such frameworks like Mocha and Chakram.

System prerequisites:
 * **Node.JS** version 6.10.x (LTS);

* Tested across Linux environment. *

## How it works
This approach is very simple. [Mocha](https://mochajs.org) environment allows you to run unit tests, but it also can be used to send request to the RESTful API. Here I used [Chakram](http://dareid.github.io/chakram/) framework to send requests via HTTPS protocol. It just extends well known ChaiJS framework and allows us to use chai-styled assertions and expectations. The most important thing is that Chakram is working in contexts of promises and it is very convenient to use it in our case.
We can use stdoutput to create console report: just update scripts block in **package.json** file to redirect output stream to file: **> some_file.txt**. But by default Mocha will use Mochawesome reporter to generate very beautiful html report. Just check **mochawesome-reports** directory after tests.
Also I used [Chance](http://chancejs.com) to generate random entities to put them into API. It's very interesting generator, it can create lots of various entities and very useful in scope of black box testing.

## How to run?
  1. Clone repository.
  2. Run command from project's directory: **npm install**
  3. Make sure that required packages are installed without errors
  4. Run command from project's directory: **npm test**

## Notes.
