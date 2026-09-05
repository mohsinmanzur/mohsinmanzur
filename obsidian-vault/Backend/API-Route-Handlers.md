# API Route Handlers

Next.js Route Handlers located under `src/app/api/`.

## Architecture
- Handlers handle incoming HTTP requests (GET, POST, etc.)
- Use the central database service (`dbService`) for all DB interactions
- Handle file upload processing to Cloudinary via `uploadToCloudinary`

## Related Backend Notes
- [[Backend-Overview]]
- [[Database-Service-Abstraction]]
- [[Cloudinary-Storage-Architecture]]
