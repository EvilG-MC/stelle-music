import { Logger } from "seyfert";
import { LogLevels, gray, italic, red, rgb24, yellow } from "seyfert/lib/common/index.js";

import { Configuration } from "./data/Configuration.js";

type ColorFunction = (text: string) => string;

/**
 *
 * Custom color function.
 * @param text The text.
 * @returns
 */
const customColor: ColorFunction = (text: string) => rgb24(text, Configuration.color.success);

/**
 *
 * Add padding to the label.
 * @param label The label.
 * @returns
 */
function addPadding(label: string): string {
    const maxLength = 6;
    const bar = "|";

    const spacesToAdd = maxLength - label.length;
    if (spacesToAdd <= 0) return bar;

    const spaces = " ".repeat(spacesToAdd);

    return spaces + bar;
}

/**
 * Formats memory usage data into a string.
 * @param data The memory usage data.
 * @returns
 */
function formatMemoryUsage(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;

    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }

    return `[RAM: ${bytes.toFixed(2)} ${units[i]}]`;
}

/**
 *
 * Send ascii text.
 * @returns
 */
export function getWatermark(): void {
    return console.info(
        customColor(`


        ███████╗████████╗███████╗██╗     ██╗     ███████╗
        ██╔════╝╚══██╔══╝██╔════╝██║     ██║     ██╔════╝
        ███████╗   ██║   █████╗  ██║     ██║     █████╗  
        ╚════██║   ██║   ██╔══╝  ██║     ██║     ██╔══╝  
        ███████║   ██║   ███████╗███████╗███████╗███████╗
        ╚══════╝   ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝
														   
		
		   ${italic(`→   ${getRandomText()}`)}
    `),
    );
}

/**
 *
 * Get a random text to make it more lively...?
 * @returns
 */
function getRandomText(): string {
    const texts = [
        "Traveling~",
        "Trailblazing with Stelle!",
        "Warp-speed help, Stelle-style!",
        "Stelle's starry aid!",
        "Galaxy-grade support!",
        "Astral assistance, Stelle touch!",
        "Stellar aid on the rail!",
        "Cosmic help from Stelle!",
        "Warp to help with Stelle!",
        "Stelle's cosmic boost!",
        "Star Rail swift support!",
        "Galaxy's best aid!",
        "Stelle's interstellar help!",
        "Light-speed support!",
        "Astral aid with Stelle!",
        "Support from the stars!",
        "Stelle's nebula assist!",
        "Celestial help, Stelle way!",
        "Galaxy express support!",
        "Stelle's space-age aid!",
        "Support across the stars!",
        "Stelle's comet-like help!",
        "Universal support, Stelle style!",
        "Honkai help, Stelle flair!",
        "Spacefaring aid from Stelle!",
        "Astral support express!",
        "Stelle's cosmic care!",
        "Support on the Honkai rails!",
        "Stelle's starship aid!",
        "Galactic help, Stelle touch!",
        "Help from the cosmos!",
    ];

    return texts[Math.floor(Math.random() * texts.length)];
}

/**
 *
 * Customize the Logger.
 * @param _this The logger itself.
 * @param level The log level.
 * @param args The log arguments.
 * @returns
 */
export function customLogger(_this: Logger, level: LogLevels, args: unknown[]): unknown[] {
    const date: Date = new Date();
    const memory: NodeJS.MemoryUsage = process.memoryUsage();

    const label: string = Logger.prefixes.get(level) ?? "UNKNOWN";
    const timeFormat: string = `[${date.toLocaleDateString()} : ${date.toLocaleTimeString()}]`;

    const emojis: Record<LogLevels, string> = {
        [LogLevels.Debug]: "🎩",
        [LogLevels.Error]: "🏮",
        [LogLevels.Info]: "📘",
        [LogLevels.Warn]: "🔰",
        [LogLevels.Fatal]: "💀",
    };

    const colors: Record<LogLevels, ColorFunction> = {
        [LogLevels.Debug]: gray,
        [LogLevels.Error]: red,
        [LogLevels.Info]: customColor,
        [LogLevels.Warn]: yellow,
        [LogLevels.Fatal]: red,
    };

    const text = `${gray(`${timeFormat}`)} ${gray(formatMemoryUsage(memory.rss))} ${emojis[level]} [${colors[level](
        label,
    )}] ${addPadding(label)}`;

    return [text, ...args];
}

Logger.customize(customLogger);
Logger.dirname = "logs";

/**
 * The logger instance.
 */
export const logger = new Logger({
    name: "[Stelle]",
    saveOnFile: true,
    active: true,
});
