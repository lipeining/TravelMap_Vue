import {get, post, put, del} from './helper';

export {
  createPlan, updatePlan, delPlan, getPlan, getPlans,
  addUser, setUser, removeUser, getPlanUsers,
  getPlanGroups, addGroup, setGroup, removeGroup,
  getPlanSpots, addSpot, setSpot, removeSpot,
};

const createPlan    = post.bind(null, '/api/v1/plan');
const getPlanUsers  = get.bind(null, '/api/v1/planusers');
const addUser       = post.bind(null, '/api/v1/planuser');
const setUser       = put.bind(null, '/api/v1/planuser');
const removeUser    = del.bind(null, '/api/v1/planuser');
const getPlanGroups = get.bind(null, '/api/v1/plangroups');
const addGroup      = post.bind(null, '/api/v1/plangroup');
const setGroup      = put.bind(null, '/api/v1/plangroup');
const removeGroup   = del.bind(null, '/api/v1/plangroup');
const getPlanSpots  = get.bind(null, '/api/v1/planspots');
const addSpot       = post.bind(null, '/api/v1/planspot');
const setSpot       = put.bind(null, '/api/v1/planspot');
const removeSpot    = del.bind(null, '/api/v1/planspot');
const updatePlan    = put.bind(null, '/api/v1/plan');
const getPlans      = get.bind(null, '/api/v1/plans');
const getPlan       = get.bind(null, '/api/v1/plan');
const delPlan       = del.bind(null, '/api/v1/plan');
