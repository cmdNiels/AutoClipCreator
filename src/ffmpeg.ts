import { spawn } from 'child_process';
import { log, LogTypes } from './helpers';

const ffmpegLocation = './ffmpeg/ffmpeg.exe';

const effectPresets = {
    backgroundBlur: 'split[original][copy];[copy]scale=-1:ih*(16/9)*(16/9),crop=w=ih*9/16,gblur=sigma=20[blurred];[blurred][original]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2',
    portraitCrop: 'crop=w=ih*9/16'
}

export async function transformVideo(dir: string, startTime: string, duration: number)
{
    log(LogTypes.info, `Processing Timestamp ${startTime}.`);
    return new Promise(async (resolve) =>
    {
        const origin = `${dir}/origin.mp4`;
        const output = `${dir}/${startTime}.mp4`.replace(/(:)/g, '-');
        const options = [
            '-y',
            '-i', `${origin}`,
            '-ss', startTime,
            '-t', `${duration.toString()}`,
            // '-vf', effectPresets.backgroundBlur,
            output
        ];

        const ffmpeg = spawn(ffmpegLocation, options);

        ffmpeg.stdout.on('data', (data: string) =>
        {
            // log(LogTypes.info, `stdout: ${data}`);
        });

        ffmpeg.stderr.on('data', (data: string) =>
        {
            // log(LogTypes.warning, `${data}`);
        });

        ffmpeg.on('close', () =>
        {
            log(LogTypes.info, `Completed Timestamp ${startTime}.`);
            resolve(output);
        });
    })
}

export async function extractAudioBytes(inputDir: string, outputDir: string)
{
    return new Promise(async (resolve) =>
    {
        const options = [
            '-y',
            '-i', inputDir,
            outputDir
        ];

        const ffmpeg = spawn(ffmpegLocation, options);

        ffmpeg.stdout.on('data', (data: string) =>
        {
            // log(LogTypes.info, `stdout: ${data}`);
        });

        ffmpeg.stderr.on('data', (data: string) =>
        {
            // log(LogTypes.warning, `${data}`);
        });

        ffmpeg.on('close', (code: number) =>
        {
            resolve(code);
        });
    });
}

export async function addMusic(inputDir: string, outputDir: string)
{
    return new Promise(async (resolve) =>
    {
        const options = [
            '-y',
            '-i', './assets/SigmaMaleSuspense.mp3',
            '-i', inputDir.replace(/(:)/g, '-'),
            '-filter_complex', '[0:a][1:a]amerge,pan=stereo|c0<c0+c2|c1<c1+c3[out]',
            '-map', '1:v?',
            '-map', '[out]',
            '-shortest',
            outputDir.replace(/(:)/g, '-')
        ];

        const ffmpeg = spawn(ffmpegLocation, options);

        ffmpeg.stdout.on('data', (data: string) =>
        {
            // log(LogTypes.info, `stdout: ${data}`);
        });

        ffmpeg.stderr.on('data', (data: string) =>
        {
            // log(LogTypes.warning, `${data}`);
        });

        ffmpeg.on('close', (code: number) =>
        {
            log(LogTypes.info, `Done adding music.`);
            resolve(code);
        });
    });
}

export async function addOverlay(inputDir: string, outputDir: string)
{
    return new Promise(async (resolve) =>
    {
        const options = [
            '-y',
            '-stream_loop', '-1',
            '-t', '15',
            '-i', './assets/MegaRamp.mp4',
            '-i', inputDir.replace(/(:)/g, '-'),
            '-filter_complex', '[1:v]scale=(610):-1[ovr],[0:v][ovr]overlay=(W-w)/2:(H-h)/20[out_v]',
            '-map', '[out_v]',
            '-map', '1:a?',
            outputDir.replace(/(:)/g, '-')
        ];

        const ffmpeg = spawn(ffmpegLocation, options);

        ffmpeg.stdout.on('data', (data: string) =>
        {
            // log(LogTypes.info, `stdout: ${data}`);
        });

        ffmpeg.stderr.on('data', (data: string) =>
        {
            // log(LogTypes.warning, `${data}`);
        });

        ffmpeg.on('close', (code: number) =>
        {
            log(LogTypes.info, `Done adding overlay.`);
            resolve(code);
        });
    });
}