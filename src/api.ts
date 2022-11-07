import axios, { AxiosResponse } from 'axios';
import config, { setConfig } from './config';
import { log, LogTypes } from './helpers';

export async function getComments(videoId: string)
{
    let totalMatched: any = [];

    const url = (
        'https://youtube.googleapis.com/youtube/v3/commentThreads' +
        '?part=snippet%2Creplies' +
        '&maxResults=100' +
        '&moderationStatus=published' +
        '&order=relevance' +
        '&textFormat=plainText' +
        '&searchTerms=%3A&textFormat=plainText' +
        '&videoId=' + videoId +
        '&key=' + config.keys.youtube
    );

    await axios.get(url).then((res: AxiosResponse) =>
    {
        const data = res.data;

        for (let i = 0; i < data.items.length; i++)
        {
            const comment = data.items[i].snippet.topLevelComment.snippet.textDisplay;
            const matched = comment.match(/(?:([0-5]?[0-9]):)?([0-5]?[0-9]):([0-5][0-9])/g);
            if (matched)
            {
                matched.forEach((match: string) =>
                {
                    totalMatched.push(match);
                });
            }
        }
    });

    if (totalMatched.length > 0)
    {
        log(LogTypes.info, `Loaded ${totalMatched.length} Timestamps`);
    } else
    {
        log(LogTypes.warning, `No Timestamps Found.`);
    }
    return totalMatched;
}

export async function setDetails(videoId: string)
{
    const url = (
        'https://youtube.googleapis.com/youtube/v3/videos' +
        '?part=snippet%2CcontentDetails%2Cstatistics' +
        '&id=' + videoId +
        '&key=' + config.keys.youtube
    );

    await axios.get(url).then((res: AxiosResponse) =>
    {
        const data = res.data.items[0];
        let cfg = config.videos[videoId];

        cfg.title = data.snippet.title;
        cfg.description = data.snippet.description;
        cfg.channelTitle = data.snippet.channelTitle;
        cfg.channelId = data.snippet.channelId;
        cfg.statistics = data.statistics;

        return setConfig(config);
    });
}