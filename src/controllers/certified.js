const certificateService = require('../services/certificateService');
const certificates = require('../models/certificates');
const { createHash } = require("crypto");

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

exports.getValidHash = (req, res, next) => {
    if (!req.params.hashId) {
        res.status(400).json({"error": "Not found information hashId"});
    }

    certificates.findOne({ hash: req.params.hashId }).then(async (result) => {
        res.status(200).json({"certified_valid": true});
    }).catch((error) => {
        res.status(404).json(error);
    })
};

exports.getCertifiedByRG = (req, res, next) => {
    if (!req.params.rg) {
        res.status(400).json({"error": "Not found information RG"});
    }

    let rgCripted = createHash("sha256").update(req.params.rg).digest("hex")

    certificates.findOne({ documents: { rg: rgCripted } }).then(async (result) => {
        res.status(200).json({"certified_valid": true});
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
        res.status(400).json({"error": error});
    });
}
