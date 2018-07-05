import {get, post, put, del} from './helper';

export {
  createSpot, updateSpot, delSpot, getSpot, getSpots,
  updateSpotLocation,
};

const createSpot = post.bind(null, '/api/v1/spot');
const updateSpot = put.bind(null, '/api/v1/spot');
const getSpots   = get.bind(null, '/api/v1/spots');
const getSpot    = get.bind(null, '/api/v1/spot');
const delSpot    = del.bind(null, '/api/v1/spot');

const updateSpotLocation = put.bind(null, '/api/v1/spotlocation');