"use strict";

var assert = require("assert");
var fs = require("fs");
var os = require("os");
var path = require("path");
var trusted = require("../index.js");
var childProcess = require("child_process");

var DEFAULT_RESOURCES_PATH = "test/исходные";
var DEFAULT_OUT_PATH = "test/полученные";
var DEFAULT_CERTSTORE_PATH = "test/CertStore";

var compare_app = os.type() === "Windows_NT" ? "fc" : "diff";
var compare_params = os.type() === "Windows_NT" ? "" : "--strip-trailing-cr";

describe("CERTIFICATE 2012-256 with russian folder", function () {
    var cert;
    var exts;
	var certFile = "TestCrypto2012-256.cer";
	var certReq;

    before(function () {
        try {
            fs.statSync(DEFAULT_OUT_PATH).isDirectory();
        } catch (err) {
            fs.mkdirSync(DEFAULT_OUT_PATH);
        }
    });

    it("init", function () {
        var ext1;
        var ext2;
        var oid;

        cert = new trusted.pki.Certificate();
        assert.equal(cert !== null, true);
    });

    it("load", function () {
        cert.load(DEFAULT_RESOURCES_PATH + "/" + certFile);
    });

    it("import", function () {
        var icert = new trusted.pki.Certificate();
        var data = fs.readFileSync(DEFAULT_RESOURCES_PATH + "/" + certFile);
        icert.import(data, trusted.DataFormat.PEM);
        assert.equal(typeof (icert.version), "number", "Bad version value");
    });

    it("save", function () {
        cert.save(DEFAULT_OUT_PATH + "/out2012_256.cer", trusted.DataFormat.PEM);

        var cmd = `${compare_app} ${compare_params} ${path.join(DEFAULT_RESOURCES_PATH, certFile)} ${path.join(DEFAULT_OUT_PATH, "/out2012_256.cer")}`;

        try {
            childProcess.execSync(cmd);
        } catch (err) {
           throw new Error("Resource and out certificate file diff");
        }
    });

    it("params", function () {
        assert.equal(cert.version, 3, "Bad version value");
        assert.equal(typeof (cert.subjectFriendlyName), "string", "Bad subjectFriendlyName value");
        assert.equal(typeof (cert.issuerFriendlyName), "string", "Bad issuerFriendlyName value");
        assert.equal(typeof (cert.subjectName), "string", "Bad subjectName value");
        assert.equal(typeof (cert.issuerName), "string", "Bad issuerName value");
        assert.equal(typeof (cert.notAfter), "object", "Bad notAfter value");
        assert.equal(typeof (cert.notBefore), "object", "Bad notBefore value");
        assert.equal(typeof (cert.serialNumber), "string", "Bad serialNumber value");
        assert.equal(typeof (cert.thumbprint), "string", "Bad thumbprint value");
        //assert.equal(typeof (cert.type), "number", "Bad type value");
        assert.equal(typeof (cert.keyUsage), "number", "Bad keyUsage value");
        assert.equal(typeof (cert.signatureAlgorithm), "string", "Bad signatureAlgorithm value");
        assert.equal(typeof (cert.signatureDigestAlgorithm), "string", "Bad signatureDigestAlgorithm value");
        assert.equal(typeof (cert.publicKeyAlgorithm), "string", "Bad publicKeyAlgorithm value");
        assert.equal(typeof (cert.organizationName), "string", "Bad organizationName value");
        assert.equal(typeof (cert.OCSPUrls), "object", "Bad OCSPUrls value");
        assert.equal(cert.OCSPUrls.length, 1, "Bad OCSP urls length");
        assert.equal(typeof (cert.CAIssuersUrls), "object", "Bad CA Issuers value");
        assert.equal(cert.CAIssuersUrls.length, 1, "Bad CA Issuers urls length");
        //assert.equal(cert.extensions.length, 7, "Bad extensions length");
        assert.equal(typeof (cert.isSelfSigned), "boolean", "Error check self signed");
        assert.equal(typeof (cert.isCA), "boolean", "Error check CA");
    });

    it("ru", function () {
        var ruCert = trusted.pki.Certificate.load(DEFAULT_RESOURCES_PATH + "/test-ru.cer");

        assert.equal(ruCert.version, 3, "Bad version value");
        assert.equal(typeof (ruCert.subjectFriendlyName), "string", "Bad subjectFriendlyName value");
        assert.equal(typeof (ruCert.subjectName), "string", "Bad subjectName value");
    });



    /*it("Create selfsigned certificate", function() {


			var ext;
			var exts;
			var oid;
			var selfCert;


			certReq = new trusted.pki.CertificationRequest();
			assert.equal(certReq !== null, true);

			exts = new trusted.pki.ExtensionCollection();
			assert.equal(exts !== null, true);


			oid = new trusted.pki.Oid("keyUsage");
			assert.equal(oid !== null, true);

			ext = new trusted.pki.Extension(oid, "critical,keyAgreement,dataEncipherment,nonRepudiation,digitalSignature");
			assert.equal(ext !== null, true);
			assert.equal(exts.length, 0);

			exts.push(ext);
			assert.equal(exts.length, 1);


			oid = new trusted.pki.Oid("extendedKeyUsage");
			assert.equal(oid !== null, true);

			ext = new trusted.pki.Extension(oid, "1.3.6.1.5.5.7.3.2,1.3.6.1.5.5.7.3.4");
			assert.equal(ext !== null, true);

			exts.push(ext);
			assert.equal(exts.length, 2);

			var atrs = [
				{ type: "C", value: "RU" },
				{ type: "CN", value: "Иван Иванов 2012-256" },
				{ type: "localityName", value: "Yoshkar-Ola" },
				{ type: "stateOrProvinceName", value: "Mari El" },
				{ type: "O", value: "Test Org" },
				{ type: "1.2.643.100.3", value: "12295279882" },
				{ type: "1.2.643.3.131.1.1", value: "002465363366" }
			];

			certReq.subject = atrs;
			certReq.version = 2;
			certReq.extensions = exts;
		   	certReq.exportableFlag = true;
			certReq.pubKeyAlgorithm = "gost2012-256";
			certReq.containerName = "containerName2012-256";

			selfCert = new trusted.pki.Certificate(certReq);
			selfCert.serialNumber = "0CAD16E988B12001";
			selfCert.notAfter = 60 * 60 * 24 * 365; // 365 days in sec
			selfCert.sign();
			selfCert.save(DEFAULT_OUT_PATH + "/out2012_256_self.cer", trusted.DataFormat.PEM);
			}).timeout(30000);

		it("delete container", function() {
			trusted.utils.Csp.deleteContainer(certReq.containerName, 75);
		}).timeout(10000);*/
	
	
});


