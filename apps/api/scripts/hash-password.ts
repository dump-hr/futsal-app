import * as bcrypt from 'bcrypt';

const password = process.argv[2];
if (!password) {
  console.error('Usage: yarn hash-password <password>');
  process.exit(1);
}

const SALT_ROUNDS = 10;
void bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
  console.log(hash);
});
