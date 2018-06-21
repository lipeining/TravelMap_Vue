import {get, post, put, del} from './helper';

export {
  createPlan, updatePlan, delPlan, getPlan, getPlans,
  addUser,
};

const createPlan = post.bind(null, '/api/v1/plan');
const addUser    = post.bind(null, '/api/v1/planuser');
const updatePlan = put.bind(null, '/api/v1/plan');
const getPlans   = get.bind(null, '/api/v1/plans');
const getPlan    = get.bind(null, '/api/v1/plan');
const delPlan    = del.bind(null, '/api/v1/plan');
