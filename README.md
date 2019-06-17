# checkin-app
This is a demo app that will run guest checkins for Unloop community events. It will collect basic attendee demographics (
and eventually report on those), but mostly it is an example of the work that the Studio can complete.

## Contributing

### Branching

Unloop appreciates any and all contributions! It's probably a good idea to shoot a message over to studio@un-loop.org before
getting started on contributions, just so that we have a heads up and we can avoid stomping on each other's work. We have a production 
continous deployment against master on heroku, so we are requesting that you submit your work as a pull request against
the develop branch, which will ease the potential disruption from any incorporation of your changes.

### Scripts
In your dev environment, you can kick off the server with `npm dev` to launch a process under nodemon, whereas `npm start` will launch an unmonitored process. `npm build` will run webpack on the client-side React code.

### Debugging
There is a checked in launch.json which will enable F5 debugging on server.js in VSCode.

### Project Structure

checkin-app uses the following project structure:
* client
* components
* server

**Client**

This path is simply all of the client-side assets and code. It is served via a static router and paths directly map to url paths. Webpack will build our bundles into this path. There are some jsx files used for input to webpack that we probably shouldn't have here and may be moved at some point.

**Components**

This is all of our React components. Many of these will be moving into external packages. Under the path are the following directories:

* apps -- top-level apps that are directly mounted
* forms -- the forms (and composite components) used across the site
* HOCs -- misc HOCs
* layout -- everything concerned with site layout (drawers, popups, page template, etc)
* providers -- any react components that set React context to provide composed children with data
* tables -- all site tables and composite components used across the site
* themes -- the material-ui theme(s)
* widgets -- all the miscellaneous isolated components

**Server**

The server code. `server.js` is the entry point for the app and configures the server. `dbcontext.js` provides the amazon dynamodb and docClient objects that will be used by the unloop-database-dynamo project. This is the place to process db configuration related options.

There are two subdirectories present here:
* entity - Our database entities, which correspond directly to our dynamo documents.
* resources - Our REST resources

checkin-app currently maintains a 1-1 relationship between our REST resources and database entities. The unloop-resource-builder  expects this folder structure to be maintained. (There is currently work to decouple this). unloop-resource-builder is koa middleware that will mount a REST resource and route http actions to corresponding resource actions. The resource builder is a curried function that takes firstly, the base directory name pointing to resources/entities, secondly any middleware to invoke when routing resources and finally, the resource names to mount. Resources can be nested using the `add()` method. 

Resources are a mapping of resource methods (create, show, index, update, destroy, etc) to methods. These methods should set the result on the ctx object. The resource builder will initialize the resource with the entity, which provides database access. Resources also export a permissions object which maps actions to roles that are permitted those actions.

Entities encapsulate the database information for the collection and export the table key, range key, and schema. It also exports a `Table` which contain DB methods to perform operations for the particular entity. `Table` is a class exported from unloop-database-dynamo. Note that unloop-database-dynamo will auto-create any non-existant data and populate the table with data in the initialData export of the entity (which may be either a function returning an array or an array of data to populate). Entities also export any methods that are pertinent to a particular entity. See, for example, `hashPashword`, `validatePassword`, and `sanitizeUser` on entity/users.js.

Note also the pattern here with `sanitize`. In general, we intend to expose a `sanitize` method on entities to remove any sensitive data that should not be returned to the client. In this case, that data is the user password. unloop-database-dynamo will automatically call the `sanitize()` method for retrieval and updating (but will not sanitize input on creation). There are `unsafeGet` and `unsafeGetAll` methods provided for retrieving entities without sanitation (say, in the case of password validation).

**Authentication/Authorization**

Authentication is done by using a bcrypt hashed password. All authenticated users are given the "user" role. Otherwise, users are assigined roles by storing their roles in the roles property of their document in the DB. A user with the "super" role has all permissions.

Permissions assigned to "default" for a resource apply to all actions. A user must be authorized against *both* the default and action specific permissions that correspond to any particular request in order to be authorized. After much deliberation, all unauthorized requests are given a 403 Response (never a 401). [This argumentation](https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses/14713094#14713094) for a 403 is convincing. 

### Tests
checkin-app currently does not have unit tests (\*gasp\*). That will change. They will written in the mocha/chai/sinon stack. If you add some (thank you!), please use this stack.

### Environment

checkin-app respects NODE_ENV, and any future changes should continue to respect NODE_ENV as well. In particular, when NODE_ENV is set 
  to development, checkin-app will look for a local instance of dynamoDB at port 8000, so you will need to [
  install it locally](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html). The
  process is a pain and will required both the JRE and python to be installed. Do be sure to follow Amazon's instructions around setting 
  fake amazon credentials through aws-cli. When NODE_ENV is set to production, checkin-app will look for AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to use when connecting to AWS. Note that the remote AWS endpoint is statically set to https://dynamodb.us-west-2.amazonaws.com in the package.json.
  
  You will also need to set the envrionment variable "cryptKey". You can set this to any string. It will be used to create a symmetric key for encrypting the session cookie that will be sent to the client. 
