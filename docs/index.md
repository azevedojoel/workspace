# Google Workspace MCP Server Documentation

This document provides an overview of the Google Workspace MCP Server.

## Available Tools

The extension provides the following tools:

### Google Docs

- `docs_create`: Creates a new Google Doc.
- `docs_insertText`: Inserts text at the beginning of a Google Doc.
- `docs_find`: Finds Google Docs by searching for a query in their title.
- `docs_move`: Moves a document to a specified folder.
- `docs_getText`: Retrieves the text content of a Google Doc.
- `docs_appendText`: Appends text to the end of a Google Doc.
- `docs_replaceText`: Replaces all occurrences of a given text with new text in
  a Google Doc.
- `docs_extractIdFromUrl`: Extracts the document ID from a Google Workspace URL.

### Google Slides

- `slides_getText`: Retrieves the text content of a Google Slides presentation.
- `slides_find`: Finds Google Slides presentations by searching for a query.
- `slides_getMetadata`: Gets metadata about a Google Slides presentation.

### Google Sheets

- `sheets_getText`: Retrieves the content of a Google Sheets spreadsheet.
- `sheets_getRange`: Gets values from a specific range in a Google Sheets
  spreadsheet.
- `sheets_find`: Finds Google Sheets spreadsheets by searching for a query.
- `sheets_getMetadata`: Gets metadata about a Google Sheets spreadsheet.

### Google Drive

- `drive_search`: Searches for files and folders in Google Drive.
- `drive_findFolder`: Finds a folder by name in Google Drive.
- `drive_createFolder`: Creates a new folder in Google Drive.
- `drive_downloadFile`: Downloads a file from Google Drive to a local path.

### Google Calendar

- `calendar_list`: Lists all of the user's calendars.
- `calendar_createEvent`: Creates a new event in a calendar.
- `calendar_listEvents`: Lists events from a calendar.
- `calendar_getEvent`: Gets the details of a specific calendar event.
- `calendar_findFreeTime`: Finds a free time slot for multiple people to meet.
- `calendar_updateEvent`: Updates an existing event in a calendar.
- `calendar_respondToEvent`: Responds to a meeting invitation (accept, decline,
  or tentative).
- `calendar_deleteEvent`: Deletes an event from a calendar.

### Google Chat

- `chat_listSpaces`: Lists the spaces the user is a member of.
- `chat_findSpaceByName`: Finds a Google Chat space by its display name.
- `chat_sendMessage`: Sends a message to a Google Chat space.
- `chat_getMessages`: Gets messages from a Google Chat space.
- `chat_sendDm`: Sends a direct message to a user.
- `chat_findDmByEmail`: Finds a Google Chat DM space by a user's email address.
- `chat_listThreads`: Lists threads from a Google Chat space in reverse
  chronological order.
- `chat_setUpSpace`: Sets up a new Google Chat space with a display name and a
  list of members.

### Gmail

- `gmail_search`: Search for emails in Gmail using query parameters.
- `gmail_get`: Get the full content of a specific email message.
- `gmail_downloadAttachment`: Downloads an attachment from a Gmail message to a
  local file.
- `gmail_modify`: Modify a Gmail message.
- `gmail_send`: Send an email message.
- `gmail_createDraft`: Create a draft email message.
- `gmail_sendDraft`: Send a previously created draft email.
- `gmail_listLabels`: List all Gmail labels in the user's mailbox.

### Time

- `time_getCurrentDate`: Gets the current date. Returns both UTC (for API use)
  and local time (for user display), along with the timezone.
- `time_getCurrentTime`: Gets the current time. Returns both UTC (for API use)
  and local time (for user display), along with the timezone.
- `time_getTimeZone`: Gets the local timezone.

### People

- `people_getUserProfile`: Gets a user's profile information.
- `people_getMe`: Gets the profile information of the authenticated user.
- `people_getUserRelations`: Gets a user's relations (e.g., manager, spouse,
  assistant). Defaults to the authenticated user and supports filtering by
  relation type.

## Custom Commands

The extension includes several pre-configured commands for common tasks:

- `/calendar/get-schedule`: Show your schedule for today, or a specified date.
- `/calendar/clear-schedule`: Clear all events for a specific date or range by
  deleting or declining them.
- `/drive/search`: Searches Google Drive for files matching a query and displays
  their name and ID.
- `/gmail/search`: Searches for emails in Gmail matching a query and displays
  the sender, subject, and snippet.

## Release Notes

See the [Release Notes](release_notes.md) for details on new features and
changes.
