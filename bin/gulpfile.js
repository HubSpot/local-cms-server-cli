const BlogTask = require('./tasks/blog_download').BlogTask;
const ContentTask = require('./tasks/content_download').ContentTask;
const DefaultModulesTask = require('./tasks/default_module_download').DefaultModulesTask;
const DesignsFtpTask = require('./tasks/download_ftp_designs').DesignsFtpTask;
const gulp = require('gulp');
const HubDbTask = require('./tasks/hubdb_download').HubDbTask;
const LayoutTask = require('./tasks/layout_download').LayoutTask;
const NavMenuTask = require('./tasks/nav_menu_download').NavMenuTask;
const ResourceMappingTask = require('./tasks/resource_mapping_download').ResourceMappingTask;

const ALL_TASKS = 'download-all';
const BLOG_TASK_NAME = 'download-blogs';
const CONTENT_TASK_NAME = 'download-content';
const DEFAULT_MODULES_TASK_NAME = 'download-default-modules';
const DOWNLOAD_DESIGNS_TASK_NAME = 'download-designs';
const HUBDB_TASK_NAME = 'download-hubdb';
const LAYOUT_TASK_NAME = 'download-layouts';
const NAV_MENU_TASK_NAME = 'download-menus';
const RESOURCE_MAPPING_TASK_NAME = 'download-resource-mappings';

// Task for fetching blog listing pages
gulp.task(BLOG_TASK_NAME, async() => {
  await new BlogTask(BLOG_TASK_NAME).run();
});

// Task for fetching content objects, to render HubSpot pages.
gulp.task(CONTENT_TASK_NAME, async() => {
  await new ContentTask(CONTENT_TASK_NAME).run();
});

// Task for fetching a portals default V2 modules.
gulp.task(DEFAULT_MODULES_TASK_NAME, async() => {
  await new DefaultModulesTask(DEFAULT_MODULES_TASK_NAME).run();
});

// Task for syncing the designs directory from HubSpot FTP
gulp.task(DOWNLOAD_DESIGNS_TASK_NAME, async() => {
  await new DesignsFtpTask(DOWNLOAD_DESIGNS_TASK_NAME).run();
});

// Task for fetching HubDB data and storing it locally, to be read by the local HubL server.
gulp.task(HUBDB_TASK_NAME, async () => {
  await new HubDbTask(HUBDB_TASK_NAME).run();
});

// Task for fetching layout objects, for rendering drag and drop pages.
gulp.task(LAYOUT_TASK_NAME, async() => {
  await new LayoutTask(LAYOUT_TASK_NAME).run();
});

gulp.task(NAV_MENU_TASK_NAME, async() => {
  await new NavMenuTask(NAV_MENU_TASK_NAME).run();
});

// Task for downloading mappings from extension resource IDs to their path in the design manager.
// This is used to allow the lookup of local extension resources.
gulp.task(RESOURCE_MAPPING_TASK_NAME, async() => {
  await new ResourceMappingTask(RESOURCE_MAPPING_TASK_NAME).run();
});

gulp.task(ALL_TASKS, gulp.series(
  BLOG_TASK_NAME,
  CONTENT_TASK_NAME,
  DEFAULT_MODULES_TASK_NAME,
  HUBDB_TASK_NAME,
  LAYOUT_TASK_NAME,
  NAV_MENU_TASK_NAME,
  RESOURCE_MAPPING_TASK_NAME,
  DOWNLOAD_DESIGNS_TASK_NAME,
));
