// utils
require('dotenv').config();

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

// interface
interface UserData {
  id: number;
  account: string;
  password: string;
  name: string | null;
  birthday: string | null;
};
interface TokenUserData {
  id: number;
  account: string;
  name: string | null;
  birthday: string | null;
};

// moke data
const users: UserData[] = require('../../user-data.json');


// resolvers
export const resolvers = {
  Query: {
    login: async(_parent: any, args: { account: string, password: string }) => {
      const { account, password }: { account: string, password: string } = args;

      // find user in database
      const theUser = users.find(user => user.account === account);
      if (!theUser) throw new Error('Email Account Not Exists');

      // verify password
      const verifyResult = await argon2.verify(theUser.password, password);
      if (!verifyResult) throw new Error('Wrong Password');

      // generate JWT
      const token: TokenUserData = await jwt.sign(
        {
          id: theUser.id,
          account: theUser.account,
          name: theUser.name,
          birthday: theUser.birthday
        },
        process.env.JWT_secret,
        { expiresIn: process.env.JWT_expire }
      );

      // return JWT
      return { token };
    },


  }
};
