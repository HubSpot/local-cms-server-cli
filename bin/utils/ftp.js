function getFtpHost(options = { env: 'PROD' }) {
  const { env } = options;
  return env === 'PROD' ? 'ftp.hubapi.com' : 'ftp.hubapiqa.com';
}

module.exports = {
  getFtpHost,
};
