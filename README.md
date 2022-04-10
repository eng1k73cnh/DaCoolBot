<div align="center">
  <h1>DaCoolBot:tm:</h1>

Miscellaneous bot made for a local server written in [TypeScript](https://www.typescriptlang.org/) and [discord.js](https://discord.js.org/)

Current build: v2.5.0

</div>

## Demo

![Discord_HK0QDyT0pa](https://user-images.githubusercontent.com/77577746/162233085-abc647ac-b70e-4d45-be41-67b4e0230ef8.gif)

## Usage

Only supports slash commands for convenience

#### `/make`: Creates a new reminder message

<details>
<summary> Options: </summary>

- `message` (string) (required): (Pastebin / Google Spreadsheets URL containing) reminder message content
  - Returns RAW Pastebin content if provided a Pastebin URL
    - Utilizes [axios](https://github.com/axios/axios)
  - Returns a screenshot of the spreadsheet if provided a Google Spreadsheets URL
    - Utilizes [capture-website](https://github.com/sindresorhus/capture-website) and [imgur](https://github.com/KenEucker/imgur)
  - Else returns the given message content
- `mention` (boolean): Mentions everyone after a message is created
  - Default output:
  ```typescript
  `@everyone DaCoolReminder is updated for ${new Date(
  	Date.now() + 7 * 3600 * 1000
  ).toLocaleString("en-US", {
  	weekday: "long",
  	month: "long",
  	day: "numeric",
  	year: "numeric"
  })}`;
  ```
- `note` (string): Mention note (not used if `mention` is false/not chosen)
  - Appends the note at the end of the mention message above (wrapped in parentheses)
  </details>

#### `/edit`: Edit an existing reminder message

<details>
<summary> Options: </summary>

- `id` (string) (required): ID of the message that needs to be edited
- `message` (string) (required): (Pastebin / Google Spreadsheets URL containing) reminder message content
  - Returns RAW Pastebin content if provided a Pastebin URL
    - Utilizes [axios](https://github.com/axios/axios)
  - Returns a screenshot of the spreadsheet if provided a Google Spreadsheets URL
    - Utilizes [capture-website](https://github.com/sindresorhus/capture-website) and [imgur](https://github.com/KenEucker/imgur)
  - Else returns the given message content
- `mention` (boolean): Mentions everyone after a message is created
  - Default output:
  ```typescript
  `@everyone DaCoolReminder is updated for ${new Date(
  	Date.now() + 7 * 3600 * 1000
  ).toLocaleString("en-US", {
  	weekday: "long",
  	month: "long",
  	day: "numeric",
  	year: "numeric"
  })}`;
  ```
- `note` (string): Mention note (not used if `mention` is false/not chosen)
  - Appends the note at the end of the mention message above (wrapped in parentheses)
  </details>

#### `/send`: Write an anonymous message (only works in the selected channel)

<details>
<summary> Options: </summary>

- `message` (string) (required): Message content
  - Sends the given message content as the bot
  </details>

#### `/set`: Set the bot's presence status

<details>
<summary> Options: </summary>

- `type` ([ActivityType](https://discord.js.org/#/docs/discord.js/stable/typedef/ActivityType)) (required): Type of the activity
- `message` (string) (required): Name of the activity
- `status` ([PresenceStatusData](https://discord.js.org/#/docs/discord.js/stable/typedef/PresenceStatusData)) (required): Bot's status
- `url` (string): Twitch/YouTube stream link
