// @ts-ignore
import ytdl from 'ytdl-core-muxer';
import fs from 'fs';
import { log, LogTypes } from './helpers';

export default function (dir: string, videoId: string)
{
    return new Promise(async (resolve) =>
    {
        const output = `${dir}/origin.mp4`;
        await ytdl('http://www.youtube.com/watch?v=' + videoId,
            {
                quality: 'highest'
            }
        ).pipe(fs.createWriteStream(output).on('finish', () =>
        {
            log(LogTypes.info, 'Video successfully downloaded!');
            resolve(output);
        }));
    })
}