# communityexpress

# Start the project

##1. start Apache server (run development on localhost:80)

In httpd.conf 'documentRoot' and 'directory' should be pointed to specific project (pree/app/app_project).

##2. npm install. install development dependencies like grunt

##3. webpack options (development):

**A. for Sitelette project run from console:**

*webpack --config webpack-sitelette.config.js*

**B. for Chalkboards project run from console:**

*webpack --config webpack-chalkboards.config.js*

**C. for Pree project run from console:**

*webpack --config webpack-pree.config.js*

##4. production build:

**A. for 'sitelette' and 'chalkboards' use the next command:**

*grunt --gruntfile=Gruntfile-sitelette.js*

**B. for 'chalkboards' use:**

*grunt --gruntfile=Gruntfile-chalkboards.js*

**B. for 'pree' use:**

*grunt --gruntfile=Gruntfile-pree.js*

grunt compress all files from /dist folder to dist.zip on root level.
dist.zip send on server.
