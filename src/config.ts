import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

export default config;

export function setConfig(cfg: Object)
{
    return fs.writeFileSync('./config.json', JSON.stringify(cfg));
}

export function addVideo(videoId: string)
{
    config.videos[videoId] = { "id": videoId };
    setConfig(config);
} 