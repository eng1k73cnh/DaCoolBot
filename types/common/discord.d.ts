import { Collection } from "discord.js";

declare module "discord.js" {
	export interface Client {
		commands: Collection<
			string,
			{ execute: (arg0: CommandInteraction<CacheType>) => unknown }
		>;
	}
}
