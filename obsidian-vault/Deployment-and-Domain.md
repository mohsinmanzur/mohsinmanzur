# Deployment & Custom Domain

Documentation for project hosting, production deployment, and domain configuration.

## Hosting & Deployment
- **Platform**: [Vercel](https://vercel.com)
- **Connected Repository**: [mohsinmanzur/mohsinmanzur](https://github.com/mohsinmanzur/mohsinmanzur)
- **Production Branch**: `main` (auto-deploys on push)
- **Vercel Default URL**: [https://mohsinmanzur.vercel.app/](https://mohsinmanzur.vercel.app/)

## Custom Domain Details
- **Domain Name**: `mohsinmanzoor.tech`
- **Registrar**: [get.tech](https://get.tech/)
- **Target Platform**: Vercel

## DNS Records for Vercel
To route traffic from `get.tech` to Vercel:

| Type | Name | Value | TTL |
|---|---|---|---|
| **A** | `@` (root) | `76.76.21.21` | Automatic / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Automatic / 3600 |

## Related Notes
- [[GitHub]] - Repository details and workflow isolation
- [[Frontend-Overview]] - Production frontend build configuration
- [[Backend-Overview]] - Server-side environment variables and handlers
