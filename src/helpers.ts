import chalk from "chalk";
import moment from "moment";

export enum LogTypes
{
    info,
    warning
}

function getLogType(type: LogTypes)
{
    return chalk.white(`[${getIcon(type)}]`);
}

function getIcon(type: LogTypes)
{
    switch (type)
    {
        case LogTypes.info:
            return chalk.black('i');
        case LogTypes.warning:
            return chalk.red('!');
    }
}

export function log(type: LogTypes, message: string)
{
    return console.log(getLogType(type), message);
}

export function parseTimestamp(timestamp: string)
{
    const parsed = timestamp.split(':').reverse();
    return ((+parsed[0]) | 0) + ((+parsed[1] * 60) | 0) + ((+parsed[2] * 60 * 60) | 0);
}

export function offsetTime(timestamp: string, offset: number)
{
    let o = offset;
    if (parseTimestamp(timestamp) <= offset) { o = parseTimestamp(timestamp); }
    return moment.utc((parseTimestamp(timestamp) - o) * 1000).format('HH:mm:ss');
}