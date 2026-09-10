# Database Schema

Source of truth: `server/prisma/schema.prisma`

## Models

### User
- id (String, cuid, PK)
- fullName (String)
- phone (String, unique)
- email (String?, nullable)
- password (String, hashed with bcrypt)
- avatarUrl (String?)
- verified (Boolean, default: false)
- isActive (Boolean, default: true)
- loanLevel (Int, default: 1)
- createdAt, updatedAt (timestamps)

Relations: loans, repayments, verifications, notifications

### Loan
- id (String, cuid, PK)
- userId (FK -> User)
- amount (Float)
- interestRate (Float, default: 0)
- status (enum: pending | approved | active | repaid | overdue | rejected | expired)
- purpose (String?)
- dueDate (DateTime?)
- approvedAt (DateTime?)
- approvedBy (String?)
- repaidAt (DateTime?)
- createdAt, updatedAt (timestamps)

Relations: user, repayments

### Repayment
- id (String, cuid, PK)
- loanId (FK -> Loan)
- userId (FK -> User)
- amount (Float)
- dueDate (DateTime)
- paidAt (DateTime?)
- status (enum: pending | paid | overdue)
- method (String?)
- reference (String?)
- clearedBy (String?)
- clearedAt (DateTime?)
- createdAt, updatedAt (timestamps)

Relations: loan, user

### Verification
- id (String, cuid, PK)
- userId (FK -> User)
- type (enum: selfie | ghana_card_front | ghana_card_back)
- imageUrl (String)
- status (enum: pending | approved | rejected)
- adminNote (String?)
- reviewedBy (String?)
- submittedAt, reviewedAt (timestamps)
- createdAt, updatedAt (timestamps)

Relations: user

### Admin
- id (String, cuid, PK)
- email (String, unique)
- password (String, hashed with bcrypt)
- name (String)
- role (String, default: "admin")
- isActive (Boolean, default: true)
- createdAt, updatedAt (timestamps)

### Notification
- id (String, cuid, PK)
- userId (FK -> User)
- title (String)
- message (String)
- type (String, default: "info")
- read (Boolean, default: false)
- createdAt (timestamp)

Relations: user

## Migrations

No migrations are committed to the repo. Generate the initial migration with:

```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
```