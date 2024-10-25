import type { Player } from "lavalink-client";

import { join } from "node:path";
import { inspect } from "node:util";

import { type AnyContext, type DefaultLocale, extendContext } from "seyfert";
import { magicImport } from "seyfert/lib/common/index.js";

/**
 * Stelle custom context.
 */
export const customContext = extendContext((interaction) => ({
    /**
     *
     * Get the locale from the database.
     * @returns
     */
    getLocale: async (): Promise<DefaultLocale> =>
        interaction.client.t(await interaction.client.database.getLocale(interaction.guildId!)).get(),
}));

/**
 *
 * Stelle custom runtime configuration.
 * @returns
 */
export const stelleRC = async (): Promise<any> => {
    const { locations, debug, ...env } = await magicImport(join(process.cwd(), "seyfert.config.js")).then((x) => x.default ?? x);
    return {
        ...env,
        debug: !!debug,
        lavalink: join(process.cwd(), locations.output, locations.lavalink),
        templates: locations.templates ? join(process.cwd(), locations.base, locations.templates) : undefined,
        langs: locations.langs ? join(process.cwd(), locations.output, locations.langs) : undefined,
        events: locations.events ? join(process.cwd(), locations.output, locations.events) : undefined,
        components: locations.components ? join(process.cwd(), locations.output, locations.components) : undefined,
        commands: locations.commands ? join(process.cwd(), locations.output, locations.commands) : undefined,
    };
};

/**
 *
 * Create and Get the cooldown collection key.
 * @param ctx
 * @returns
 */
export const getCollectionKey = (ctx: AnyContext): string => {
    const authorId = ctx.author.id;

    if (ctx.isChat() || ctx.isMenu()) return `${authorId}-${ctx.fullCommandName}-command`;
    if (ctx.isComponent() || ctx.isModal()) return `${authorId}-${ctx.customId}-component`;

    return `${authorId}-all`;
};

/**
 *
 * Create a new progress bar.
 * @param player
 * @returns
 */
export const createBar = (player: Player) => {
    const size = 15;
    const line = "▬";
    const slider = "🔘";

    if (!player.queue.current) return `${slider}${line.repeat(size - 1)}]`;

    const current = player.queue.current.info.duration !== 0 ? player.position : player.queue.current.info.duration;
    const total = player.queue.current.info.duration;

    const bar =
        current > total
            ? [line.repeat((size / 2) * 2), (current / total) * 100]
            : [
                  line.repeat(Math.round((size / 2) * (current / total))).replace(/.$/, slider) +
                      line.repeat(size - Math.round(size * (current / total)) + 1),

                  current / total,
              ];

    if (!String(bar).includes(slider)) return `${slider}${line.repeat(size - 1)}`;

    return `${bar[0]}`;
};

/**
 *
 * Check a flag in the process command.
 * @param flag
 * @returns
 */
export const getFlag = (flag: string) => process.argv.includes(flag);

/**
 *
 * Representation of a object.
 * @param error
 * @returns
 */
export const getDepth = (error: any): string => inspect(error, { depth: 0 });

/**
 *
 * Slice text.
 * @param text
 * @returns
 */
export const sliceText = (text: string, max: number = 100) => (text.length > max ? `${text.slice(0, max)}...` : text);
