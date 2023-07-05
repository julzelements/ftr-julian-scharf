# Clock Component

Handles time management. Publishes a logEvent every time the tick occurs. Interval is hardcoded upon initialisation.

Will not be adding queue redundancy. Only one event at a time.

Pause method will require some thought. If the pause is supposed to start midway between two ticks. Then there may need to be another property to hold that 'short tick'. Consider edge cases and clearing out events when the clock pauses.

### Methods:

- Start
- Pause
- Stop
- Clear

### Properties

- interval
- currentTick
- startTime
- drift
- fireCallback

# InputHandler

Handles user input supplied as a string.

### Methods

- handleInput
- handleNumber
- handleStateChange

### Properties

- Enum: PAUSE, RESUME, START

# Store

Simple component to keep the numbers array in a separate place. Without this, we would need the Clock to reach into the Input, or the Input to write to the clock.
The Input will write the numbers to the number store.
The Clock will read the numbers from the number store.

### Methods

- getNumbers
- addNumber

### Properties

- numbers

# FibCheck Component

Has the fibonacci check logic. Is called by the Input for each number.

### Methods

- IsFibbonaci

# Output

Prints the output of the program. Will need to be called by InputHandler (fibonacci number, PAUSE, RESUME etc). Subscribes to Alert and Log events. Different event handlers for UI or CLI app.

### Methods

- handleAlert
- handleLog

# Input

Wires up to the computer input. Only write the implementation for the CLI possibility. Should be pretty easy to wire up to a webapp as well. Has fireEvent method that will fire user input events that the InputHandler subscribes to.

### Methods

- fireEvent
