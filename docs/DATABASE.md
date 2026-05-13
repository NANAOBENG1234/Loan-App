# Database Schema

## Tables

### User
- id (UUID, PK)
- email (unique)
- phone (unique)
- firstName, lastName
- password (hashed)
- dateOfBirth, gender
- avatarUrl
- verified, isActive
- role (default: "user")
- timestamps

### UserSettings
- id (UUID, PK)
- userId (FK -> User)
- notificationsEnabled
- twoFactorEnabled
- preferredLanguage

### Loan
- id (UUID, PK)
- userId (FK -> User)
- amount, interestRate, durationDays
- status (pending|active|repaid|overdue|rejected)
- purpose, dueDate, expiresAt
- approvedBy, repaidAt
- timestamps

### Repayment
- id (UUID, PK)
- loanId (FK -> Loan)
- userId (FK -> User)
- amount, dueDate, paidAt
- status (pending|paid|overdue|partial)
- reference

### Verification
- id (UUID, PK)
- userId (FK -> User)
- type (selfie|ghana_card)
- imageUrl, status
- adminNote, reviewedBy
- timestamps

### Admin
- id (UUID, PK)
- email (unique)
- password (hashed)
- name, role, isActive
- timestamps
