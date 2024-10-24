import express, { Request as ExpressRequest } from 'express';

// Define an interface that extends the Express Request type
interface AuthenticatedRequest extends ExpressRequest {
  user: {
    attributes: {
      'custom:tenant': string;
    };
  };
}

// ... existing code ...

// Update your route handlers to use AuthenticatedRequest
router.get('/flight-sources', async (req: AuthenticatedRequest, res) => {
  const tenantId = req.user.attributes['custom:tenant'];
  // ... rest of the route handler
});

router.post('/flight-sources', async (req: AuthenticatedRequest, res) => {
  // ... existing code ...
  const newFlightSource = new FlightSource({
    // ... other properties ...
    tenantId: req.user.attributes['custom:tenant'],
  });
  // ... rest of the route handler
});

// ... existing code ...