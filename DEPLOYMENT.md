# SwaSathiii Deployment Guide

This guide covers deploying SwaSathiii to production environments.

## Prerequisites

- Node.js 18+ installed locally
- Git repository initialized
- Supabase account and project
- OpenAI API key (optional, for production-grade AI)
- Hosting platform account (Vercel, Netlify, Railway, etc.)

## Pre-Deployment Checklist

- [ ] All tests pass: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables configured in Supabase
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] OpenAI API key added (if using)
- [ ] Production URLs configured

## Build for Production

```bash
# Install dependencies
npm install

# Verify build
npm run build

# Output files in dist/ folder
ls -la dist/
```

**Build Output:**
- `dist/index.html` - Main HTML file (1.1 KB)
- `dist/assets/index-[hash].css` - Styles (45 KB gzipped)
- `dist/assets/index-[hash].js` - Bundle (123 KB gzipped)
- `dist/manifest.json` - PWA manifest
- `dist/sw.js` - Service worker
- `dist/favicon.svg` - App icon

**Total Size:** ~180 KB gzipped

## Platform-Specific Deployment

### 1. Vercel (Recommended)

Vercel is optimized for Vite deployments.

#### Option A: Git Integration
1. Push code to GitHub
2. Connect project: https://vercel.com/new
3. Select repository
4. Framework preset: Vite
5. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_SUPABASE_ANON_KEY`
6. Click Deploy

#### Option B: CLI Deployment
```bash
npm install -g vercel
vercel
# Follow prompts
```

**Configuration (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

```bash
# Update vite.config.ts
# export default defineConfig({
#   base: '/swasathiii/',
#   ...
# })

npm run build

# Deploy dist folder to gh-pages branch
# Or use GitHub Actions
```

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 4. Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "3000"]
EXPOSE 3000
```

**Build & Deploy:**
```bash
docker build -t swasathiii .
docker run -p 3000:3000 swasathiii
```

### 5. Traditional Server (nginx)

**nginx.conf:**
```nginx
server {
  listen 80;
  server_name swasathiii.example.com;

  root /var/www/swasathiii/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|svg|gif|png|jpg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location = /sw.js {
    expires 0;
    add_header Cache-Control "public, max-age=0";
  }
}
```

## Environment Configuration

### Production Environment Variables

Set in your hosting platform or Supabase:

```
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Supabase Edge Functions Setup

1. Deploy edge functions:
```bash
supabase functions deploy classify-waste
supabase functions deploy update-eco-impact
```

2. Set secrets:
```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

## Database Migrations

Before deployment, ensure migrations are applied:

```bash
# List migrations
supabase migration list

# Apply latest
supabase db push
```

**Required migrations:**
1. `create_scan_history` - Scan history table
2. `create_user_profiles` - User profiles and eco_impacts tables

## SSL/HTTPS

Most hosting platforms provide free SSL certificates. Ensure:
- [ ] HTTPS enabled
- [ ] Redirect HTTP → HTTPS
- [ ] Strict transport security headers

**nginx example:**
```nginx
server {
  listen 443 ssl http2;
  server_name swasathiii.example.com;
  
  ssl_certificate /etc/ssl/certs/cert.pem;
  ssl_certificate_key /etc/ssl/private/key.pem;
  
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

## Performance Optimization

### Caching Headers

Set cache headers for optimal performance:

```
# index.html - Always fetch fresh
Cache-Control: public, max-age=0

# Static assets (JS, CSS)
Cache-Control: public, max-age=31536000, immutable

# Service worker
Cache-Control: public, max-age=0
```

### CDN Setup

Use a CDN (Cloudflare, AWS CloudFront, etc.) for:
- [ ] Global static asset distribution
- [ ] Automatic gzip compression
- [ ] Image optimization
- [ ] DDoS protection

## Monitoring & Logging

### Error Tracking

Use Sentry for error monitoring:

```bash
npm install @sentry/react @sentry/tracing
```

In `main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://[key]@sentry.io/[project]",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### Analytics

Track user behavior with:
- Google Analytics
- Plausible Analytics
- Mixpanel

## Backup & Recovery

### Database Backups

Supabase provides automatic backups:
- Daily backups (7-day retention)
- Weekly backups (4-week retention)

Manual backup:
```bash
pg_dump "postgresql://[connection-string]" > backup.sql
```

### Application Backups

Keep code backups:
- Git repository history
- Tagged releases
- Build artifacts

## Scaling Considerations

As traffic grows:

1. **Database Optimization**
   - Add indexes on frequently queried columns
   - Use connection pooling
   - Implement query caching

2. **Edge Function Scaling**
   - Supabase auto-scales; no configuration needed
   - Monitor function execution time

3. **CDN Expansion**
   - Increase cache TTL for static assets
   - Enable aggressive caching on CDN

4. **Database Replicas**
   - Consider read replicas for high-traffic scenarios

## Troubleshooting

### Blank Page or 404 Errors
- Check build output: `ls -la dist/`
- Verify `index.html` exists
- Check server routing (should serve `index.html` for all routes)

### Authentication Issues
- Verify Supabase environment variables
- Check CORS configuration in Supabase
- Ensure auth tables exist in database

### API Calls Failing
- Check edge function deployment: `supabase functions list`
- Verify function logs: `supabase functions logs classify-waste`
- Confirm OpenAI API key is set

### Service Worker Issues
- Clear browser cache (Cmd+Shift+Delete)
- Check browser DevTools → Application → Service Workers
- Verify `/sw.js` is deployed

## Post-Deployment

- [ ] Test all features in production
- [ ] Verify dark mode works
- [ ] Test PWA installation
- [ ] Check performance with Lighthouse
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Create status page for users

## Continuous Deployment

### GitHub Actions Example

**.github/workflows/deploy-prod.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: npx vercel --prod --token=$VERCEL_TOKEN
```

## Support & Help

- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Deployment Checklist:** Follow all steps for production-ready deployment.
