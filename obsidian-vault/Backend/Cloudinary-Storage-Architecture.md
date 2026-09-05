# Cloudinary Storage Architecture

Asset and media management rules via Cloudinary.

## Directory Isolation Rule
All portfolio assets MUST reside under the root directory:
```
event-vendors/
```

Inside `event-vendors/`, each model is isolated in its own subdirectory:
- `event-vendors/users/`
- `event-vendors/projects/`
- `event-vendors/profiles/`
- `event-vendors/documents/`

## Helper Utilities
Located in `src/lib/cloudinary/index.ts`:
- `uploadToCloudinary(file, modelName, options)`
- `uploadBufferToCloudinary(buffer, modelName, options)`
- `deleteFromCloudinary(publicId)`
- `getCloudinaryUrl(publicId, options)`

## Related Backend Notes
- [[Backend-Overview]]
- [[API-Route-Handlers]]
