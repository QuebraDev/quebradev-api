const certificateService = require('../services/certificateService');
const certificates = require('../models/certificates');

exports.get = (req, res, next) => {
    if (!req.params.hashId) {
        res.status(400).json({"error": "Not found information hashId"});
    }

    certificates.find({ hash: req.params.hashId }).then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        res.status(404).json(error);
    })
};

exports.post = (req, res, next) => {
    certificates.create(req.body).then(async (result) => {     
        await certificateService.createCertificate(req.body, result.hash).then(certificate => {
            certificateService.uploadCertificate(result.hash).then(upload => {
                certificates.findOneAndUpdate(
                    { hash: result.hash },
                    { imageUrl: upload.Location },
                    { new: true },
                    (error, newCertificate) => res.status(201).json(newCertificate));
            });
        });
    }).catch((error) => {
        res.status(400).json(error);
    });
}