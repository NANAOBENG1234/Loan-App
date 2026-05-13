# Security

## Measures
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiry
- HTTP-only cookies for token storage
- Rate limiting on auth endpoints
- CORS configured for specific origins
- Input validation with Zod
- SQL injection prevention via Prisma (parameterized queries)
- File upload validation (type & size limits)
- Admin routes separated with dedicated middleware

## Best Practices
- Use strong JWT_SECRET (32+ chars)
- Enable HTTPS in production
- Keep dependencies updated
- Monitor failed login attempts
- Regular database backups
