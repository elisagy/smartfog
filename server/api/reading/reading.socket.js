/**
 * Broadcast updates to client when the model changes
 */

import ReadingEvents from './reading.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(spark) {
    // Bind model events to socket events
    for (let event of events) {
        var listener = createListener(`reading:${event}`, spark);

        ReadingEvents.on(event, listener);
        spark.on('disconnect', removeListener(event, listener));
    }
}


function createListener(event, spark) {
    return function(doc) {
        doc.populate('device')
            .execPopulate(function(err, doc) {
                if (!err &&
                    spark.userId &&
                    doc.device &&
                    doc.device.user &&
                    doc.device.user._id &&
                    doc.device.user._id.toString() === spark.userId) {
                    spark.emit(event, doc);
                }
            });
    };
}

function removeListener(event, listener) {
    return function() {
        ReadingEvents.removeListener(event, listener);
    };
}
