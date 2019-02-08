const BlogTask = require('./tasks/blog_download').BlogTask;
const ContentTask = require('./tasks/content_download').ContentTask;
const DefaultModulesTask = require('./tasks/default_module_download').DefaultModulesTask;
const DesignsFtpTask = require('./tasks/download_ftp_designs').DesignsFtpTask;
const gulp = require('gulp');
const HubDbTask = require('./tasks/hubdb_download').HubDbTask;
const LayoutTask = require('./tasks/layout_download').LayoutTask;
const NavMenuTask = require('./tasks/nav_menu_download').NavMenuTask;
const ResourceMappingTask = require('./tasks/resource_mapping_download').ResourceMappingTask;

// Task for fetching blog listing pages
gulp.task(BlogTask.getTaskName(), async() => {
  await new BlogTask().run();
});

// Task for fetching content objects, to render HubSpot pages.
gulp.task(ContentTask.getTaskName(), async() => {
  await new ContentTask().run();
});

// Task for fetching a portals default V2 modules.
gulp.task(DefaultModulesTask.getTaskName(), async() => {
  await new DefaultModulesTask().run();
});

// Task for syncing the designs directory from HubSpot FTP
gulp.task(DesignsFtpTask.getTaskName(), async() => {
  await new DesignsFtpTask().run();
});

// Task for fetching HubDB data and storing it locally, to be read by the local HubL server.
gulp.task(HubDbTask.getTaskName(), async () => {
  await new HubDbTask().run();
});

// Task for fetching layout objects, for rendering drag and drop pages.
gulp.task(LayoutTask.getTaskName(), async() => {
  await new LayoutTask().run();
});

gulp.task(NavMenuTask.getTaskName(), async() => {
  await new NavMenuTask().run();
});

// Task for downloading mappings from extension resource IDs to their path in the design manager.
// This is used to allow the lookup of local extension resources.
gulp.task(ResourceMappingTask.getTaskName(), async() => {
  await new ResourceMappingTask().run();
});

gulp.task('download-all', gulp.series(
  BlogTask.getTaskName(),
  ContentTask.getTaskName(),
  DefaultModulesTask.getTaskName(),
  HubDbTask.getTaskName(),
  LayoutTask.getTaskName(),
  NavMenuTask.getTaskName(),
  ResourceMappingTask.getTaskName(),
  DesignsFtpTask.getTaskName()
));