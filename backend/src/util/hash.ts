import bcrypt from "bcrypt";

/* const salt = bcrypt.genSaltSync(10);
console.log(salt);

const hashed1 = bcrypt.hashSync("alma", salt);
console.log(hashed1); //valami

const hashed2 = bcrypt.hashSync("alma2", salt);
console.log(hashed2); //valami mas

const hashed3 = bcrypt.hashSync("alma", salt);
console.log(hashed3); //valami (ugyanaz)
 */

export const hash = async (data: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hashed = await bcrypt.hash(data, salt);
  return hashed;
};
