# DaCoolBot:tm:

Discord bot made for the purpose of creating a message that all members of the same role can edit

## Usage
Only supports slash commands for convenience  
##### `/make`: Creates a new reminder message
Options:
* `message` (type:string) (required):  
(Pastebin URL containing) reminder message content
* `mention` (type:boolean):
Mentions everyone after a message is created
* `note` (type:string):
Mention note (usless if `mention` is false/not chosen)
##### `/edit`: Edit an existing reminder message  
Options:
* `id` (type:string) (required):  
ID of the message that needs to be edited
* `message` (type:string) (required):  
(Pastebin URL containing) reminder message content
* `mention` (type:boolean):
Mentions everyone after a message is created
* `note` (type:string):
Mention note (usless if `mention` is false/not chosen)
