# Security Specification - IBN ELTAREK Tutoring Center

## 1. Data Invariants
1. A user profile document ID under `/users/{userId}` MUST strictly match the authenticated user's `request.auth.uid`.
2. Users can only update their own profile fields and cannot modify system identifiers or impersonate another user ID.
3. Access to student grades and attendance records is restricted to authenticated users (student themselves, their linked parent, or tutor/admins).
4. No unauthenticated user can read or write documents.
5. Path variables must be verified with `isValidId()`.

## 2. The "Dirty Dozen" Payloads
1. Unauthenticated write to `/users/usr_std_092` -> DENIED
2. User `userA` writing to `/users/userB` -> DENIED
3. Writing a user record with an injected 50KB string as name -> DENIED
4. Writing an invalid role (e.g. `role: "super_hacker"`) -> DENIED
5. Writing arbitrary untyped fields not in schema -> DENIED
6. Reading a private user document as an anonymous unauthenticated user -> DENIED
7. Modifying `createdAt` on an existing document to a client-fabricated timestamp -> DENIED
8. Deleting another student's grade records -> DENIED
9. Setting `score > totalScore * 10` resource poisoning -> DENIED
10. Creating attendance record without valid user ID -> DENIED
11. Injecting malicious XSS script tags into `specializationOrGrade` -> DENIED
12. Attempting a blank catch-all write to root collections -> DENIED
