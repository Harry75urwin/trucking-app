# Missing Functionality and Issues Analysis

## Mobile App Issues

### Critical Missing Functionality

1. **No Socket.IO Integration for Real-time Messaging**
   - File: `packages/mobile/src/lib/socket*.ts` - No socket context exists
   - The mobile app lacks real-time WebSocket connection for messaging
   - Web app has full Socket.IO integration (`packages/web/lib/socket-context.tsx`) but mobile doesn't
   - Mobile chat sends messages via REST API (`apiClient.post`) instead of socket

2. **Missing Socket Dependency**
   - File: `packages/mobile/package.json` - No `socket.io-client` dependency
   - Required to enable real-time messaging features

### Screens Missing Implementation

3. **Profile Screen is Non-functional**
   - File: `packages/mobile/src/screens/profile/ProfileScreen.tsx`
   - Screen exists but likely has no functional profile editing

4. **Settings Screens are Placeholder**
   - Files: `packages/mobile/src/screens/settings/*.tsx`
   - Settings, Notifications, Security, Appearance screens exist but are likely non-functional placeholders

5. **Auth Screens Missing Full Functionality**
   - Files: `packages/mobile/src/screens/auth/*.tsx`
   - Splash/Login/Signup screens may lack proper navigation flow or validation

## Web App Issues

### Missing Pages/Components

6. **Trucker Pages Missing**
   - `pages/trucker/Bidding.tsx` - Likely incomplete or placeholder
   - `pages/trucker/Earnings.tsx` - May be stubbed
   - `pages/trucker/VehicleFormPage.tsx` - Vehicle form functionality

7. **Shared Settings Pages**
   - Settings pages imported in `App.tsx` but may not be fully connected to backend

### API Integration Issues

8. **No Socket.IO in Mobile Navigation**
   - File: `packages/mobile/src/navigation/AppNavigator.tsx:27-28`
   - Socket context doesn't exist, so real-time features unavailable on mobile

## Backend Issues

### Demo Data Not Seeded Properly

9. ** DEMO_ Constants Not Loaded in Services**
   - Services (Customer, Driver, Vehicle, Dispatch, Tracking) check `DEMO_DATA_ENABLED` but the variables `DEMO_LOAD_ASSIGNMENTS` and `DEMO_DISPATCHES` use different entity structure than what's defined in entities
   - `LoadAssignment` entity has `trailer_id` but `LoadAssignment` entity file shows it may not have this field properly mapped

### Missing Demo Data Seeding

10. **Demo Data Inconsistency**
    - File: `packages/backend/src/demo/demo-data.ts`
    - Lines 335-346: `DEMO_DISPATCHES` has `organizationId: 'org-1001'` (string) but entity expects number
    - Line 329: `DEMO_LOAD_ASSIGNMENTS` has `trailer_id` field not in entity definition

### Missing Entity Relations

11. **Entity Relations Not Properly Defined**
    - `Load` entity has `customer_id` but no foreign key relation to `Customer`
    - `Dispatch` entity has no relations to `Load`, `Driver`, `Vehicle`
    - `Vehicle` entity has no relation to `Driver`

### Missing API Endpoints

12. **No Logout Endpoint**
    - No `/auth/logout` route in `packages/backend/src/auth/auth.controller.ts`
    - JWT is stateless, but frontend should have proper session cleanup

## Authentication & Security Issues

13. **JWT Implementation Security Concerns**
    - File: `packages/backend/src/auth/auth.service.ts:196-229`
    - Custom JWT implementation using HMAC-SHA256 without proper signature verification library
    - No token refresh mechanism

14. **Password Security**
    - File: `packages/backend/src/auth/auth.service.ts:196-199`
    - Uses SHA256 hashing (not ideal for passwords, should use bcrypt/argon2)
    - No password complexity requirements

## Type Definition Issues

15. **Type Mismatch Between Entities and API**
    - Entity uses snake_case (`customer_id`, `created_at`) but API returns snake_case too
    - Frontend types use snake_case but form data may use different conventions

## UI/UX Issues

16. **Hardcoded Demo Data in Company Dashboard**
    - File: `packages/web/pages/company/Dashboard.tsx:44-68`
    - Stats and loads are hardcoded, not fetched from API

17. **No Loading States in Multiple Screens**
    - Missing skeleton loaders in various list screens

## Database Schema Issues

18. **Missing `trailer_id` in LoadAssignment Entity**
    - Entity file doesn't include `trailer_id` field referenced in demo data

## Potential Runtime Errors

19. **Null/Undefined Access Risk**
    - Mobile ChatScreen: Uses `conversation.receiverId ?? conversation.createdBy` which may cause issues if both are undefined

20. **Missing Error Boundaries for Socket**
    - No socket connection error handling in mobile app

## Recommended Fixes (Priority Order)

### High Priority
1. Add Socket.IO client to mobile app for real-time messaging
2. Fix entity definitions to match demo data structure
3. Add proper password hashing (bcrypt)
4. Add logout endpoint or proper session cleanup

### Medium Priority
5. Connect dashboard pages to actual API data
6. Implement Profile/Settings screen functionality
7. Add proper entity relations in TypeORM

### Low Priority
8. Add loading skeletons
9. Improve type consistency
10. Add input validation in forms