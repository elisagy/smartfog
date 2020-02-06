/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/readings              ->  index
 * POST    /api/readings              ->  create
 * GET     /api/readings/:id          ->  show
 * PUT     /api/readings/:id          ->  upsert
 * PATCH   /api/readings/:id          ->  patch
 * DELETE  /api/readings/:id          ->  destroy
 */

import { applyPatch } from 'fast-json-patch';
import Reading from './reading.model';
import Device from './../device/device.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function(entity) {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch (err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function removeEntity(res) {
    return function(entity) {
        if (entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Readings
export function index(req, res) {
    return Device.find({ user: req.user._id }).exec()
        .then(devices => Reading.find({ device: { $in: devices.map(device => device._id) } }).exec())
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Reading from the DB
export function show(req, res) {
    return Device.find({ user: req.user._id }).exec()
        .then(devices => Reading.findOne({ _id: req.params.id, device: { $in: devices.map(device => device._id) } }).exec())
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Reading in the DB
export function create(req, res) {
    return Reading.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Reading in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Device.find({ user: req.user._id }).exec()
        .then(devices => Reading.findOneAndUpdate({ _id: req.params.id, device: { $in: devices.map(device => device._id) } }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec())
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Reading in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Device.find({ user: req.user._id }).exec()
        .then(devices => Reading.findOne({ _id: req.params.id, device: { $in: devices.map(device => device._id) } }).exec())
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Reading from the DB
export function destroy(req, res) {
    return Device.find({ user: req.user._id }).exec()
        .then(devices => Reading.findOne({ _id: req.params.id, device: { $in: devices.map(device => device._id) } }).exec())
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
