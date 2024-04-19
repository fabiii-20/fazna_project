const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');
const AdmZip = require('adm-zip');

const OUTPUT_ZIP = './ExtractTextInfoFromPDF.zip';
const JSON_FILE = "./result.json"
//Remove if the output already exists.
if(fs.existsSync(OUTPUT_ZIP)) fs.unlinkSync(OUTPUT_ZIP);
if(fs.existsSync(JSON_FILE)) fs.unlinkSync(JSON_FILE);

const INPUT_PDF = './Moaserat.pdf';

const credentials = PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile('pdfservices-api-credentials.json')
        .build();

// Create an ExecutionContext using credentials
const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

// Create a new operation instance.
const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew(),
    input = PDFServicesSdk.FileRef.createFromLocalFile(
        INPUT_PDF, 
        PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf
    );

// Build extractPDF options
const options = new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
        .addElementsToExtract(PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT).build()


extractPDFOperation.setInput(input);
extractPDFOperation.setOptions(options);

// Execute the operation
extractPDFOperation.execute(executionContext)
    .then(result => result.saveAsFile(OUTPUT_ZIP))
    .then(() => {
        console.log('Successfully extracted information from PDF. Printing H1 Headers:\n');
        let zip = new AdmZip(OUTPUT_ZIP);
        let jsondata = zip.readAsText('structuredData.json');
        let data = JSON.parse(jsondata);
        let json = JSON.stringify(data)
        fs.writeFile('result.json', json,(err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
        data.elements.forEach(element => {
            if(element.Path.endsWith('/H1')) {
                console.log(element.Text);
            }
        });

    })
    .catch(err => console.log(err));
