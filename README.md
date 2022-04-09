# DaCoolBot:tm:

Discord bot made for the purpose of creating a message that all members of the same selected role can edit Currently being deployed and used in a local server

## Demo

![Discord_HK0QDyT0pa](https://user-images.githubusercontent.com/77577746/162233085-abc647ac-b70e-4d45-be41-67b4e0230ef8.gif)

## Usage

Only supports slash commands for convenience

##### `/make`: Creates a new reminder message

Options:

- `message` (type:string) (required): (Pastebin URL containing) reminder message content
- `mention` (type:boolean): Mentions everyone after a message is created
- `note` (type:string): Mention note (usless if `mention` is false/not chosen)

##### `/edit`: Edit an existing reminder message

Options:

- `id` (type:string) (required): ID of the message that needs to be edited
- `message` (type:string) (required): (Pastebin URL containing) reminder message content
- `mention` (type:boolean): Mentions everyone after a message is created
- `note` (type:string): Mention note (usless if `mention` is false/not chosen)

##### `/send`: Write an anonymous message (only works in the selected channel)

Options:

- `message` (type:string) (required): Message content
