import {get, post, put, del} from './helper';

export {
  login, reg, update, logout,
  getUsers, getUser, getCaptcha, delCaptcha,
  getUserNames,
};
const login        = post.bind(null, '/api/v1/login');
const reg          = post.bind(null, '/api/v1/reg');
const logout       = get.bind(null, '/api/v1/logout');
const update       = put.bind(null, '/api/v1/user');
const getUsers     = get.bind(null, '/api/v1/users');
const getUserNames = get.bind(null, '/api/v1/usernames');
const getUser      = get.bind(null, '/api/v1/user');
const getCaptcha   = get.bind(null, '/api/v1/captcha');
const delCaptcha   = del.bind(null, '/api/v1/captcha');
