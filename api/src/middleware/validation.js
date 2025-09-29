import { validationResult } from 'express-validator';

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid input data',
      code: 'VALIDATION_ERROR',
      details: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      })),
      timestamp: new Date().toISOString()
    });
  }
  
  next();
}
