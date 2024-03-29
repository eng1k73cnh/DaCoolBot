<div align="center">
  <h1>DaCoolBot:tm:</h1>

Miscellaneous bot made for a local server written in [TypeScript](https://www.typescriptlang.org/) and [discord.js](https://discord.js.org/)

Current build: v2.5.1

<img src="https://img.shields.io/github/deployments/eng1k73cnh/DaCoolBot/dacoolbot?label=heroku&logo=heroku&style=for-the-badge" />
  <div style="display: flex; justify-content: center;">
    <img src=https://github.com/eng1k73cnh/DaCoolBot/actions/workflows/codeql-analysis.yml/badge.svg />
    <img src=https://github.com/eng1k73cnh/DaCoolBot/actions/workflows/build.yml/badge.svg />
    <img src=https://github.com/eng1k73cnh/DaCoolBot/actions/workflows/lint.yml/badge.svg />
  </div>

</div>

## Demo

![Discord_ZZoPo3nwhJ](https://user-images.githubusercontent.com/77577746/162664062-6c89329d-3863-4c98-bb63-066eedae5a12.gif)

## Usage

Only supports slash commands for convenience

#### `/make`: Creates a new reminder message

<details>
<summary> Options: </summary>

- `message` (string) (required): (Pastebin / Google Spreadsheets URL containing) reminder message content
  - Returns RAW Pastebin content if provided a Pastebin URL
    - Utilizes [axios](https://github.com/axios/axios)
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
