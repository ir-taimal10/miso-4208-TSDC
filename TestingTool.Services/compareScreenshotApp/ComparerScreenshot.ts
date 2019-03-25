import * as  compareImages from 'resemblejs/compareImages';
import * as  fs from 'fs-extra';
import Path = require("path");
import * as serverScreenshot from "node-server-screenshot";


export class ComparerScreenshot {

    constructor() {

    }

    public async executeCompare() {
        const timeStamp = `${new Date().getTime()}`;
        const input_image01 = Path.join(__dirname, "../", `compare__${timeStamp}__before.png`);
        const input_image02 = Path.join(__dirname, "../", `compare__${timeStamp}__after.png`);
        const output_image = Path.join(__dirname, "../", `compare__${timeStamp}__result.png`);

        //await this.captureScreenshot(input_image01);
        //await this.captureScreenshot(input_image02);
        //await this.getDiff(input_image01, input_image02, output_image);

        var img_to = process.env.IMG_TO;
        var img_form = process.env.IMG_FORM;
        console.log(img_to);
        console.log(img_form);
        await this.getDiff(img_to, img_form, output_image);
    }

    public async captureScreenshot(filename) {
        return new Promise((resolve, reject) => {
            serverScreenshot.fromURL("https://ir-taimal10.github.io/miso-4208-taller-6/randomColorsApp/",
                filename,
                () => {
                    resolve(filename);
                });
        });
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

const comparer = new ComparerScreenshot();
comparer.executeCompare();