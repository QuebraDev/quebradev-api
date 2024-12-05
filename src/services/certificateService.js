const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');
const moment = require('moment');

AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT
});

Canvas.registerFont(__dirname + '/../images/ubuntu.ttf', { family: 'ubuntu' });

const s3Client = new AWS.S3({
    endpoint: process.env.AWS_ENDPOINT,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    s3ForcePathStyle: true
});

const createCertificate = async (certificate, hash) => {    
    const params = { Bucket: process.env.BUCKET_NAME, Key: 'bases/certificado-base.png',  };

    return new Promise((resolve) => {
        s3Client.getObject(params, async (error, data) => {
            if (error) {
                console.log(error.message);
                return;
            }
            
            const canvas = Canvas.createCanvas(1600, 1194);
            let canvasContext = canvas.getContext('2d');
            const canvasImage = new Canvas.Image();
            const courseDates = getCourseDates(certificate.period.dates);

            canvasImage.src = data.Body;
            
            if (certificate.type.name == "student") {
                buildCertificateToStudent(canvasContext, canvasImage, canvas, certificate, hash, courseDates);
                canvasContext = await addSignatureToCertificate(canvasContext, certificate.course.responsibles);
            }

            if (certificate.type.name == "author" || certificate.type.name == "speaker") {
                buildCertificateToAuthorOrSpeaker(
                    canvasContext, canvasImage, canvas, 
                    certificate, hash, courseDates
                );
                canvasContext = await addSignatureToCertificate(canvasContext, certificate.course.responsibles);
            }

            if (certificate.type.name == "teacher") {
                // todo
            }
            
            const certificateOut = fs.createWriteStream(path.join(__dirname, `/../images/${hash}.png`));
            canvas.createPNGStream().pipe(certificateOut);
            certificateOut.on('finish', () => resolve(true));
        })
    });
}

const buildCertificateToTeacher = () => {
    // todo
}

const buildCertificateToAuthorOrSpeaker = (canvasContext, canvasImage, canvas, certificate, hash, courseDates) => {
    canvasContext.drawImage(canvasImage, 0, 0, canvas.width, canvas.height);

    canvasContext.fillStyle = 'black';
    canvasContext.textAlign = 'left';

    canvasContext.font = '45px Arial'
    
    if (certificate.type.name == "author") {
        canvasContext.fillText(`Certificamos que ${certificate.name} participou como pessoa autora de artigo`, 240, 420)
    } else {
        canvasContext.fillText(`Certificamos que ${certificate.name} participou como pessoa palestrante`, 240, 420)
    }
    
    canvasContext.fillText(`do ${certificate.course.name} do QuebraDev,`, 240, 475)
    canvasContext.fillText(`ministrando ${certificate.course.title},`, 240, 530)
    canvasContext.fillText(`realizado nos dias ${courseDates}`, 240, 650)
    canvasContext.fillText(`Carga Horária: ${certificate.period.totalHours} horas.`, 240, 760)

    canvasContext.font = '16px Arial'
    canvasContext.fillText(`Nº do Certificado: ${hash}`, 150, 1010)
    canvasContext.fillText(`URL do Certificado na Web: http://quebradev.com.br/certificados/${hash}`, 150, 1030)

    return canvasContext;
}

const buildCertificateToStudent = (canvasContext, canvasImage, canvas, certificate, hash, courseDates) => {
    canvasContext.drawImage(canvasImage, 0, 0, canvas.width, canvas.height);

    canvasContext.fillStyle = 'black';
    canvasContext.textAlign = 'left';

    canvasContext.font = '45px Arial'
    canvasContext.fillText(`Certificamos que ${certificate.name} participou`, 240, 420)
    canvasContext.fillText(`do ${certificate.course.name} do QuebraDev,`, 240, 475)
    canvasContext.fillText(`realizado nos dias ${courseDates}`, 240, 530)
    canvasContext.fillText(`Carga Horária: ${certificate.period.totalHours} horas.`, 240, 650)

    canvasContext.font = '30px Arial'
    canvasContext.fillText('Ministrado por:', 240, 760)

    canvasContext.font = '16px Arial'
    canvasContext.fillText(`Nº do Certificado: ${hash}`, 150, 1010)
    canvasContext.fillText(`URL do Certificado na Web: http://quebradev.com.br/certificados/${hash}`, 150, 1030)

    return canvasContext;
}

const getCourseDates = (dates) => {
    const numSort = (a, b) => a - b;

    const days = dates.map((date, counter) => {
        return moment(date.date).date();
    }).sort(numSort).join(', ').replace(/, ([^,]*)$/, ' e $1');

    const month = moment(dates[0].date).locale('pt-br').format('MMMM');
    const year = moment(dates[0].date).format('YYYY')

    return `${days} de ${month} de ${year}`;
}

const addSignatureToCertificate = async (certificateCanvas, responsibles) => {
    const params = { Bucket: process.env.BUCKET_NAME, Key: '' };
    let signaturePositionX = 240;

    responsibles = responsibles.map((responsible) => responsible.name.split(' ')[0].toLowerCase()).sort();

    for (const responsible of responsibles) {
        params.Key = `bases/${responsible}-assinatura.png`;

        await new Promise((resolve) => {
            s3Client.getObject(params, (error, data) => {
                if (error) {
                    resolve(true);
                    return;
                }

                const canvas = Canvas.createCanvas(300, 70);
                const canvasContext = canvas.getContext('2d');
                const canvasImage = new Canvas.Image();

                canvasImage.src = data.Body;

                canvasContext.clearRect(0, 0);
                canvasContext.drawImage(canvasImage, 0, 0);

                certificateCanvas.drawImage(canvasImage, signaturePositionX, 800);
                signaturePositionX += 300;

                resolve(true);
            })
        });
    }

    return certificateCanvas;
}

const uploadCertificate = (hash) => {
    const certificatePath = path.join(__dirname, `/../images/${hash}.png`);

    return new Promise((resolve) => {
        s3Client.upload({
            Bucket: process.env.BUCKET_NAME,
            Key: `certificados/${hash}.png`,
            Body: fs.readFileSync(certificatePath),
            ACL: 'public-read'
        }, function(error, data) {
            if (error) return console.log('Upload error: ', err.message);
            fs.unlink(certificatePath, () => console.log('Certificado emitido.'));
            resolve(data);
        });
    })
}

module.exports = {
    createCertificate,
    uploadCertificate
}
