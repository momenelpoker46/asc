/*
# [Fix] Add Insert Policy for Profiles
This migration adds a new Row Level Security (RLS) policy to the `profiles` table. This policy is necessary to fix a "Database error saving new user" error that occurs during user registration.

## Query Description:
The error happens because when a new user signs up, a trigger attempts to create a corresponding entry in the `profiles` table. Without a specific `INSERT` policy, RLS blocks this action. This new policy explicitly allows a user to insert their own profile, which is exactly what the trigger needs to do. This change is safe and only permits the creation of a profile linked to the new user's own ID.

## Metadata:
- Schema-Category: ["Safe"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Affects Table: `public.profiles`
- Change: Adds a new RLS policy for `INSERT`.

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [The policy relies on `auth.uid()` to ensure a user can only create their own profile.]

## Performance Impact:
- Indexes: [No change]
- Triggers: [No change]
- Estimated Impact: [Negligible. This adds a simple check during profile creation.]
*/

create policy "Users can insert their own profile." on public.profiles
  for insert
  with check ( auth.uid() = id );
