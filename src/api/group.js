import {get, post, put, del} from './helper';

export {
  createGroup, updateGroup, delGroup, getGroup, getGroups,
  addUser, setUser, removeUser,
};

const createGroup = post.bind(null, '/api/v1/group');
const addUser     = post.bind(null, '/api/v1/groupuser');
const setUser     = put.bind(null, '/api/v1/groupuser');
const removeUser  = del.bind(null, '/api/v1/groupuser');
const updateGroup = put.bind(null, '/api/v1/group');
const getGroups   = get.bind(null, '/api/v1/groups');
const getGroup    = get.bind(null, '/api/v1/group');
const delGroup    = del.bind(null, '/api/v1/group');
