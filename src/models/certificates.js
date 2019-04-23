const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Certificate = new Schema({
    name: { type: String, required: true },
    birthday: Date,
    documents: {
        rg: { type: String, required: true, unique: true }
    },
    period: {
        totalHours: { type: String, required: true },
        dates: [
            {
                date: { type: Date, required: true }
            }
        ],
    },
    course: {
        name: { type: String, required: true },
        type: { type: String, enum: ['WorkShop', 'BootCamp'] },
        teachers: [
            {
                name: { type: String, required: true, enum: ['Miguel', 'Willian']}
            }
        ],
    },
    location: {
        name: { type: String, required: true },
        zipcode: { type: String, required: true },
        address: { type: String, required: true },
        neighboohood: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        telephone: { type: String, required: true },
        responsible: { type: String, required: true },
    },
    updated: { type: Date, default: Date.now() },
    imageUrl: { type: String, default: 's3' },
    hash: {
        type: Number,
        default : function() {
            return Math.floor(Math.random()* 9030) + 1000
        },
        unique: true
    }
});

const CertificateModel = mongoose.model('CertificateModel', Certificate);

module.exports = CertificateModel;
