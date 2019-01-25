# local-cms-server-cli
Command line tools for running and using the Local CMS Server

# Dependencies
- docker
- yarn / npm

# TL;DR - How do I get the server up and running with examples to look at?
```
yarn add @hubspot/local-cms-server-cli
yarn hs-cms-server init
yarn hs-cms-server start
```
NOTE: if this is your first starting the server, it may take a minute to pull down the
docker image. Once you see the line "Local HubL Server started, running at http://0.0.0.0:8080/"
printed to the console, navigate to that URL in your browser

# TL;DR - How do I start the server with my own portal data?
```
yarn add @hubspot/local-cms-server-cli
yarn hs-cms-server init --config --context
# (For now) manually update cli-config.yaml and server-config.yaml with appropriate values
# configs explained later on in this README
yarn hs-cms-server start
```

# Project Structure
Your project should have two directories: `context` and `designs` (These names can be configured to whatever you'd like, more on that later)
- `context` - This directory contains HubSpot entities, as well as some default stylesheets to be rendered with your templates. e.g., your `context` directory could have a `hubdb/<portalId>` directory. In your templates, you will be able to use HubL tags and functions that reference these HubDB tables.
- `designs` - This directory will contain all your HubL templates, stylesheets, js, custom modules in whatever organization you'd like. It is meant to mimic the structure of your project within the design manager UI.

# CLI
## yarn hs-cms-server start
Pulls down the latest docker image of the local cms server (unless you already have it locally), checks the current directory for `server-config.yaml` and then starts the server on `http://0.0.0.0:8080.

This will bring you to an index page with three sections:
- Template Links - straight HTML templates. These are rendered as is, so if they reference context variables from a page or blog object, those variables won't exist
- Page Links - Renders content objects (found in `context/content/<portalId>/`) with their specified template. If your template references content variables, those _will_ be rendered
- Blog Links - Renders blog listing pages (found in `context/blogs/<portalId>/`) with their specified template.

## yarn hs-cms-server init [--config] [--designs] [--context] [--all]
- The `--config` flag initializes a `cli-config.yaml` and `server-config.yaml`
- The `--context` flag initializes a `context directory. This includes default hubspot stylesheets, some generic objects to be rendered with your templates (e.g. site-settings.json), as well as some example objects that will be rendered with portal 123
- The `--designs` flag initializes a `designs` directory with some example templates, that reference some of portal 123's data in the `context` directory
- `--all` will initialize all of the above. You can also omit a flag all together for the same effect

## yarn hs-cms-server run-tasks [--tasks] [task-name-1] [task-name-2] ...
This command is used to run gulp tasks for downloading data from your portal to your project. It uses the configs specified in `cli-config.yaml`
The `--tasks` flag lists the valid tasks you can run, which are:
- `download-all` - Runs all the `download-*` tasks
- `download-blogs` - Downloads blog listing page objects, which allows you to render your templates with blog context
- `download-content` - Downloads page content, which allows you to render your templates with page context
- `download-default-modules` - Downloads the default modules for your portal, in a `.module` directory structure. e.g. Rich Text module
- `download-designs` - Uses FTP to download your designs directory
- `download-hubdb` - Downloads your hubdb tables/rows
- `download-layouts` - Downloads drag and drop layout objects, to locally render pages built in the DnD editor
- `download-resource-mappings` - Downloads a mapping file of resource ID -> file location in the design manager. This is needed for HubL functions that reference resources by their ID.

# Configs
## server-config.yaml
- portalId: the portal you are working with
- contextBaseDir: the relative path to your `context` dir
- templateBaseDir: the relative path to your `designs` dir

You shouldn't need to worry about the other properties in that file

## cli-config.yaml
This config is used for the `run-tasks` command described above. Here you can specify your `hapikey` (for connecting to HubSpot APIs) and your `contextDirPath` for where you want these local entities to be stored. This should match the `contextBaseDir` in `server-config.yaml`

- `download-designs` asks for your FTP username/password, portalId, and the local output dir.
- `limit` is a property for most tasks. The hubspot APIs default limit the response to 100 objects. You can change this number by specifying the `limit` for the entity you are downloading.
