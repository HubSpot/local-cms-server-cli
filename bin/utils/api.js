
const BLOGS_API =  'blogs/v3';
const CONTENT_API = 'content/api/v4';
const DESIGN_MANAGER_API = 'designmanager/v1';
const HUBDB_API = 'hubdb/api/v2';

function getApiUrl(path, options = { env: 'PROD' }) {
  const { env } = options;
  const host = env === 'PROD' ? 'api.hubapi.com' : 'api.hubapiqa.com';
  return `https://${host}/${path}`;
}

module.exports = {
  BLOGS_API,
  CONTENT_API,
  DESIGN_MANAGER_API,
  HUBDB_API,
  getApiUrl,
};
