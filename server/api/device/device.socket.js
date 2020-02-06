/**
 * Broadcast updates to client when the model changes
 */

import DeviceEvents from './device.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener(`device:${event}`, spark);

        DeviceEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}


function createListener(event, spark) {
    return function(doc) {
        if (spark.userId &&
            doc.user &&
            doc.user._id &&
            doc.user._id.toString() === spark.userId) {
            spark.emit(event, doc);
        }
    };
}

function removeListener(event, listener) {
    return function() {
        DeviceEvents.removeListener(event, listener);
    };
}
