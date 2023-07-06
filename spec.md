You can implement the below program however you’re most comfortable (e.g. web app, console
program, desktop app, etc). The way the system handles user interaction isn't important, but
preserving the features is. For example, if you create a website you may choose to implement
halt/resume as buttons not text inputs. We would prefer if your submission was written in
TypeScript but we will accept submissions in other languages.
The application should accept an ongoing series of user supplied numbers as inputs, and output
notifications when certain conditions are met. It should operate as follows:

1. On startup, the program will prompt the user for the number of seconds (X) between
   outputting the frequency of each number to the screen.
2. Every X seconds the program will display, in frequency descending order, the list of
   numbers and their frequency.
3. If the user enters 'halt' the timer should pause.
4. If the user enters 'resume' the timer should resume.
5. If the user enters a number that is one of the first 1000 numbers in the Fibonacci
   sequence, the system should alert "FIB"
6. If the user enters 'quit', the application should output the numbers and their frequency, a
   farewell message, and finally terminate.

Example:

```
>> Please input the amount of time in seconds between emitting numbers and their frequency
15
>> Please enter the first number
10
>> Please enter the next number
10
>> Please enter the next number
8
>> FIB
>> Please enter the next number >> 10:2, 8:1
halt
>> timer halted
resume
>> timer resumed
8
>> FIB
>> Please enter the next number
10
>> Please enter the next number
33
>> 10:3, 8:2, 33:1
>> Please enter the next number
quit
>> 10:3, 8:2, 33:1
>> Thanks for playing, press any key to exit.
```

Part 2: Changes to your application

1. You have a new requirement to implement for your application: its logic should stay
   exactly the same but it will need to have a different user interface (e.g. if you wrote a
   web app, a different UI may be a REPL).
   Please describe how you would go about implementing this new UI in your application?
   Would you need to restructure your solution in any way?

   ### Answer:

   Currently the process runs on a command line as a UI and uses 'readline' to get user input. But all of the inputs from the user are sent to the app using events. This makes decoupling the UI to something different a lot easier.

   So, lets assume that we want to run the UI in a basic html page with buttons and some simple event handlers.
   I did some research, we have a few options to handle updates from the backend and user events from the frontend.

   #### Websockets with a separate frontend and backend.

   - The backend handles the timer logic and the computations.
   - The timer fires events across the websocket connection to the frontend.
   - Event Listeners on the frontend will update the display.
   - User events like START STOP PAUSE enter number, will be sent in the same manner to the backend.
   - Event listeners on the backend will handle the user input.
     PROS:
   - Distribution. You can potentially have multiple front ends connected to the one timer. (If that is a requirement).
   - Separation of concerns. Its obvious where the user handling should go and where the calculation logic should go. It's not quite MVC. It's more Model and View with bits of the controller in both view and model.
   - Probably less work to create this model. Less rewriting and chanding of the existing app.
     CONS:
   - I have no idea what the latency would be like. It would be great on local host, but potentially awful in some situations.
   - Error handling gets more complex if you want to make sure that each tick is displayed.

   #### Single Page React App with everything in the browser.

   PROS:

   - Latency is not an issue. Everything happens right up to the node tick on the v8 engine in the users browser.
     CONS:
   - State is now a bit of a concern. What happens if the browser freezes? If they close the tab? The app will reset.
   - The current app will need more re-writing. Have to move everything over to React and make sure that it works within the component lifecycle and hooks stuff. Could be a lot simpler than I think, but I have not looked in detail.
   - Could store the start time, refresh interval and the supplied numbers in local storage and simply recommence upon refresh.
   - If you want to push out a product update, you need to get all the users to manually refresh the page? What if the new client code is incompatible with the data in local storage. This gets annoying to deploy. (User state managed by the users client).

   #### Over engineered Solution with UDP and TCP

   If you wanted, you could keep the majority of the app running in a node server process. All the timer ticks could be sent via UDP in a broadcast type situation. If a timer tick is dropped, then this could be seen as an acceptable compromise for lower latency.
   You can categorise the user input as more important. A PAUSE command needs to be acknowledged and handled, it can't be silently dropped. Thus all the user commands and the user data supplied would be sent via websockets on TCP, slower, but more reliable.
   PROS:

   - Latency is solved.
   - App remains decoupled. View and Model are separate.
     CONS:
   - Most complex solution.
   - I have no idea how to test UDP cause I've never done it before.
   - Most developers have not dealt with UDP, so it's automatically a lot less maintainable.

2. You now need to make your application “production ready”, and deploy it so that it can
   be used by customers.
   Please describe the steps you’d need to take for this to happen.

So, lets assume that we want to run the UI in a basic html page with buttons and some simple event handlers.
I did some research, we have a few options to handle updates from the backend and user events from the frontend.

#### Websockets with a separate frontend and backend.

- The backend handles the timer logic and the computations.
- The timer fires events across the websocket connection to the frontend.
- Event Listeners on the frontend will update the display.
- User events like START STOP PAUSE enter number, will be sent in the same manner to the backend.
- Event listeners on the backend will handle the user input.
  PROS:
- Distribution. You can potentially have multiple front ends connected to the one timer. (If that is a requirement).
- Separation of concerns. Its obvious where the user handling should go and where the calculation logic should go. It's not quite MVC. It's more Model and View with bits of the controller in both view and model.
- Probably less work to create this model. Less rewriting and chanding of the existing app.
  CONS:
- I have no idea what the latency would be like. It would be great on local host, but potentially awful in some situations.
- Error handling gets more complex if you want to make sure that each tick is displayed.

#### Single Page React App with everything in the browser.

PROS:

- Latency is not an issue. Everything happens right up to the node tick on the v8 engine in the users browser.
  CONS:
- State is now a bit of a concern. What happens if the browser freezes? If they close the tab? The app will reset.
- The current app will need more re-writing. Have to move everything over to React and make sure that it works within the component lifecycle and hooks stuff. Could be a lot simpler than I think, but I have not looked in detail.
- Could store the start time, refresh interval and the supplied numbers in local storage and simply recommence upon refresh.
- If you want to push out a product update, you need to get all the users to manually refresh the page? What if the new client code is incompatible with the data in local storage. This gets annoying to deploy. (User state managed by the users client).

#### Over engineered Solution with UDP and TCP

If you wanted, you could keep the majority of the app running in a node server process. All the timer ticks could be sent via UDP in a broadcast type situation. If a timer tick is dropped, then this could be seen as an acceptable compromise for lower latency.
You can categorise the user input as more important. A PAUSE command needs to be acknowledged and handled, it can't be silently dropped. Thus all the user commands and the user data supplied would be sent via websockets on TCP, slower, but more reliable.
PROS:

- Latency is solved.
- App remains decoupled. View and Model are separate.
  CONS:
- Most complex solution.
- I have no idea how to test UDP cause I've never done it before.
- Most developers have not dealt with UDP, so it's automatically a lot less maintainable.

Lets go with option 1. We will deploy the websockets solution cause it seems like the quickest to build. Then we can change it if it doesnt' meet business requirements.

## How to deploy and manage in production?

### Redesign

To support multiple users, you need to make sure a new App is initalised from a new client session. A super simple solution: The client can generate a uuid and prefix each event. When each app is initialised, it is setup with event listeners that only respond to that particular uuid prefix. We would also want to create a new timer every time we get a new 'start' event.

### Hosting

Dev, stageing and Production environemnts.
Put the whole project in a single repo. Host the frontend on S3 as a static page. Add a cloudfront configuration in front of it to make it reachable. Host the backend on ec2 or even ecs if you want to dockerise it. Configure a custom domain. spend hours fiddling around on aws making sure that everything can reach each other.
I've not hosted a websockets app before. So I would have to research how that differs from an express app, if at all. It seems that it's probably better to use an application load balancer rather than API gateway. Which makes sense, cause you are sending messages rather than REST requests.
Add a SSL Certificate and HTTPS.

### Deployment

Use github actions to deploy to the dev environment every time we merge a PR to the main branch.
Setup manual github actions to promote the build to staging and production.
I'm not sure how you would update the backend without resetting all the users sessions. But I know it can be done, just outside the scope of this exercise. You might want to have an load balancer send all the new sessions to the new version of the backend. And then when the active sessions drop below a certain level, you kill the old backend? It really depends on how mission critical it is to support long running timers.

### Testing

The repo should have a linting step and a typescript building step. All the unit tests should run in github actions.
There should be a small amount of e2e (playwright or cypress) tests that run on dev and staging. Just the critical flow of starting the app and seeing the timer update a few times should be fine. It would probably be a good idea to add a few test hook elements to the page if it makes this testing more robust. You really don't want to be doing complex element queries when trying to find something in real time.

### Monitoring

I've not ever been in charge of setting up analytics. But something like PM2 with alerts for the backend node process would be useful. I would want to keep an eye on the amount of listeners on the process. And the memory usage cause event listener apps are prone to memory leakage problems.
I might add something like sentry to the front end and back end events. And if the app crashes, I can look through the last user actionss and get ideas about why things went wrong.

3. What did you think about this coding test - is there anything you’d suggest in order to
   improve it?
