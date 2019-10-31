class EventBus {
    constructor() {
        EventBus.EventStore = {
            $uid: 0
        };
    }

    on(type, handler) {
        let cache = EventBus.EventStore[type] || (EventBus.EventStore[type] = {});
        handler.$uid = handler.$uid || EventBus.EventStore.$uid++;
        cache[handler.$uid] = handler;
    }

    emit(type, ...param) {
        let cache = EventBus.EventStore[type],
            key,
            tmp;

        if (!cache) return;

        for (key in cache) {
            tmp = cache[key];
            tmp.call(this, ...param);
        }
    }

    off(type, handler) {
        let counter = 0,
            cache = EventBus.EventStore[type];

        if (handler == null) {
            if (!cache) return true;
            return !!EventBus.EventStore[type] && (delete EventBus.EventStore[type]);
        } else {
            !!EventBus.EventStore[type] && (delete EventBus.EventStore[type][handler.$uid]);
        }

        for (const key in cache) {
            console.log(key);
            counter++;
        }

        return !counter && (delete EventBus.EventStore[type]);
    }
}

// Object.defineProperty(EventBus, 'EventBus', {
//     value: 1,
//     readable: false,
//     writable: true,
//     enumerable: false,
//     configurable: false
// });

let EventBus1 = new EventBus();

EventBus1.on('a', (value) => {
    console.log(value)
})
EventBus1.emit('a', 1);
