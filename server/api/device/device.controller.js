/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/devices              ->  index
 * POST    /api/devices              ->  create
 * GET     /api/devices/:id          ->  show
 * PUT     /api/devices/:id          ->  upsert
 * PATCH   /api/devices/:id          ->  patch
 * DELETE  /api/devices/:id          ->  destroy
 */

import { applyPatch } from 'fast-json-patch';
import Device from './device.model';

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

// Gets a list of Devices
export function index(req, res) {
    return Device.find({ user: req.user }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Device from the DB
export function show(req, res) {
    return Device.findById(req.params.id, { user: req.user }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Device in the DB
export function create(req, res) {
    return Device.create(Object.assign(req.body, { user: req.user }))
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Device in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Device.findOneAndUpdate({ _id: req.params.id, user: req.user }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Device in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Device.findById(req.params.id, { user: req.user }).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Device from the DB
export function destroy(req, res) {
    return Device.findById(req.params.id, { user: req.user }).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
