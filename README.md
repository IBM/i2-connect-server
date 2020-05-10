
# i2 Connect Server

This project (aka *'Project Lockdown'*) is intended for anyone looking to build connectors for the *i2 Connect* extension for *i2 Analyze* and *i2 Enterprise Insight Analysis*. The goal being to make that process easier and quicker - allowing you to focus more on the area of data mapping and visual display on the chart, with less time coding.

## What is it?

At its core, the *i2 Connect Server* is a generic web server application based on [Node.js](https://nodejs.org/en/) and the [NestJS](https://nestjs.com/) framework that can be used for building, prototyping and ultimately hosting i2 connectors for *i2 Analyze* and *i2 Enterprise Insight Analysis*.  Its main features are:
1) **Plug-and-play architecture** for packaging, sharing, deploying and running connectors
2) An **SDK style approach to building connectors**, with helper classes, interface definitions of the *i2 Connect* data model, etc.
3) **Underlying connector scaffolding** to handle most of the complexities of creating a connector in a web host, including end point management and routing.
4) **In-built management** of connector settings and static resources.
5) Leverages many wonderful benefits of the **NestJS framework** (too many to mention here, and many more are still left to be added!)
6) Allows you to **build connectors that can be consumed by multiple i2 Analyze instances** that have different schemas, by providing an abstraction layer away from the notion of a fixed/single set of schema type ids.  Critical for anyone thinking about hosting a cloud based or centralized connector for multiple consumers.
7) Leverages the incredibly powerful and flexible json query and transformation library [Jsonata](https://jsonata.org/) to **remove the need to write code to map json data** recieved from APIs or data sources into *i2 Connect* compatible json.

## Getting Started

### Installing i2 Products

This guide does not specifically include the installation details of the underlying i2 products that consume connectors, i.e. *i2 Analyze*/*i2 Enterprise Insight Analysis* or *i2 Analyst's Notebook*, however they are of course mandatory pre-reqs to have a end-to-end working solution.

For more information on installing these products - please refer to the main i2 Product Knowledge Center here: https://www.ibm.com/support/knowledgecenter/SS3J58_9.0.6/com.ibm.i2.landing.doc/eia_deployment.html

### Download and install pre-reqs

Begin by downloading and installing *Node.js* from https://nodejs.org/en/. Currently supported 12.x.x (LTS version)

Now install the *NestJS* command-line interface (CLI) by running the following command.
```bash
$ npm i -g @nestjs/cli
```

### Optional but recommended tools

*Postman*: At some point during connector development you are going to be interacting with REST APIs.  Although it is possible to do all this via curl or through integration tests in your actual connector code, there is a fantastic tool called *Postman* that can be a big help. Download and install from here: https://www.postman.com/

*VSCode*: Having a good IDE for connector development, debugging, error highlighting, source control and intellsense support is critical. VSCode is certainly high up there in terms of ease-of-use and features/functions.  Not mandatory but thoroughly recommended - certainly don't attempt this with notepad.  You will thank yourself when your connector fails due to a missing comma in a json file and it tells you immediately, vs spend hours trying to find it manually in a vanilla text editing tool.

### Download and install the latest *i2 Connect Server* release

Download the most recent version of this project (the *i2 Connect Server*), by navigating to the releases tab in github https://github.com/IBM/i2-connect-server/releases.  Select the latest release and then click the 'download source code' link at the bottom of the page.

Copy the downloaded file onto your machine, and unzip/unpack.

Now navigate to the new folder where you extracted the release, and run the following command:
```bash
$ npm install
```

Depending on the speed of your internet connection you will have to wait a little while whilst npm (the Node.js package manager) downloads and installs all of the necessary packages.

### Prepare your environment

In the root folder of the installation, make a copy of the `.env.example` file and rename this to `.env`

This file contains the primary environment variables used by the application on start-up.  There is no need to change the defaults at this stage.

### Run the application server

In the root folder of the installation, run the following command:
```bash
$ npm run start
```
Check for any errors in the console, but you should hopefully see everything start-up correctly!

Now do a quick smoke test by checking the pre-packaged example connector is working but navigating to the following URLs in your browser (or in Postman, curl, etc.)

- Check server is running: `http://localhost:3700/`
- Check example connector is returning its config: `http://localhost:3700/example/config`

If you get an issues, re-trace your steps to ensure you followed all the steps above.  Also look at the console log output for any error messages.

### Adding the connector to i2 Analyze

Now the final configuration step - to access the pre-packaged example connector from Analyst's Notebook.

First, open your current i2 Analyze deployments topology file.  This is usually located at `%I2ANALYZE_HOME%/toolkit/configuration/environment/topology.xml` 

Edit the file to add a new connector to the connector-ids section as follows:

```xml
<applications>
    <application ...>
      <wars>
        <war ...>
          <connector-ids>
            ...
            <connector-id value="example-connector"/>
          </connector-ids>
        </war>
      </wars>
    </application>
</applications>
```

Also add a new connector to the connectors section:
```xml
<connectors>
    ...
    <connector base-url="http://localhost:3700/example/"
               name="Example Connector"
               id="example-connector"
               configuration-url="/config?siteid=f19d0f70-7f5c-4358-96cd-322c6367ca6a&amp;strict=true"/>
</connectors>
```

***Important Note**: to keep things simple at this stage, the pre-packaged example connector assumes that you are using the out-of-the-box i2 Analyze installation with standard security and the Law Enforcement schema.  If this isn't the case you will have to do some extra work to map to the appropriate schema type ids.*

Now to actually add this connector into the i2 Analyze deployment.

Navigate to the i2 Analyze toolkit scripts directory (usually `%I2ANALYZE_HOME%/toolkit/scripts`) and run the following commands:

```bash
$ setup -t stopLiberty
```
```bash
$ setup -t updateConnectorsConfiguration
```
```bash
$ setup -t startLiberty
```

### Test the example connector from i2 Analyst's Notebook

Open i2 Analyst's Notebook, connect and log-in to your i2 Analyze instance as normal.  From the toolbar, you should now see 'External Searches' enabled.  Click on this to bring up the i2 Connect search window, and the Example Connector should be displayed for use!

If you hit any issues, take a look at the main application log files (e.g. `%I2ANALYZE_HOME%/deploy/wlp/usr/servers/opal-server/logs/opal-services-is-daod/IBM_i2_Analysis_Repository.log`) to give a clue as to what might be at fault.  Note - exact log file location may vary depending on your i2 Analyze set-up.

## Updating type mappings for different schemas

A more in-depth guide will follow, but for now here are some basic tips to modify the example connector to work with a different *i2 Analyze* instances/schemas.

  - **siteid**: You may have noticed when you added the new connector to *i2 Analyze* that in the connector configuration url, there was a `siteid` query string parameter specified.  This is how a connector knows what types to return to particular instance of *i2 Analyze*.

    You can specify what ever site id you like as long as it is url friendly, and unique (GUIDs are recommended).  If you leave the site id blank or leave it off entirely, the server will always use the 'default'.

  - **type mappings**: Within each connector one or more type mapping files need to be defined.  At a minimum there must be at least one 'default' type mapping.  Beyond this there should be one additional type mapping file for each unique 'siteid'.  These files are usually stored within the connectors `/static/typemaps/` folder.

  - **strict mode**: In the same connector configuration url you set in the *i2 Analyze* topology file, you may have also noticed a `strict` query string parameter.  This controls whether the i2 Connect Server will enforce type mapping matches or not.  In simple terms, if set to false, the server will still send responses to *i2 Analyze* but will simply remove unmapped types from the results (avoiding errors on the *i2 Analyze* gateway).  If set to true, then all properties used by a connector MUST have a corresponding and valid type mapping defined, otherwise an error will be thrown.

Putting this together to create a custom mapping for your specific *i2 Analyze* schema:

1) Create a new unique *site id* and note this down.
2) Go to the connectors `/static/typemaps/` directory.  For the example connector the full path would be `%INSTALL_ROOT%/lib/connectors/example/static/typemaps`
3) Copy the existing default type map file, and rename it to use your new site id, i.e. `enter_site_id_here.typemap.json`
4) Open the typemap file, and for each entity/link and property returned by the connector, try and map it to entities/links in your schema.  If you can't find a match - either add the property to your local *i2 Analyze* schema via the normal method, or simply leave the schemaTypeId/schemaPropertyId blank (more on skipping properties in a moment)
5) Either restart your i2 Connect Server instance (or use the reload caches endpoint) to make sure your new type map is loaded.
6) Update/set the *site id* via the connector configuration url in the *i2 Analyze* `topology.xml` file.  Redeploy the connector using the same i2 Analyze tooklit commands as before.
7) Away you go, you should now be able to re-connect Analyst's Notebook and use the connector as normal.  If you do get errors, try changing strict mode to false (warnings will still appear in the console so you can triage).  Also check the log files in i2 Analyze itself to give more specific details on which type ids could not be matched.

***Note**: if you skip properties and leave the blank - remember to ensure you set the strict flag to false in your connector configuration url, otherwise the server will throw an error if if can't find a match in the defined typemap.*

## Caching and Reloading Caches

In order to reduce the amount of file based I/O during runtime, each connector will cache all of its static files into memory on start-up.  This includes the connector config, schema, charting schemes, type maps and transforms.

If you make any changes to these files, you will need to refresh the caches so that they will be returned in subsequent requests from i2 Analyze (or via postman, curl, etc. when you are developing).

Two options are available:
1) Simply restart your i2 Connect Server instance after modifying these files. This will ensure all caches for all connectors are reloaded in one hit.
2) Reload caches on a running server (for a specific connector).  Very useful when targetting a specific connector or when you want to make quick updates during run time. Simply issue a POST request to the `/reload` end point under your connectors context root.  So for example, to reload caches for the example connector out-of-the-box, you would call `http://localhost:3700/example/reload`

## Connector End Points

By default, each connector will auto-define a number of endpoints, that are then used by i2 Analyze:

Connector configuration:
```http
/connector_context_root/config?siteid:&strict:
```
Connector schema (if required):
```http
/connector_context_root/schema?siteid:&strict:
```
Connector charting schemes (if required):
```http
/connector_context_root/config?siteid:&strict:
```
Connector services (method_name is either `acquire` or `validate`):
```http
/connector_context_root/:service_name/:method_name?siteid:&strict:
```

## Connector Manifest

Each connector must provide a manifest file (.manifest.json) in its root folder.  This file is used by the i2 Connect Server to initialize and bootstrap the connector itself, establish any end points, and load static files and settings.

More details/specifications on manifest files coming soon, but for now you can look at those provided in the example and starter connector projects for more information.

## Helper Methods and Utilities

More documentation on these is coming soon, but for now you can look at those provided in the example and starter connector projects for more information.  Intellisense is also your friend within VSCode, and will pick up available methods and descriptions where available.

## What's Next?

Stay tuned for additional documentation and guides on how to perform other common tasks, such as creating a new connector from scratch, creating/updating type mappings, transforms. settings support and using other features of the NestJS framework.

There is also a mini-backlog formed, with the following epics:
- Security (production hardening from NestJS via helmet and other modules as well as supporting i2 Analyze security extensions with new helper methods)
- Github management and server customizations (looking at ways to better support people being able to share connectors via this github project - may mean some refactoring to the project structure)
- Full unit and e2e testing (not 100% coverage right now - needs further work!)
- Enhancements to type mapping files (being able to switch endFrom vs endTo, and supporting selected from list value maps)
- Completing support for SSL (using NestJS options)
- Completing support for custom logging (using NestJS options)
- Docker support for containerization and playing with options for cloud deployment of the server (should be cloud ready but will need some tweaks especially for additioanl environmental variables)
- Moving file/setting caches to native NestJS options, and potential for Redis or other extensions.

Feature requests, enhancements welcome - and if you also want to be a **contributor** and help evolve and build on this open source project please let us know!

## Background Reading / Knowledge

Although not essential to be an expert in these tools/technologies, it is strongly recommended to read up a little on *NestJS* fundamentals and on *Jsonata* to grasp some of the basics, as it will help when you want to achieve more complex functionality within your own connectors.  The documentation on both sites is extremely good.

For *NestJS*:
 - First section of the introduction page: https://docs.nestjs.com/
 - Understand basics of controllers: https://docs.nestjs.com/controllers
 - Understand basics of providers: https://docs.nestjs.com/providers
 - Understand basics of modules: https://docs.nestjs.com/modules

For *Jsonata*:
 - Read the overview page and watch the video: https://docs.jsonata.org/overview.html
 - Use their on-line playground for trying out some transforms https://try.jsonata.org/

## Other Useful Commands

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
