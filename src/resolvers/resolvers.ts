// utils
require('dotenv').config();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;

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

// moke data (database)
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

    me: async(_parent: any, _args: any, context: TokenUserData) => {
      if (!context) throw new Error ('Please log in first');
      return context;
    }
  },

  Mutation: {
    register: async(_parent: any, args: { account: string, password: string }) => {
      const { account, password }: { account: string, password: string } = args;

      // check if account(email) exist
      const theUser = users.find(user => user.account === account);
      if (theUser) throw new Error('Email Account Already Exists');

      // hash password (to store in DB)
      const hashPassword = await argon2.hash(password);

      // create user
      const newUser: UserData = {
        id: users.length + 1,
        account: account,
        password: hashPassword,
        name: null,
        birthday: null
      };
      users.push(newUser);

      // store user data into DB (json)
      await fs.writeFile('../../user-data.json', JSON.stringify(users));

      // return user data
      return newUser;
    },
  }
};
