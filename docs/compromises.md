## Timer

### Drift

The timer uses node's built in `setInterval`. This makes it easy to set a recurring timer. It does lose some accuracy though. Each tick is guaranteed to run no sooner than the timeout period. It may however run a few milliseconds later.
You can see evidence of this by running the following code and observing the drift:

```
PULL THE SNIPPET FROM GITHUB
```

It could be fixed changing to `setTimout`, calculating the drift for each tick. It would also require passing a reference to the global state to the timer to keep track of each new `timerId` so that the timer can be paused and killed from the main run loop.

```js
export const startTimer = (interval: number, state: Running | Paused | Initial, callback: () => void) => {
  const start = state.startDate || Date.now();
  state.startDate = start; // set the start date if it's not set
  let expected = start + interval * 1000;

  const tick = () => {
    callback();

    const now = Date.now();
    const drift = now - expected;
    expected += interval * 1000; // next expected time
    // the next expected time will actually occur sooner than the interval by a few milliseconds

    setTimeout(tick, Math.max(0, interval * 1000 - drift)); // max is to prevent negative timeout
  };

  state.timerId = setTimeout(tick, interval * 1000); // set the next timer directly on the state
};
```

I got partway through implementing this and decided to cut scope and leave it as a TODO.

### Pause function

The current pause function is not a pause function in the strictest sense. It is more like a 'stop' and 'start'. When paused, any partial time left in the current interval is discarded. When the timer is resumed, it restarts with a full time period.

Eg:

```
>> Please input the amount of time in seconds between emitting numbers and their frequency
15 (Timer begins with 15 seconds on the clock)
halt
>> timer halted
resume (The timer restarts, disregarding any time left during the halt, and begins anew with a full 15 seconds on the clock)
>> timer resumed
```

A traditional implementation of a timer may expect the remaining interval time to be preserved and resumed. To fix this, the timer would need a global state reference. I decided to leave this out in the interest of keeping the app simpler.

## Testing

e2e tests arent' perfect.
CLI testing is hard.
Needs more state change unit tests if it was production grade.

## Accuracy

The map stores the numbers as ints. If a user inputs an integer past the safe limit of javascript, it may get rounded and stored as a different int. It might be better to store the numbers as strings.
