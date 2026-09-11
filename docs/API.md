# API Documentation

Base: `http://localhost:5000/api`

## Auth
- `POST /auth/register` - `{ fullName, phone, email?, password }`
- `POST /auth/login` - `{ phone, password }`
- `POST /auth/logout`
- `GET /auth/profile` - Auth required

## User
- `PUT /users/profile` - `{ fullName?, phone?, email? }` - Auth required. Validates Ghana phone + email format; returns 409 if phone/email already taken.
- `PUT /users/password` - `{ currentPassword, newPassword }` - Auth required. Verifies current password, re-hashes new one.
- `DELETE /users/account` - `{ password }` - Auth required. Soft-deletes the account (isActive=false). Blocked with 409 if an active/approved/pending loan exists.

## Loans
- `POST /loans/apply` - `{ amount, purpose? }` - Auth required
- `GET /loans` - Auth required
- `GET /loans/current` - Auth required
- `GET /loans/:id` - Auth required

## Payments
- `POST /payments/initiate` - `{ loanId, amount, method? }` - Auth required. `amount` must match the loan's stored due amount (principal + interest) exactly; otherwise returns 400.
- `GET /payments` - Auth required
- `GET /payments/:loanId` - Auth required

## Uploads
- `POST /uploads/verify` - Multipart `image` + `type` - Auth required

## Admin
- `POST /admin/login`
- `GET /admin/dashboard`
- `GET /admin/users`
- `PUT /admin/users/:id/level`
- `GET /admin/loans`
- `PUT /admin/loans/:id/approve`
- `PUT /admin/loans/:id/reject`
- `GET /admin/verifications`
- `PUT /admin/verifications/:id/approve`
- `PUT /admin/verifications/:id/reject`
- `GET /admin/repayments`
- `PUT /admin/repayments/:id/clear`
