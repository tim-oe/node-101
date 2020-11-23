import {EncryptionSvc} from '../../src/svc/EncryptionSvc';

test('round trip', () => {
  const expected = '666666CP';

  const crypt = new EncryptionSvc();

  const value = crypt.encrypt(expected);

  console.log(' encrypted [' + value + ']');

  expect(crypt.decrypt(value)).toBe(expected);
});
