/* eslint-disable no-console */
/* eslint-disable no-undef */
import {
	GET_EXISTING_GEOMETRY
} from '../actions'
import axios from 'axios'
import math from 'mathjs'
import UnableToFetchGeometryError from '../errors/UnableToFetchGeometryError'

const size = process.env.REACT_APP_GEOMETRY_SIZE
let geometryEndpoint = process.env.REACT_APP_GEOMETRY_ENDPOINT

const mockGeometry = {
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"properties": {
			"id": "963ae450-b02c-4442-83ea-1e7fef1da2a6",
			"frc": "70"
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[-70.2980376, 19.2364162],
				[-70.2979088, 19.2362351],
				[-70.2977586, 19.2359717],
				[-70.2976674, 19.2357742],
				[-70.2975333, 19.235445],
				[-70.2973456, 19.2351157],
				[-70.2972651, 19.2349182],
				[-70.2972276, 19.2348524],
				[-70.2971739, 19.2347207],
				[-70.2970988, 19.234589],
				[-70.2969915, 19.2343256],
				[-70.2968789, 19.2341281],
				[-70.2968145, 19.2339964],
				[-70.2967072, 19.233733],
				[-70.2966697, 19.2336672],
				[-70.2965785, 19.2334697],
				[-70.2964444, 19.2331404],
				[-70.2964014, 19.2329986],
				[-70.2963585, 19.232715]
			]
		}
	}, {
		"type": "Feature",
		"properties": {
			"id": "a61e907f-87fc-410a-9f5d-53a2700ae20e",
			"frc": "70"
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[-70.2963585, 19.232715],
				[-70.296267, 19.231629],
				[-70.296248, 19.231185],
				[-70.296428, 19.230643],
				[-70.296694, 19.2299289],
				[-70.2969571, 19.229154],
				[-70.297091, 19.228739],
				[-70.297166, 19.228465]
			]
		}
	}],
	"properties": {
		"branch": {
			"branchId": "233b38a4-f0bf-4289-bfdc-7f2a04fc4ab3"
		},
		"version": {
			"journalVersion": 359076838,
			"journalVersionString": "359076838"
		}
	}
}

function getCenterPoint(geometry) {
	let coordinates

	if (geometry.type === 'LineString') {
		coordinates = geometry.coordinates
	} else if (geometry.type === 'Polygon') {
		coordinates = geometry.coordinates[0]
	} else {
		throw new UnableToFetchGeometryError()
	}

	return math.mean(coordinates, 0)
}

const getGeometry = (action) => {
	return new Promise((resolve, reject) => {
		let latlng = getCenterPoint(action.payload.feature.geometry)
		const urlParams = new URLSearchParams()
		console.log(urlParams, action)
		console.log('process.env.REACT_APP_GEOMETRY_BRANCHID', process.env.REACT_APP_GEOMETRY_BRANCHID);

		if (action.payload.branch && action.payload.version) {
			urlParams.set('branchId', action.payload.branch)
			urlParams.set('version', action.payload.version)
		}
		action.payload.timestamp = new Date();
		console.log('branchId', process.env.REACT_APP_GEOMETRY_BRANCHID)
		if (action.payload.timestamp && !action.payload.version) {
			// date and version can not be used together, version has priority in our case
			urlParams.set('date', Math.floor(Date.parse(action.payload.timestamp)))
			urlParams.set('branchId', process.env.REACT_APP_GEOMETRY_BRANCHID)
		}
		console.log(`${geometryEndpoint}/getFeatureCollection/${latlng[1]}/${latlng[0]}/${size}`);

		axios.get(`${geometryEndpoint}/getFeatureCollection/${latlng[1]}/${latlng[0]}/${size}`, {
				params: urlParams
			})
			// axios.get(`${geometryEndpoint}/getFeatureCollection/${latlng[1]}/${latlng[0]}/${size}`, { params: urlParams })
			.then(res => resolve(res.data))
			.catch(error => {
				if (error.response) {
					if (error.response.status === 500) {
						reject(new UnableToFetchGeometryError())
					}
				}
				reject(new UnableToFetchGeometryError())
			})
	})
}




const getMockGeometry = (action) => {
	return new Promise((resolve, reject) => {
		resolve(mockGeometry)
	})
}

export default function geometryService(action) {
	switch (action.type) {
		case GET_EXISTING_GEOMETRY:
			// let geometry = getGeometry(action)
			// geometry.then((res)=>{
			//   console.log("res",res)
			// })
			// console.log(geometry)
			// return mockGeometry
			return getMockGeometry(action)
		default:
			console.warn('Unhandled action')
	}
}