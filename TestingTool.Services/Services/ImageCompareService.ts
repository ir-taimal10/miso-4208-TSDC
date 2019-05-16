import * as  compareImages from 'resemblejs/compareImages';
import * as  fs from 'fs-extra';
import * as Path from "path";

export class ImageCompareService {

    constructor() {

    }

    public async compareImagesFromDir(beforePath, afterPath, resultPath) {
        if (!fs.existsSync(beforePath)) {
            console.log("no dir ", beforePath);
            return;
        }
        let files = fs.readdirSync(beforePath);
        for (let i = 0; i < files.length; i++) {
            let beforeFilePath = Path.join(beforePath, files[i]);
            let afterFilePath = Path.join(afterPath, files[i]);
            let resultFilePath = Path.join(resultPath, files[i]);
            const baseName = Path.basename(beforeFilePath);
            console.log('-- baseName: ', baseName);
            console.log('-- beforeFilePath: ', beforeFilePath);
            console.log('-- afterFilePath: ', afterFilePath);
            console.log('-- resultFilePath: ', resultFilePath);
            // await this.executeCompare(beforeFilePath, afterFilePath, resultFilePath);
        }
    }

    public async executeCompare(imageBefore, imageAfter, imageOutput) {
        await this.getDiff(imageBefore, imageAfter, imageOutput);
    }

    public async getDiff(input_image01, input_image02, output_image) {
        const options = {
            output: {
                errorColor: {
                    red: 255,
                    green: 0,
                    blue: 255
                },
                errorType: 'movement',
                transparency: 0.3,
                largeImageThreshold: 1200,
                useCrossOrigin: false,
                outputDiff: true
            },
            scaleToSameSize: true,
            ignore: ['nothing', 'less', 'antialiasing', 'colors', 'alpha'],
        };
        const data = await compareImages(
            await fs.readFile(input_image01),
            await fs.readFile(input_image02),
            options
        );

        await fs.writeFile(output_image, data.getBuffer());
    }

}

