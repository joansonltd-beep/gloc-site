# Private activity dashboard

The dashboard runs on the existing Vercel project at dashboard.joansonbjames.com. It also has a protected /dashboard route. It uses a standalone password and private Vercel Blob storage; ChatGPT is not involved in authentication or storage.

## Setup

1. Create a private Blob store connected to this project. The Blob SDK supports the connection's BLOB_STORE_ID with Vercel OIDC. A BLOB_READ_WRITE_TOKEN is an alternative, server-only credential.
2. In Vercel Project Settings, Environment Variables, add DASHBOARD_PASSWORD for Production. Choose a unique password of 12 to 256 characters and save it in your password manager. Never commit it or use a NEXT_PUBLIC prefix.
3. Deploy the updated source after configuration changes.
4. Add dashboard.joansonbjames.com to the project's Production domains. Use the exact DNS target shown by Vercel for the dashboard CNAME in Squarespace.

The page stays locked if configuration is missing. Records are stored in private blobs, never public files. Each API operation verifies a signed, eight-hour session. Sessions are bound to the hostname and become invalid after password changes. Writes require a same-origin request. Login attempts are limited per IP address using stored counters. Updates use Blob ETags and record versions to prevent lost edits.

## Recovery and backups

To reset the password without ChatGPT, sign into your Vercel account, replace DASHBOARD_PASSWORD, and redeploy. This invalidates existing sessions. Storage remains intact.

Export backup in the tracker downloads saved records as JSON. Keep exported files private. Existing records from the previous ChatGPT-hosted tracker are not automatically copied to Vercel.

## Validation

Run node tests/dashboard-model.mjs, node tests/dashboard-security.mjs, npx tsc --noEmit and npx next build. Test login and saving against the configured private store after the owner has set the production password.
