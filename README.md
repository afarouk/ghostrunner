# ghostrunner

# Start the project

##1. start Apache server (run development on localhost:80)

In httpd.conf 'documentRoot' and 'directory' should be pointed to specific project (pree/app/app_project).

##2. npm install. install development dependencies like grunt

##3. webpack options (development):

npm run dev

##4. production build:

npm run build

grunt compress all files from /dist folder to dist.zip on root level.
dist.zip send on server.
