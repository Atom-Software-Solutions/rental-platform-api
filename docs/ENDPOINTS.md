# Rental Management Platform REST API TODO

> API Version: `/api/v1`

API base version: `/api/v1`

---

# Phase 1 — Foundation

## Health

- [x] GET /health
- [x] GET /version

---

# Phase 2 — Authentication

## Authentication

- [x] POST /auth/register
- [x] POST /auth/login
- [x] POST /auth/logout
- [ ] POST /auth/refresh
- [ ] POST /auth/password/forgot
- [ ] POST /auth/password/reset
- [x] GET /auth/me
- [ ] PATCH /auth/me

---

# Users

- [ ] GET /users
- [ ] GET /users/:id
- [ ] POST /users
- [ ] PATCH /users/:id
- [ ] DELETE /users/:id

---

# Roles & Permissions

- [ ] GET /roles
- [ ] POST /roles
- [ ] PATCH /roles/:id
- [ ] DELETE /roles/:id
- [ ] POST /users/:id/roles
- [ ] DELETE /users/:id/roles/:roleId

---

# Landlords

- [ ] POST /landlords
- [ ] GET /landlords
- [ ] GET /landlords/:id
- [ ] PATCH /landlords/:id
- [ ] DELETE /landlords/:id

---

# KYC

- [ ] POST /landlords/:id/kyc
- [ ] GET /landlords/:id/kyc
- [ ] PATCH /landlords/:id/kyc

---

# Admin KYC

- [ ] GET /admin/kyc
- [ ] GET /admin/kyc/:id
- [ ] POST /admin/kyc/:id/approve
- [ ] POST /admin/kyc/:id/reject

---

# Properties

- [ ] POST /properties
- [ ] GET /properties
- [ ] GET /properties/:id
- [ ] PATCH /properties/:id
- [ ] DELETE /properties/:id
- [ ] POST /properties/:id/archive

---

# Units

- [ ] POST /properties/:propertyId/units
- [ ] GET /properties/:propertyId/units
- [ ] GET /units/:id
- [ ] PATCH /units/:id
- [ ] DELETE /units/:id
- [ ] POST /units/:id/archive

---

# Tenants

- [ ] POST /tenants
- [ ] GET /tenants
- [ ] GET /tenants/:id
- [ ] PATCH /tenants/:id
- [ ] DELETE /tenants/:id

---

# Tenant Invitations

- [ ] POST /tenant-invitations
- [ ] GET /tenant-invitations
- [ ] GET /tenant-invitations/:id
- [ ] POST /tenant-invitations/:id/resend
- [ ] DELETE /tenant-invitations/:id

---

# Tenancies

- [ ] POST /tenancies
- [ ] GET /tenancies
- [ ] GET /tenancies/:id
- [ ] PATCH /tenancies/:id
- [ ] POST /tenancies/:id/activate
- [ ] POST /tenancies/:id/end
- [ ] POST /tenancies/:id/transfer

---

# Tenant Dashboard

- [ ] GET /tenant/dashboard
- [ ] GET /tenant/my-unit
- [ ] GET /tenant/balance
- [ ] GET /tenant/invoices
- [ ] GET /tenant/payments
- [ ] GET /tenant/ledger

---

# Billing

## Invoices

- [ ] POST /billing/invoices/generate
- [ ] GET /billing/invoices
- [ ] GET /billing/invoices/:id
- [ ] PATCH /billing/invoices/:id
- [ ] POST /billing/invoices/:id/cancel

---

# Payments

## Mobile Money

- [ ] POST /payments/initiate
- [ ] POST /payments/webhook
- [ ] GET /payments
- [ ] GET /payments/:id
- [ ] GET /payments/:id/status

## Manual Payments

- [ ] POST /payments/manual

## Refunds

- [ ] POST /payments/:id/refund

## Corrections

- [ ] POST /payments/:id/correction

---

# Ledger

- [ ] GET /ledger
- [ ] GET /ledger/accounts
- [ ] GET /ledger/accounts/:id
- [ ] GET /ledger/transactions
- [ ] GET /ledger/transactions/:id

---

# Deposits

- [ ] POST /deposits
- [ ] GET /deposits
- [ ] GET /deposits/:id
- [ ] POST /deposits/:id/refund
- [ ] POST /deposits/:id/deduct

---

# Withdrawals

- [ ] POST /withdrawals
- [ ] GET /withdrawals
- [ ] GET /withdrawals/:id
- [ ] GET /withdrawals/:id/status

---

# Receipts

- [ ] GET /receipts
- [ ] GET /receipts/:id
- [ ] GET /receipts/:id/download
- [ ] POST /receipts/:id/resend

---

# Statements

- [ ] POST /statements
- [ ] GET /statements
- [ ] GET /statements/:id
- [ ] GET /statements/:id/download

---

# Notifications

- [ ] GET /notifications
- [ ] PATCH /notifications/:id/read
- [ ] GET /notification-templates
- [ ] PATCH /notification-templates/:id

---

# Reports

## Dashboard

- [ ] GET /dashboard/summary
- [ ] GET /dashboard/occupancy
- [ ] GET /dashboard/arrears
- [ ] GET /dashboard/payments

## Reports

- [ ] GET /reports/monthly-income
- [ ] GET /reports/tenant-ledger
- [ ] GET /reports/payments
- [ ] GET /reports/occupancy
- [ ] GET /reports/export/pdf
- [ ] GET /reports/export/excel

---

# Disputes

- [ ] POST /disputes
- [ ] GET /disputes
- [ ] GET /disputes/:id
- [ ] PATCH /disputes/:id
- [ ] POST /disputes/:id/resolve

---

# Reconciliation

- [ ] POST /reconciliation/run
- [ ] GET /reconciliation
- [ ] GET /reconciliation/:id
- [ ] GET /reconciliation/mismatches

---

# Audit Logs

- [ ] GET /audit-logs
- [ ] GET /audit-logs/:id

---

# Administration

## Users

- [ ] GET /admin/users
- [ ] GET /admin/users/:id
- [ ] PATCH /admin/users/:id
- [ ] DELETE /admin/users/:id

## Roles

- [ ] GET /admin/roles
- [ ] POST /admin/roles
- [ ] PATCH /admin/roles/:id
- [ ] DELETE /admin/roles/:id

## System Settings

- [ ] GET /admin/settings
- [ ] PATCH /admin/settings

## Fee Configuration

- [ ] GET /admin/fees
- [ ] PATCH /admin/fees

## Payment Providers

- [ ] GET /admin/payment-providers
- [ ] PATCH /admin/payment-providers

## Integration Health

- [ ] GET /admin/integrations
- [ ] GET /admin/integrations/health

---

# File Uploads

- [ ] POST /uploads/kyc
- [ ] POST /uploads/documents
- [ ] POST /uploads/statements
- [ ] DELETE /uploads/:id

---

# External Webhooks

## Mobile Money

- [ ] POST /webhooks/mtn

## SMS Provider

- [ ] POST /webhooks/sms

---

# Phase 2 Backlog

## Airtel Money

- [ ] POST /payments/airtel/initiate
- [ ] POST /payments/airtel/webhook

## USSD

- [ ] POST /ussd

## Automatic Disbursement

- [ ] POST /auto-disbursements
- [ ] PATCH /auto-disbursements/:id
- [ ] DELETE /auto-disbursements/:id

## Property Managers

- [ ] POST /agents
- [ ] GET /agents
- [ ] PATCH /agents/:id
- [ ] DELETE /agents/:id

## Subscription Plans

- [ ] GET /subscriptions/plans
- [ ] POST /subscriptions
- [ ] GET /subscriptions
- [ ] PATCH /subscriptions/:id
- [ ] POST /subscriptions/pay

---

# Progress Tracker

## Foundation
- [ ] Complete

## Authentication
- [ ] Complete

## Users & Roles
- [ ] Complete

## Landlords & KYC
- [ ] Complete

## Properties & Units
- [ ] Complete

## Tenants & Tenancies
- [ ] Complete

## Billing
- [ ] Complete

## Payments
- [ ] Complete

## Ledger
- [ ] Complete

## Withdrawals
- [ ] Complete

## Notifications
- [ ] Complete

## Reports
- [ ] Complete

## Admin
- [ ] Complete

## Reconciliation
- [ ] Complete

## Phase 2
- [ ] Complete