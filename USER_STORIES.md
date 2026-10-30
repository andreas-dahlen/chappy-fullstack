# Chappy — User Stories

> **Purpose:** This file is the working backlog for Chappy. Stories are ordered from highest to lowest priority; we can change the order as the project evolves.
>
> **Workflow:** Complete one vertical slice at a time: understand the story, plan the implementation, build the relevant backend and frontend parts, style it, test it, review it, and commit it.
>
> **Status key:** `Not started` · `In progress` · `Blocked` · `Done`

## Priority Backlog

The order below is provisional. The first goal is a small, deployed application, followed by the required Grade G functionality. VG and optional enhancements come afterwards.

- [ ] **US-01 — Deploy a minimal version of Chappy** · Must have · Not started
- [ ] **US-02 — Browse users** · Must have · Not started
- [ ] **US-03 — Browse channels** · Must have · Not started
- [ ] **US-04 — Register an account** · Must have · Not started
- [ ] **US-05 — Log in** · Must have · Not started
- [ ] **US-06 — Log out** · Must have · Not started
- [ ] **US-07 — Read messages in open channels** · Must have · Not started
- [ ] **US-08 — Send messages in open channels** · Must have · Not started
- [ ] **US-09 — Access locked channels when logged in** · Must have · Not started
- [ ] **US-10 — Read and send messages in locked channels** · Must have · Not started
- [ ] **US-11 — Start and use direct messages** · Must have · Not started
- [ ] **US-12 — Generate an AI summary of a channel** · Must have · Not started
- [ ] **US-13 — Polish the core chat experience** · Must have · Not started
- [ ] **US-14 — Create a channel** · VG · Not started
- [ ] **US-15 — Delete a channel I created** · VG · Not started
- [ ] **US-16 — Delete my own account** · VG · Not started
- [ ] **US-17 — Improve navigation and shared frontend state** · Course requirement / supporting work · Not started
- [ ] **US-18 — Receive messages in real time** · Optional enhancement · Not started

---

## US-01 — Deploy a minimal version of Chappy

**Priority:** Must have — early milestone  
**Status:** Not started

**Story**

As a visitor, I want to open Chappy through a public URL so that I can access the application without running it locally.

**Acceptance criteria**

- [x] A minimal version of the application is accessible through a public Render URL.
- [x] The Express backend serves the built frontend in production.
- [x] The project can be built and started using the repository's documented scripts.
- [x] Environment-specific configuration is supplied through environment variables.
- [x] Secrets are not committed to the repository.
- [x] The application can be redeployed from `main` as development continues.

**Implementation tasks**

- [x] Review the existing root, backend, frontend, and shared package scripts.
- [x] Confirm the production build output and how Express serves it.
- [x] Configure the Render service and start/build commands.
- [x] Configure required environment variables in Render.
- [x] Deploy a minimal shell and verify the public URL.
- [x] Document any deployment-specific setup.

**Notes**

- This is an early deployment milestone, not the final deployment story.
- Database-backed features and the complete UI are not prerequisites for this first deployment.
- Verify the actual Render configuration against the current repository before changing scripts.

---

## US-02 — Browse users

**Priority:** Must have  
**Status:** Not started

**Story**

As a visitor, I want to see a list of registered users so that I can discover who uses Chappy.

**Acceptance criteria**

- [x] The frontend displays users retrieved from the backend.
- [x] Each user has a stable identifier internally and a suitable public display name.
- [x] Public user data does not expose passwords, password hashes, tokens, or other private authentication data.
- [x] Loading, empty, and error states are handled.
- [x] The endpoint is available to guests and authenticated users.

**Implementation tasks**

- [x] Agree on the public user response shape and shared Zod schema, if appropriate.
- [x] Implement the backend route and service/repository flow.
- [x] Query users from DynamoDB.
- [x] Fetch and render users in the frontend.
- [x] Style the user list.
- [x] Test the response shape and ensure sensitive fields are never returned.

**Notes**

- Keep public user data separate from internal persistence and authentication types.
- Confirm which fields should be visible in the UI before finalising the response schema.

---

## US-03 — Browse channels

**Priority:** Must have  
**Status:** Not started

**Story**

As a visitor, I want to see all available channels so that I can discover conversations that interest me.

**Acceptance criteria**

- [x] The frontend displays the channels retrieved from the backend.
- [x] Each channel displays its name.
- [x] Open and locked channels are visually distinguishable.
- [x] Both open and locked channels appear in the list, including for guests.
- [x] Loading, empty, and error states are handled.
- [x] The endpoint is available to guests and authenticated users.

**Implementation tasks**

- [x] Agree on the channel response shape and shared schema.
- [x] Implement the backend route and service/repository flow.
- [x] Query channels from DynamoDB.
- [x] Fetch and render the channel list in the frontend.
- [x] Style the list and distinguish open from locked channels.
- [ ] Test guest and authenticated access.

**Notes**

- Being able to see a locked channel does not grant permission to read or send its messages.
- A channel should have a stable ID, name, access setting, creator ID, and creation timestamp as appropriate to the agreed model.

---

## US-04 — Register an account

**Priority:** Must have  
**Status:** Not started

**Story**

As a guest, I want to register an account so that I can use features reserved for authenticated users.

**Acceptance criteria**

- [x] A guest can access and submit a registration form.
- [x] The backend validates registration input.
- [x] Invalid input and duplicate usernames are handled with useful errors.
- [x] Passwords are hashed before they are stored.
- [x] A successful registration creates a user in DynamoDB.
- [x] The response does not expose the password or password hash.
- [x] The frontend communicates success and failure clearly.

**Implementation tasks**

- [x] Agree on registration fields and validation rules.
- [x] Define/reuse the shared validation schema where suitable.
- [x] Implement the registration endpoint and backend logic.
- [x] Store the user using the repository layer.
- [x] Build and style the registration form.
- [x] Handle loading, validation, success, and error states.
- [x] Test valid registration, invalid input, and duplicate usernames.

**Notes**

- Use the course-required bcrypt approach for password hashing.
- Decide whether registration automatically signs the user in, or whether the user must log in separately. Keep this behaviour explicit and consistent.

---

## US-05 — Log in

**Priority:** Must have  
**Status:** Not started

**Story**

As a registered user, I want to log in so that Chappy can authenticate me and grant access to restricted features.

**Acceptance criteria**

- [x] A user can submit their login credentials.
- [x] The backend verifies the password against the stored hash.
- [x] Incorrect credentials produce a safe, useful error.
- [x] Successful login establishes an authenticated session/token using the agreed JWT/JWS approach.
- [x] The response does not expose password hashes or other sensitive data.
- [x] The frontend updates its authenticated state after success.
- [x] Authentication failures are handled without breaking the application.

**Implementation tasks**

- [x] Review the current authentication implementation and dependencies.
- [x] Confirm the intended token format, signing, verification, expiry, and secret configuration.
- [x] Implement or complete the login endpoint.
- [x] Build and style the login form.
- [x] Connect the form to the backend.
- [x] Handle loading, errors, and successful login.
- [ ] Test correct credentials, incorrect credentials, and malformed requests.

**Notes**

- Check the existing JWS/JWT code and package before deciding whether it needs changing; don't change terminology or dependencies blindly.
- Keep signing secrets in environment variables.
- Authentication is not the same as authorisation: protected endpoints must independently enforce their access rules.

---

## US-06 — Log out

**Priority:** Must have  
**Status:** Not started

**Story**

As an authenticated user, I want to log out so that my authenticated access is removed from the current client.

**Acceptance criteria**

- [ ] An authenticated user can trigger logout.
- [ ] The client clears its authentication state and any stored credentials/token according to the chosen design.
- [ ] The UI returns to its guest state.
- [ ] Restricted UI is no longer presented as available.
- [ ] The user can still browse publicly available users and channels.
- [ ] The behaviour is consistent after refreshing the page.

**Implementation tasks**

- [ ] Decide how authentication state is stored and cleared.
- [ ] Implement the logout interaction.
- [ ] Connect it to the authentication state management.
- [ ] Style the relevant control and guest state.
- [ ] Test logout and page refresh behaviour.

**Notes**

- Whether a backend logout endpoint is needed depends on the token/session strategy. For stateless tokens, clearing the client token alone does not revoke a token already issued; document the chosen behaviour.

---

## US-07 — Read messages in open channels

**Priority:** Must have  
**Status:** Not started

**Story**

As a visitor, I want to open an open channel and read its messages so that I can follow the conversation without creating an account.

**Acceptance criteria**

- [ ] A user can select an open channel from the channel list.
- [ ] The frontend loads messages belonging to that channel.
- [ ] Messages show their content and appropriate sender/time information.
- [ ] Messages are displayed in a sensible order.
- [ ] Guests and authenticated users can read messages in open channels.
- [ ] A request for an unknown channel is handled safely.
- [ ] Loading, empty, and error states are handled.
- [ ] The backend does not return messages from other channels.

**Implementation tasks**

- [ ] Agree on the message response shape and ordering.
- [ ] Implement the channel-message endpoint and repository query.
- [ ] Enforce the open-channel read rule on the backend.
- [ ] Build the channel conversation view.
- [ ] Style messages, sender information, timestamps, and empty/loading states.
- [ ] Test channel isolation and guest access.

**Notes**

- The precise endpoint and pagination strategy can be decided during implementation.
- Avoid loading all messages across all channels when only one channel is open.

---

## US-08 — Send messages in open channels

**Priority:** Must have  
**Status:** Not started

**Story**

As a visitor, I want to send a message in an open channel so that I can participate in the conversation without creating an account.

**Acceptance criteria**

- [ ] A guest can compose and send a message to an open channel.
- [ ] The backend validates the message and verifies that the target channel exists and is open.
- [ ] The backend assigns the message's timestamp and appropriate sender identity/guest representation.
- [ ] The message is persisted in DynamoDB.
- [ ] A successful send appears in the conversation.
- [ ] Empty or invalid messages are rejected.
- [ ] A guest cannot use this endpoint to send to a locked channel.
- [ ] Errors are communicated clearly and do not silently lose the draft.

**Implementation tasks**

- [ ] Decide how guest senders are represented in the message model.
- [ ] Define the input and response schema.
- [ ] Implement the send-message endpoint and persistence flow.
- [ ] Build and style the message composer and send control.
- [ ] Connect the composer to the API and update the conversation after success.
- [ ] Handle loading, errors, and validation.
- [ ] Test persistence and access restrictions.

**Notes**

- Do not trust a client-supplied sender ID or timestamp.
- Keep message persistence independent from the optional real-time delivery enhancement.

---

## US-09 — Access locked channels when logged in

**Priority:** Must have  
**Status:** Not started

**Story**

As an authenticated user, I want to access locked channels so that I can participate in conversations that require login.

**Acceptance criteria**

- [ ] An authenticated user can open any locked channel.
- [ ] A guest can still see locked channels in the channel list.
- [ ] A guest is prevented from reading messages in a locked channel.
- [ ] A guest attempting to access a locked channel receives an appropriate response and/or sign-in prompt.
- [ ] The backend checks authentication on every protected request.
- [ ] Access is not restricted to the channel creator or a special membership list.

**Implementation tasks**

- [ ] Review and complete authentication middleware.
- [ ] Apply authentication checks to locked-channel message access.
- [ ] Update frontend channel selection and guest messaging.
- [ ] Style the sign-in prompt or access-denied state.
- [ ] Test guest and authenticated access, including direct API requests.

**Notes**

- Per the assignment, every authenticated user can use every locked channel.
- Frontend checks improve the experience but do not replace backend enforcement.

---

## US-10 — Read and send messages in locked channels

**Priority:** Must have  
**Status:** Not started

**Story**

As an authenticated user, I want to read and send messages in locked channels so that I can participate in their conversations.

**Acceptance criteria**

- [ ] An authenticated user can load messages from a locked channel.
- [ ] An authenticated user can send a message to a locked channel.
- [ ] The backend verifies authentication and channel access before reading or writing.
- [ ] Messages are persisted and displayed as they are for open channels.
- [ ] Guests cannot read or send locked-channel messages, even by calling the API directly.
- [ ] Errors are handled without exposing private data.

**Implementation tasks**

- [ ] Extend/reuse the message endpoints and services for locked channels.
- [ ] Ensure access checks are enforced by the backend.
- [ ] Reuse the channel conversation UI and composer where appropriate.
- [ ] Style any authentication-related states.
- [ ] Test both allowed and denied requests.

**Notes**

- Prefer shared behaviour for open and locked channels, with access policy determining whether the request is allowed.

---

## US-11 — Start and use direct messages

**Priority:** Must have  
**Status:** Not started

**Story**

As an authenticated user, I want to start or open a direct conversation with another user so that we can exchange private messages.

**Acceptance criteria**

- [ ] An authenticated user can select another user and open a direct conversation.
- [ ] A conversation is associated with exactly two participants.
- [ ] Both participants can retrieve and send messages in the conversation.
- [ ] Only the two participants can retrieve or send messages in that conversation.
- [ ] Guests cannot create, read, or send direct messages.
- [ ] A user cannot send a direct message to themselves unless explicitly allowed by the agreed product rules.
- [ ] Messages persist and appear in a sensible order.
- [ ] The UI distinguishes direct conversations from channels.

**Implementation tasks**

- [ ] Agree on conversation identity and the DynamoDB access pattern.
- [ ] Define shared schemas for conversations and direct messages.
- [ ] Implement create-or-retrieve conversation behaviour.
- [ ] Implement listing/retrieving conversations for the current user.
- [ ] Implement reading and sending direct messages.
- [ ] Enforce participant checks in the backend.
- [ ] Build and style the conversation list and direct-message view.
- [ ] Test participant access and privacy boundaries.

**Notes**

- Do not trust participant IDs supplied by the client without validating them against the authenticated user and conversation.
- A conversation should not be duplicated every time the same two users start a DM. Decide how the participant pair maps to a stable conversation.
- Channel and direct-message persistence may share message concepts, but their access rules must remain explicit.

---

## US-12 — Generate an AI summary of a channel

**Priority:** Must have  
**Status:** Not started

**Story**

As a user, I want an AI-generated summary of a channel's conversation so that I can catch up on important information without reading every message.

**Acceptance criteria**

- [ ] A user can request a summary for the currently open channel.
- [ ] The backend obtains the relevant messages and sends appropriate context to the Gemini API.
- [ ] Access rules are enforced before channel content is sent to the AI service.
- [ ] The summary is shown in the frontend.
- [ ] Loading, empty-history, API-error, and unavailable-configuration states are handled.
- [ ] API keys remain on the server and are not exposed to the browser.
- [ ] The feature provides a useful result and does not claim to summarise messages it did not receive.

**Implementation tasks**

- [ ] Decide which messages and what maximum amount of context to summarise.
- [ ] Implement the backend summary flow using the configured Gemini API.
- [ ] Handle API errors, configuration, and reasonable request limits.
- [ ] Build the summary interaction and display.
- [ ] Style loading, result, and error states.
- [ ] Test empty history, normal summaries, and failure cases.

**Notes**

- AI integration is required for the assignment, not just an optional enhancement.
- Do not send direct-message content to a channel-summary request.
- Consider how to communicate that the summary is AI-generated.

---

## US-13 — Polish the core chat experience

**Priority:** Must have  
**Status:** Not started

**Story**

As a Chappy user, I want the main chat experience to be clear and usable so that I can browse conversations and send messages comfortably.

**Acceptance criteria**

- [ ] The main layout reflects the agreed Figma design where practical.
- [ ] Users, channels, messages, and direct conversations are visually distinguishable.
- [ ] Forms and controls have clear labels and interaction states.
- [ ] Loading, empty, validation, and error states are understandable.
- [ ] The application remains usable at the intended target screen sizes.
- [ ] The core flows work without relying on browser developer tools.

**Implementation tasks**

- [ ] Review the existing Figma designs and identify essential screens.
- [ ] Refine layout, typography, spacing, and visual hierarchy.
- [ ] Add appropriate hover, focus, disabled, and loading states.
- [ ] Check keyboard usability and accessible labels.
- [ ] Test the complete guest and authenticated flows.

**Notes**

- This story is for essential usability and visual coherence, not unlimited visual polish.
- Responsive design is listed as a level-up idea in the assignment, so prioritise the intended presentation size first and expand if time permits.

---

## US-14 — Create a channel

**Priority:** VG  
**Status:** Not started

**Story**

As an authenticated user, I want to create a channel so that I can start a conversation around a topic.

**Acceptance criteria**

- [ ] Only authenticated users can create channels.
- [ ] A user can provide a channel name and choose whether it is open or locked.
- [ ] The backend validates the input.
- [ ] The creator is recorded as the channel owner.
- [ ] The channel is persisted and appears in the channel list.
- [ ] Guests cannot create channels by calling the API directly.

**Implementation tasks**

- [ ] Define channel-creation input and validation.
- [ ] Implement the creation endpoint and repository flow.
- [ ] Derive the owner from the authenticated identity.
- [ ] Build and style the creation form.
- [ ] Update the channel list after success.
- [ ] Test validation and authorisation.

**Notes**

- The assignment marks channel creation as VG functionality.
- Confirm the intended rules for duplicate channel names during implementation.

---

## US-15 — Delete a channel I created

**Priority:** VG  
**Status:** Not started

**Story**

As an authenticated user, I want to delete a channel I created so that I can remove a channel I no longer need.

**Acceptance criteria**

- [ ] Only the creator/owner can delete the channel.
- [ ] Unauthenticated users cannot delete channels.
- [ ] The backend verifies ownership; hiding the delete button is not sufficient.
- [ ] The UI asks for confirmation before deletion.
- [ ] A successfully deleted channel no longer appears in the channel list.
- [ ] The application handles attempts to delete a missing channel or a channel owned by someone else.
- [ ] The intended handling of the channel's existing messages is defined and implemented consistently.

**Implementation tasks**

- [ ] Decide the deletion behaviour for related messages.
- [ ] Implement the delete endpoint and ownership check.
- [ ] Build and style the delete control and confirmation interaction.
- [ ] Update the channel list and active view after deletion.
- [ ] Test owner, non-owner, guest, and missing-channel cases.

**Notes**

- The assignment requires that only the user who created a channel can delete it.

---

## US-16 — Delete my own account

**Priority:** VG  
**Status:** Not started

**Story**

As an authenticated user, I want to delete my own account so that I can remove my account from Chappy.

**Acceptance criteria**

- [ ] An authenticated user can initiate deletion of their own account.
- [ ] The backend identifies the account from the authenticated identity.
- [ ] A user cannot delete another user's account by changing a request parameter.
- [ ] The UI requires confirmation.
- [ ] The application handles the user's channels, messages, and direct conversations according to a documented deletion policy.
- [ ] After successful deletion, the user is logged out and cannot continue using the deleted account.
- [ ] Guests cannot delete accounts.

**Implementation tasks**

- [ ] Define the account-deletion policy for owned channels, messages, and conversations.
- [ ] Implement the deletion flow and required DynamoDB operations.
- [ ] Ensure the endpoint only deletes the authenticated user's account.
- [ ] Build and style the account deletion and confirmation UI.
- [ ] Clear client authentication state after success.
- [ ] Test ownership and related-data behaviour.

**Notes**

- The assignment marks account deletion as VG functionality.
- Decide how to preserve referential consistency for messages and channels before implementing deletion.

---

## US-17 — Improve navigation and shared frontend state

**Priority:** Supporting work / course requirement  
**Status:** Not started

**Story**

As a Chappy user, I want navigation and application state to behave consistently so that I can move between channels, direct messages, and account views without losing track of where I am.

**Acceptance criteria**

- [ ] The application has a clear way to navigate between its main views.
- [ ] The current view and selected conversation are reflected consistently in the UI.
- [ ] Authentication-dependent UI updates when the user logs in or out.
- [ ] State is not duplicated unnecessarily between components.
- [ ] The app uses React Router and a state-management library as required for VG.
- [ ] State persistence is used only where it provides a clear benefit and does not accidentally preserve sensitive authentication data.

**Implementation tasks**

- [ ] Identify which views should be routes.
- [ ] Configure React Router for the required views.
- [ ] Identify shared state and decide what belongs in Zustand.
- [ ] Use Immer only where it meaningfully helps state updates.
- [ ] Decide whether persistence is needed and what may safely be persisted.
- [ ] Test navigation, refresh behaviour, and authentication-state changes.

**Notes**

- React Router and a state-management library are explicitly listed under VG.
- This story supports the rest of the application; avoid postponing necessary navigation or state work until the end.
- `zustand-persist`/persistence tooling should be verified against the installed Zustand version before being selected.

---

## US-18 — Receive messages in real time

**Priority:** Optional enhancement  
**Status:** Not started

**Story**

As a user, I want new messages to appear without manually refreshing the conversation so that I can follow discussions as they happen.

**Acceptance criteria**

- [ ] A newly sent message can be delivered to other authorised viewers of the same conversation.
- [ ] Users do not receive messages from conversations they are not authorised to access.
- [ ] The UI updates without requiring a page refresh.
- [ ] The application handles connection errors and reconnects gracefully.
- [ ] REST-based message history and sending still work if real-time delivery is unavailable.

**Implementation tasks**

- [ ] Review Socket.IO integration requirements.
- [ ] Design room membership and authorisation for channels and direct conversations.
- [ ] Implement server-side message events.
- [ ] Connect the frontend to the appropriate events.
- [ ] Ensure access checks apply to joining rooms and receiving events.
- [ ] Test channel and DM privacy boundaries, reconnects, and duplicate messages.

**Notes**

- Socket.IO is an optional level-up feature in the assignment.
- Implement only after the core REST messaging flows are working reliably.
- Real-time delivery must not bypass the access rules enforced by the backend.

---

## Cross-cutting checklist

These items apply across multiple stories and should be handled as the relevant features are implemented.

- [ ] **Validation:** Validate untrusted input on the backend; share Zod schemas where appropriate.
- [ ] **Authentication:** Review token signing, verification, expiry, and secret configuration.
- [ ] **Authorisation:** Enforce access rules in backend routes/services, not only in the UI.
- [ ] **Database:** Verify DynamoDB keys and query patterns support the required reads and writes.
- [ ] **Errors:** Return consistent, useful errors without leaking secrets or internal details.
- [ ] **Testing:** Test both successful and rejected requests for protected operations.
- [ ] **Environment:** Keep credentials and API keys in environment variables.
- [ ] **Deployment:** Keep `main` deployable and verify production behaviour as features are added.
- [ ] **Documentation:** Keep the README and submission instructions current.
- [ ] **Course process:** Arrange regular classmate code reviews and teacher check-ins.
- [ ] **Commits:** Commit each completed feature and make at least one commit on every day spent working on the project.

## Definition of Done

A story can be marked `Done` when:

- [ ] Its acceptance criteria are met.
- [ ] Relevant backend and frontend work is integrated.
- [ ] Styling and loading/error/empty states are handled where applicable.
- [ ] Relevant tests or manual verification have been completed.
- [ ] Access control and data privacy have been checked where applicable.
- [ ] The implementation has been reviewed.
- [ ] The feature has been committed.
- [ ] The backlog status is updated.
