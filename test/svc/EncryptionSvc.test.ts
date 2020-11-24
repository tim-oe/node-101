import EncryptionSvc from '../../src/svc/EncryptionSvc';

describe("EncryptionSvc Test", () => {

  beforeAll(async () => {
    //TODO code to run before all tests
  });

  beforeEach(async () => {
    //TODO code to run before each tests
  });

  afterEach(async () => {
    //TODO code to run after each tests
  });

  it("should round trip", async () => {
    const expected = '666666CP';

    const crypt = new EncryptionSvc();

    const value = crypt.encrypt(expected);

    console.log(' encrypted [' + value + ']');

    expect(crypt.decrypt(value)).toBe(expected);
  });
});