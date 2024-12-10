const certificateService = require('../services/certificateService');
const certificates = require('../models/certificates');

exports.get = (req, res, next) => {
    if (!req.params.hashId) {
        res.status(400).json({"error": "Not found information hashId"});
    }

    certificates.findOne({ hash: req.params.hashId }).then(async (result) => {
        result["imageUrl"] = await certificateService.getCertificateImageSignedUrl(req.params.hashId);

        res.status(200).json(result);
    }).catch((error) => {
        res.status(404).json(error);
    })
};

exports.post = (req, res, next) => {
    certificates.create(req.body).then(async (result) => {     
        await certificateService.createCertificate(req.body, result.hash).then(certificate => {
            certificateService.uploadCertificate(result.hash).then(signedUrl => {
                certificates.findOneAndUpdate(
                    { hash: result.hash },
                    { imageUrl: signedUrl },
                    { new: true },
                    (error, newCertificate) => res.status(201).json(newCertificate));
            });
        });
    }).catch((error) => {
        res.status(400).json(error);
    });
}
