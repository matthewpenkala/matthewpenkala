const virtualpointer = (() => {
    'use strict';
    // some default values for running events
    let mouse_position = {
        x: 1,
        y: 1
    };
    let event_queue = [];
    const default_interval = 20;
    const first_event_offset = 50;
    const default_flick_duration = 200;
    const default_click_duration = Math.random() * (250 - 20) + 20;
    const default_screen_x_offset = 1;
    const default_screen_y_offset = 30;

    // function to dispatch event inside the browser
    function send_event(type, clientX, clientY, element, button, screenX, screenY, isTouchEvent, scrollLeft, scrollTop) {
        if (type === 'scroll') {
            window.scrollTo(scrollLeft, scrollTop);
            return;
        }
        // calculate screenX and screenY if not provided
        if (!screenX) {
            screenX = clientX + default_screen_x_offset;
        }
        if (!screenY) {
            screenY = clientY + default_screen_y_offset;
        }
        // if button is not specified, assume the button is the left mouse button
        if (!button && (type === 'click' || type === 'mousedown' || type === 'mouseup')) {
            button = 0; // left button is default
            // TODO: handle IE8 and below where left button = 0
        }
        // detail is the value for # of times this element has been clicked, set it to 1 when doing click events
        const detail = type !== 'mousemove' && type !== 'touchmove' ? 1 : 0;
        // construct new event object, either touch or mouse event
        const eventObject = isTouchEvent && ('ontouchstart' in window || navigator.msMaxTouchPoints > 0) ?
            document.createEvent('TouchEvent') :
            document.createEvent('MouseEvent');
        eventObject.initEvent(type, true, true, window, detail, screenX, screenY, clientX, clientY, false, false, false, false, button, null);
        // if element specified, fire event on the element object
        if (element) {
            element.dispatchEvent(eventObject);
        } else {
            document.body.dispatchEvent(eventObject);
        }
        mouse_position = {
            x: screenX,
            y: screenY
        };
    }

    // processes event stack
    function process_event_queue() {
        if (event_queue.length) {
            const current_event = event_queue[0];
            const next_event = event_queue[1];
            send_event(current_event.type, current_event.pageX, current_event.pageY, current_event.target, null, current_event.screenX, current_event.screenY, current_event.isTouchEvent, current_event.scrollLeft, current_event.scrollTop);
            if (next_event) {
                const offset = next_event.timestamp - current_event.timestamp;
                setTimeout(process_event_queue, offset);
            }
            event_queue.shift();
        }
    }

    function get_offset_of_element(element) {
        // calculate position of element
        const body_rect = document.body.getBoundingClientRect();
        const elem_rect = element.getBoundingClientRect();
        const y_offset = elem_rect.top - body_rect.top;
        const x_offset = elem_rect.left - body_rect.left;
        // return values
        return {
            x: x_offset,
            y: y_offset
        };
    }

    // constructs mouse movement stack to move mouse to an element over a set amount of time
    function build_mouse_movement_queue(element, duration, is_mobile) {
        // calculate position of element
        const element_offset = get_offset_of_element(element);
        // calculate distance
        const x_distance = element_offset.x - mouse_position.x;
        const y_distance = element_offset.y - mouse_position.y;
        // determine number of increments
        const increments = duration / default_interval;
        // divide number of milliseconds for duration by 20, since we want to send events every 20ish milliseconds
        for (let i = 1; i <= increments; i++) {
            const new_x_pos = Math.round(x_distance / increments * i) + mouse_position.x;
            const new_y_pos = Math.round(y_distance / increments * i) + mouse_position.y;
            event_queue.push({
                type: 'mousemove',
                pageX: new_x_pos,
                pageY: new_y_pos,
                screenX: new_x_pos + default_screen_x_offset,
                screenY: new_y_pos + default_screen_y_offset,
                timestamp: i * default_interval
            });
        }
    }

    // construct click event stack to click on an element
    function build_click_event_queue(element, duration, is_mobile) {
        // calculate position of element
        const element_offset = get_offset_of_element(element);
        // get timestamp of last event in queue
        const last_timestamp = event_queue.length ? event_queue[event_queue.length - 1].timestamp : 0;
        if (!duration) {
            duration = default_click_duration;
        }
        // mobile events are different (touchstart)
        if (is_mobile) {
            const screen_x = element_offset.x;
            const screen_y = element_offset.y;
            event_queue.push({
                type: 'touchstart',
                pageX: element_offset.x,
                pageY: element_offset.y,
                screenX: screenX,
                screenY: screenY,
                timestamp: last_timestamp,
                target: element,
                isTouchEvent: true
            });
            event_queue.push({
                type: 'touchmove',
                pageX: element_offset.x,
                pageY: element_offset.y,
                screenX: screenX,
                screenY: screenY,
                timestamp: last_timestamp + Math.floor(default_click_duration / 2),
                target: element,
                isTouchEvent: true
            });
            event_queue.push({
                type: 'touchend',
                pageX: element_offset.x,
                pageY: element_offset.y,
                screenX: screenX,
                screenY: screenY,
                timestamp: last_timestamp + default_click_duration,
                target: element,
                isTouchEvent: true
            });
        } else {
            const screen_x = element_offset.x + default_screen_x_offset;
            const screen_y = element_offset.y + default_screen_y_offset;
        }
        event_queue.push({
            type: 'mouseover',
            pageX: element_offset.x,
            pageY: element_offset.y,
            screenX: screenX,
            screenY: screenY,
            timestamp: last_timestamp + default_click_duration + 10,
            target: element,
            isTouchEvent: false
        });
        event_queue.push({
            type: 'mousemove',
            pageX: element_offset.x,
            pageY: element_offset.y,
            screenX: screenX,
            screenY: screenY,
            timestamp: last_timestamp + default_click_duration + 20,
            target: element,
            isTouchEvent: false
        });
        event_queue.push({
            type: 'mousedown',
            pageX: element_offset.x,
            pageY: element_offset.y,
            screenX: screenX,
            screenY: screenY,
            timestamp: last_timestamp + default_click_duration + 20,
            target: element,
            isTouchEvent: false
        });
        event_queue.push({
            type: 'mouseup',
            pageX: element_offset.x,
            pageY: element_offset.y,
            screenX: screenX,
            screenY: screenY,
            timestamp: last_timestamp + default_click_duration * 2,
            target: element,
            isTouchEvent: false
        });
        event_queue.push({
            type: 'click',
            pageX: element_offset.x,
            pageY: element_offset.y,
            screenX: screenX,
            screenY: screenY,
            timestamp: last_timestamp + default_click_duration * 2 + 10,
            target: element,
            isTouchEvent: false
        });
    }

    // move screen to element with correct touch events, as in mobile or tablet browser
    function build_flick_event_queue(element, duration) {
        // calculate position of element
        const body_rect = document.body.getBoundingClientRect();
        const elem_rect = element.getBoundingClientRect();
        const y_offset = elem_rect.top - body_rect.top;
        const x_offset = elem_rect.left - body_rect.left;
        // calculate distance
        const x_distance = x_offset - mouse_position.x;
        const y_distance = y_offset - mouse_position.y;
        if (!duration) {
            duration = default_flick_duration;
        }
        event_queue.push({
            type: 'touchstart',
            pageX: mouse_position.x,
            pageY: mouse_position.y,
            screenX: mouse_position.x,
            screenY: mouse_position.y,
            timestamp: 0,
            target: element,
            isTouchEvent: true
        });
        // determine number of increments
        const increments = duration / default_interval;
        // divide number of milliseconds for duration by 20, since we want to send events every 20ish milliseconds
        for (let i = 1; i <= increments; i++) {
            const new_x_pos = Math.round(x_distance / increments * i) + mouse_position.x;
            const new_y_pos = Math.round(y_distance / increments * i) + mouse_position.y;
            event_queue.push({
                type: 'touchmove',
                pageX: new_x_pos,
                pageY: new_y_pos,
                screenX: new_x_pos,
                screenY: new_y_pos,
                timestamp: i * default_interval,
                target: element,
                isTouchEvent: true
            });
        }
        // get timestamp of last event in queue
        const last_timestamp = event_queue.length ? event_queue[event_queue.length - 1].timestamp : 0;
        event_queue.push({
            type: 'touchend',
            pageX: x_offset,
            pageY: y_offset,
            screenX: x_offset,
            screenY: y_offset,
            timestamp: last_timestamp,
            target: element,
            isTouchEvent: true
        });
    }

    // function to begin execution of events inside event_queue
    function start_processing_events() {
        setTimeout(process_event_queue, first_event_offset);
    }

    // exposed functions that can be called using virtualpointer.function_name();
    return {
        move_mouse_to_element: (element, duration) => {
            if (!element) return;
            build_mouse_movement_queue(element, duration);
            start_processing_events();
        },
        click_element: (element) => {
            if (!element) return;
            build_click_event_queue(element);
            start_processing_events();
        },
        move_to_element_and_click: (element, duration) => {
            if (!element) return;
            build_mouse_movement_queue(element, duration);
            build_click_event_queue(element);
            start_processing_events();
        },
        tap_element: (element) => {
            if (!element) return;
            build_click_event_queue(element, null, true);
            start_processing_events();
        },
        double_tap_element: (element) => {
            if (!element) return;
            build_click_event_queue(element, null, true);
            build_click_event_queue(element, 25, true);
            start_processing_events();
        },
        flick_to_element: (element, duration) => {
            if (!element) return;
            build_flick_event_queue(element, duration);
            start_processing_events();
        },
        // used for executing a serialized set of JSON events
        run_serialized_events: (events) => {
            if (!events || !Array.isArray(events)) return;
            event_queue = events;
            start_processing_events();
        }
    };
})();