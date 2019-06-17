# checkin-app
This is a demo app that will run guest checkins for Unloop community events. It will collect basic attendee demographics (
and eventually report on those), but mostly it is an example of the work that the Studio can complete.

##Contributing

###Branching

Unloop appreciates any and all contributions! It's probably a good idea to shoot a message over to studio@un-loop.org before
getting started on contributions, just so that we have a heads up and we can avoid stomping on each other's work. We have a production 
continous deployment against master on heroku, so we are requesting that you submit your work as a pull request against
the develop branch, which will ease the potential disruption from any incorporation of your changes.

###Scripts
In your dev environment, you can kick off the server with `npm dev` to launch a process under nodemon, whereas `npm start` will launch an
unmonitored process. `npm build` will run webpack on the client-side React code.

###Debugging
There is a checked in launch.json which will enable F5 debugging on server.js in VSCode.

###project structure
TODO: describe project structure

###tests
checkin-app currently does not have unit test (*gasp*). That will change. They will written in the mocha/chai/sinon stack. If you add some
(thank you!), please use this stack.

###Environment

checkin-app respects NODE_ENV, and any future changes should continue to respect NODE_ENV as well. In particular, when NODE_ENV is set 
  to development, checkin-app will look for a local instance of dynamoDB at port 8000, so you will need to [
  install it locally](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html). The
  process is a pain and will required both the JRE and python to be installed. Do be sure to follow Amazon's instructions around setting 
  fake amazon credentials through aws-cli. When NODE_ENV is set to production, checkin-app will look for AWS_ACCESS_KEY_ID and WS_SECRET_ACCESS_KEY
  to use when connecting to aws. Note that the remote AWS endpoint is statically set to https://dynamodb.us-west-2.amazonaws.com in the package.json.
  
  You will also need to set the envrionment variable "cryptKey". You can set this to any string. It will be used as a symmetric key
  for encrypting the session cookie that will be sent to the client. 
