export function validateApiVersion(req, res, next) {
  const apiVersion = req.path.split('/')[2]; // Extract version from /api/v1/...
  
  if (!apiVersion || !apiVersion.startsWith('v')) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'API version is required',
      code: 'MISSING_API_VERSION',
      timestamp: new Date().toISOString()
    });
  }
  
  // Check if version is supported
  const supportedVersions = ['v1'];
  
  if (!supportedVersions.includes(apiVersion)) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Unsupported API version',
      code: 'UNSUPPORTED_API_VERSION',
      supportedVersions,
      timestamp: new Date().toISOString()
    });
  }
  
  // Add version to request
  req.apiVersion = apiVersion;
  
  next();
}
