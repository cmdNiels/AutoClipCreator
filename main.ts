import fs from 'fs';
const args = process.argv.slice(2);
import config, { addVideo } from "./src/config";
import download from "./src/download";
import { addMusic, transformVideo } from "./src/ffmpeg";
import { log, LogTypes, offsetTime } from "./src/helpers";
import { getComments, setDetails } from './src/api';

function processVideo(videoId: string)
{
    return new Promise(async (resolve) =>
    {
        const dir = `./videos/${videoId}`;

        if (!config.videos[videoId])
        {
            log(LogTypes.warning, `Video with id ${videoId} not found in config.`);
            addVideo(videoId);
        }

        if (!fs.existsSync(dir))
        {
            fs.mkdirSync(dir);
        }

        if (!fs.existsSync(`${dir}/origin.mp4`))
        {
            log(LogTypes.info, `Video with id ${videoId} not downloaded. Downloading now...`);
            await download(dir, videoId);
        }

        await setDetails(videoId);

        const comments = await getComments(videoId);
        for (let i = 0; i < comments.length; i++)
        {
            const startTime = offsetTime(comments[i], 3);
            const videoName = await transformVideo(dir, startTime, 15) as string;
            const videoNameTemp = videoName + '.temp';
            console.log(videoName);
            fs.renameSync(videoName, videoNameTemp);
            await addMusic(videoNameTemp, videoName);
            fs.unlinkSync(videoNameTemp);
            log(LogTypes.info, `Completed video with id '${videoId}' at ${startTime}`);
            resolve(0);
        }
    });
}

async function init()
{
    if (config.videos)
    {
        log(LogTypes.info, 'Initializing...');
        for (let i = 0; i < Object.keys(config.videos).length; i++)
        {
            const currentId = Object.keys(config.videos)[i];
            await processVideo(currentId);
        }
    }
    else
    {
        log(LogTypes.warning, 'Invalid Config!');
    }

    log(LogTypes.info, 'Finished!');
}

if (args.length > 0)
{
    log(LogTypes.info, `First argument provided: ${args}`);
    processVideo(args[0]);
} else
{
    init();
    // log(LogTyp es.warning, `Please provide '--id' argument.`);
}