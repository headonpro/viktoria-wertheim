# GitHub Secrets Setup

## Required Secrets for Deployment

The following secrets must be configured in GitHub repository settings:
**Settings → Secrets and variables → Actions**

### Required Secrets:

1. **VPS_HOST** - VPS server IP address
   - Current: `91.98.117.169`

2. **VPS_USER** - SSH user for deployment
   - Current: `root`

3. **VPS_SSH_KEY** - Private SSH key for VPS access
   - Format: Complete SSH private key including headers

4. **NEXT_PUBLIC_SUPABASE_URL** - Supabase project URL
   - Format: `https://[project-id].supabase.co`

5. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Supabase anonymous key
   - This is safe to expose in frontend but should still be in secrets

6. **SUPABASE_SERVICE_ROLE_KEY** - Supabase service role key
   - ⚠️ CRITICAL: Never expose this key publicly!

7. **EMAIL_USER** - Gmail address for sending emails
   - Format: `user@gmail.com`

8. **EMAIL_PASS** - Gmail app password
   - ⚠️ Use app-specific password, not account password
   - Generate at: https://myaccount.google.com/apppasswords

9. **ADMIN_EMAILS** - Admin email addresses
   - Format: `email1@example.com,email2@example.com`

## Security Notes

- Never commit these values to the repository
- Rotate keys regularly
- Use different keys for production and development
- Monitor usage in Supabase dashboard