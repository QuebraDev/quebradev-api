const { createHash } = require("crypto");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Certificate = new Schema(
  {
    name: { type: String, required: true },
    birthday: Date,
    documents: {
      rg: {
        type: String,
        select: false,
        set: function (value) {
          return createHash("sha256").update(value).digest("hex");
        },
      },
      cpf: {
        type: String,
        select: false,
        set: function (value) {
          return createHash("sha256").update(value).digest("hex");
        },
      },
    },
    type: {
      name: {
        type: String,
        required: true,
        enum: ["teacher", "student", "speaker", "author"],
      },
    },
    period: {
      totalHours: { type: String, required: true },
      dates: [
        {
          date: { type: Date, required: true },
        },
      ],
    },
    course: {
      name: { type: String, required: true },
      type: { type: String },
      title: { type: String },
      responsibles: [
        {
          name: { type: String, required: true },
        },
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
    imageUrl: { type: String, default: "s3" },
    hash: {
      type: String,
      default: function () {
        return uuidv4().split("-")[0].toUpperCase();
      },
      unique: true,
    },
  },
  { collection: "certificates" },
);

const CertificateModel = mongoose.model("CertificateModel", Certificate);

module.exports = CertificateModel;
