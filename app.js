const extract = require("./amazon-textract");
const helpers = require("./helpers");
const { getDataFromPdf } = extract;
const { getTotal } = helpers;
const textract = require("@aws-sdk/client-textract");
const credential = require("@aws-sdk/credential-providers");
const s3 = require("@aws-sdk/client-s3");
const fs = require("fs");
// const converter = require('json-2-csv');
const path = require("path");
const { convertCsvToXlsx } = require("@aternus/csv-to-xlsx");

// Specifying source directory + file name
let source = path.join(__dirname, "res.csv");

const { ListObjectsV2Command, S3Client } = s3;
const JSON_FILE = "./resultaws.json";
const DEST = "report.xlsx";
// Set the AWS Region.
const REGION = "ap-south-1"; //e.g. "us-east-1"
const profileName = "default";
const bucket = "invoices-shop";
if (fs.existsSync(DEST)) fs.unlinkSync(DEST);

const client = new S3Client({ region: REGION });

const getDataFromMultiplePDFs = async () => {
  // const files = await getPDFsFromBucket();
  const files = ["Agthia 1.pdf"];
  const response = [];
  await Promise.all(
    files.map(async (i, _index) => {
      console.log("FILENAME......", i);
      const result = await getDataFromPdf(i);
      result?.expenseData?.map((j) => {
        let data = j;
        data["FILE_NAME"] = i;
        data["NAME"] = result.summary.NAME[0];
        data["DATE"] = result.summary.INVOICE_RECEIPT_DATE[0];
        data["RECEIVER_NAME"] = result.summary.RECEIVER_NAME[0];
        data["TOTAL"] = getTotal(result.summary.TOTAL);
        response.push(data);
      });
    })
  );
  console.log(response);
  let converter = require("json-2-csv");
  const csv = await converter.json2csv(response, {});
  fs.writeFile("res.csv", csv, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
    let destination = path.join(__dirname, "report.xlsx");

    // try-catch block for handling exceptions
    try {
      // Functions to convert csv to excel
      convertCsvToXlsx(source, destination);
    } catch (e) {
      // Handling error
      console.error(e.toString());
    }
  });
  console.log("DONE!");
};

const getAsyncDataFromMultiplePDFs = async () => {
  // const jobIds = [ {
  //       jobId: '9026495d6bb634dcddf7ba79a7bb7b04d0900405e820dc5745c5c4de5cf67c5d',
  //       filename: 's1 (3).pdf'
  //     }]
  const jobIds = [
    {
      jobId: "ca57716a9a1d94caa35fc7e411e850789d895bc8f51c78d5c429ae7d612e3874",
      filename: "Agthia (10).pdf",
    },
    {
      jobId: "d16060bc0f48e49543c6bdaebba15467b8b5c9465b168f2f9f404d3a2a7fe159",
      filename: "Agthia (11).pdf",
    },
    {
      jobId: "09d7e2cd18af40360598dae4d6a67cfaa3c70cd8b85c3a7f0d2c9865e829da9f",
      filename: "Agthia (12).pdf",
    },
    {
      jobId: "0d53508b1732cfdb65d8e7172dbef5510650c904472e9bf8616fab1049d4b489",
      filename: "Agthia (13).pdf",
    },
    {
      jobId: "ed13965bbc9381a8ca9ffd383db9f8a385d4ef4fe5678f3ffce3940a28f7600f",
      filename: "Agthia (14).pdf",
    },
    {
      jobId: "d2dc1f557dd59d8efb631a407bab99f82e18d51213584a84caa314b0fddbfa37",
      filename: "Agthia (15).pdf",
    },
    {
      jobId: "98f02697298df234067dd7049809da6087a3b44bb1cfa18770b88cb42b62075e",
      filename: "Agthia (16).pdf",
    },
    {
      jobId: "8d7ba0206cf189a76aba81c4901f08d9aee81fe53ca8527643f2e44a0de41daa",
      filename: "Agthia (17).pdf",
    },
    {
      jobId: "c3cdf40ea465da0d4011819460545030bcd050748870bbaa1c5db6fed1f3ea29",
      filename: "Agthia (18).pdf",
    },
    {
      jobId: "48fb962938db0d958944ba0e3cc293f3b1382327334ac5a3e8158456e367533e",
      filename: "Agthia (19).pdf",
    },
    {
      jobId: "f9f388ca31772f72469f6022fd37c4e1e514ca507632d00a58ef719f68eb8f66",
      filename: "Agthia (2).pdf",
    },
    {
      jobId: "684f05ea290514fc32bd4fca86ad376bf562ca806be2cfa8c7c7c27b5a87ef9b",
      filename: "Agthia (20).pdf",
    },
    {
      jobId: "2b9b874dc7b8aef9b92f6386f9f303100165dedd0dc2fea1523db7681f38fb53",
      filename: "Agthia (21).pdf",
    },
    {
      jobId: "a0c40b11779f7f2659b945448f77db4fd2b85b186f60febc8244ef391446fe13",
      filename: "Agthia (22).pdf",
    },
    {
      jobId: "71ca437795238b8c80258453a65a94196cb61ae57f5eeecd3242b586c0ef62e4",
      filename: "Agthia (23).pdf",
    },
    {
      jobId: "c8324931d3d106266165620f65aa27e650b1568a2417c84f5b029514e93b8024",
      filename: "Agthia (24).pdf",
    },
    {
      jobId: "460dee96c7aa491bbde8931d58342b9bf8cfc41a9b85f154996dbae2b2097c8e",
      filename: "Agthia (25).pdf",
    },
    {
      jobId: "f6c6faec0436d314866a338e1dd90e9017a92db6573d2209340f9bbc1aad8669",
      filename: "Agthia (26).pdf",
    },
    {
      jobId: "20bfb612b3d55e0d87c423504eb2fcd885486839a81f68e5dc251d93c2cb373d",
      filename: "Agthia (27).pdf",
    },
    {
      jobId: "1a7693e0846bf8214796bf22ab9c3bc5fd5490434d868583a0b35e455ff50a9f",
      filename: "Agthia (28).pdf",
    },
    {
      jobId: "b35fd7e5450f0bb5abc7aead6a28b96d1319b338f89005ca887fe467a5cc7ba1",
      filename: "Agthia (29).pdf",
    },
    {
      jobId: "cbc6ceba4a63ec91ef06327590ba660238d4919568746daac2426d73d5584f8b",
      filename: "Agthia (3).pdf",
    },
    {
      jobId: "2b0dff32642ac955501643c07e315b3aa775c778600c11a423b4ec8562878b8a",
      filename: "Agthia (30).pdf",
    },
    {
      jobId: "f61059a3857e5526edb6a712bd643e012b0a518625ded9864cbf41158639f9b5",
      filename: "Agthia (31).pdf",
    },
    {
      jobId: "bda8991ed4babbd07c7b38df19ce135263aa67efadfb938e48838bd16550963b",
      filename: "Agthia (32).pdf",
    },
    {
      jobId: "52ff840c0503b7daee114621835dff56a7237df78a87823967ed065daf5e6e25",
      filename: "Agthia (33).pdf",
    },
    {
      jobId: "10aa617a12a07f8c4f70684809f5c291d5a9aecd83e633a5a612d4c0a7f06acd",
      filename: "Agthia (34).pdf",
    },
    {
      jobId: "f499c217696a27fe4b3f24a44f46f33a953668b4e8717f0d947ab595720c1be2",
      filename: "Agthia (35).pdf",
    },
    {
      jobId: "6bbaa44741c4724418e96d2927899d934ba7e392e98581d3a748e9d626ef14c1",
      filename: "Agthia (36).pdf",
    },
    {
      jobId: "f46832e2ff4993307076f1f57d61ac705cdf61b5872556aa5500facc17dcd0b3",
      filename: "Agthia (4).pdf",
    },
    {
      jobId: "0eaa404d5cf8098b3a54bbaa70606a0b0bcfccda6d70bf2907114b197426f49c",
      filename: "Agthia (5).pdf",
    },
    {
      jobId: "d05f5a34521f5748164ede53438be5879f1127f704e842739ff26c6d5484ab95",
      filename: "Agthia (6).pdf",
    },
    {
      jobId: "72a864e8593e720e67bbbe334af258e0572230aea12626a45074036ee82675fe",
      filename: "Agthia (7).pdf",
    },
    {
      jobId: "e7d698d801d4175fb310dd22f6e8e0131a331ba0bf9febdbfc096da56fbd13ea",
      filename: "Agthia (8).pdf",
    },
    {
      jobId: "bbe6c98034898b09bc6cd977e84d5c2e6d220fd851bd04acd6ee589d897a7545",
      filename: "Agthia (9).pdf",
    },
    {
      jobId: "d171a9ceb4371f024f9b0a575d12a826b373cf8190d371c23669ff9fce5abb7d",
      filename: "Agthia .pdf",
    },
    {
      jobId: "97a821510ff9a1a523ba91b40a21a6bf6ff6ecec3fcbfcf7f16563b17bb37190",
      filename: "Agthia 1 (10).pdf",
    },
    {
      jobId: "5bb279a9b12081c458adf8a8625c1306114b95fcd3ff27092fb52daa57881fcc",
      filename: "Agthia 1 (11).pdf",
    },
    {
      jobId: "8bf318823df9eb4183eae9fcbb85369acde23237fa3d4a2893bb3dbe91f9f1ea",
      filename: "Agthia 1 (12).pdf",
    },
    {
      jobId: "dcb6bcc8e3ef6b3a34eeab43b48d70118fcc27426e941f5f00f99d29bf48af0a",
      filename: "Agthia 1 (13).pdf",
    },
    {
      jobId: "f087b947f4090f43f6fcac1932e8a9e8de35a6adcade7ed2724956947d37260c",
      filename: "Agthia 1 (14).pdf",
    },
    {
      jobId: "2fdc34a6f223688331b87337e7136945cf4ce56ad7567eb1e93366253ae3884b",
      filename: "Agthia 1 (15).pdf",
    },
    {
      jobId: "dc90fd3347c97cc47ed016465a998313a0b9ba7b20c90c6e4b17c881e90fc71f",
      filename: "Agthia 1 (16).pdf",
    },
    {
      jobId: "1654c2bd969891438fc17a51aa5f9f99ceb565629610d2a68b9b7cd762948f97",
      filename: "Agthia 1 (17).pdf",
    },
    {
      jobId: "c4d62928c46c589b82f4ada987c37d131c2a8fda45448ae1346d861407f4ecfb",
      filename: "Agthia 1 (18).pdf",
    },
    {
      jobId: "10294964aa0cbedea2bbe790ca8bff809c389157c8fff78997f0bdf10f465546",
      filename: "Agthia 1 (19).pdf",
    },
    {
      jobId: "bf6bd12a435a86765a70b59170253eac1443b0f6edb64644a6105b428ee55e23",
      filename: "Agthia 1 (2).pdf",
    },
    {
      jobId: "93b1f95081b70748cff1485a4c72e10494e987005b9787304623d2625f6e6cd3",
      filename: "Agthia 1 (20).pdf",
    },
    {
      jobId: "e6842cec1b59c1906a984981869e56f2c4a5acaea809639f8869a44d4df60e33",
      filename: "Agthia 1 (21).pdf",
    },
    {
      jobId: "cfab5e553914f277b8f13851aadffa8ac865701b3828a1d76bcc8617057ea4f5",
      filename: "Agthia 1 (22).pdf",
    },
    {
      jobId: "6e2f2b9f035a868236b8efa48a9d0400f7cf67eebcc54f58447cfae4d7e9c192",
      filename: "Agthia 1 (23).pdf",
    },
    {
      jobId: "a0bb171f65034886d0d6d83239e0e3bb2dc771c025a7a416cb4b780b5a96691c",
      filename: "Agthia 1 (24).pdf",
    },
    {
      jobId: "4bc15fab4673abf15a61d839e9cce7db371c77ead6af5846c551b6d409fe35c2",
      filename: "Agthia 1 (25).pdf",
    },
    {
      jobId: "dbe11dee576ffcc8d9243f913c82bce006b90753e552d36dff18be5095af2633",
      filename: "Agthia 1 (26).pdf",
    },
    {
      jobId: "8c9c0c0629867799eee3832bc2bc3187beb50671822f5fe7090d86b589f18306",
      filename: "Agthia 1 (27).pdf",
    },
    {
      jobId: "4b4ce2668a702ac1b11e822321c231fb69cb638b0616291386abee7c0342d62c",
      filename: "Agthia 1 (28).pdf",
    },
    {
      jobId: "fae2b171d64552dbc6809b5f2be5e44dae1a13fce7bb548edb7631650e6b06da",
      filename: "Agthia 1 (3).pdf",
    },
    {
      jobId: "371b0884a5bfc70059919f62d574ab132dcab344ecac122880d028dd1e44d05d",
      filename: "Agthia 1 (4).pdf",
    },
    {
      jobId: "0dee4a7c9b8ff5e36c39bcfdf54548fea0b6ce0c9c7bb03abeab15f8e1b88049",
      filename: "Agthia 1 (5).pdf",
    },
    {
      jobId: "e7fbff8e219ca57eca0c14de3f127d3e0aedca7beb7213bff52b6e4df4a55e6e",
      filename: "Agthia 1 (6).pdf",
    },
    {
      jobId: "9e1b8f2444962303a3c1bbb1a1cc21a071fe5fe2fcfa97b5bc989019c969b20a",
      filename: "Agthia 1 (7).pdf",
    },
    {
      jobId: "35006bf2fd18c1695fce483f09a8e1cd9f2f928d039b6dc8d6b9aad2466b0fc7",
      filename: "Agthia 1 (8).pdf",
    },
    {
      jobId: "d4da8f224523ceae4180e405df74c40b4b112f29446f14bf2521562e9c1fe11d",
      filename: "Agthia 1 (9).pdf",
    },
    {
      jobId: "39c84fd576073f0190a172e320611d40c575eee90be946c65c92776cea7132a5",
      filename: "Agthia 1.pdf",
    },
    {
      jobId: "cb2c542b48700b7f08d0ca22c68551b655809427711b2fa15bed67ac911e1ae0",
      filename: "Agthia 2 (10).pdf",
    },
    {
      jobId: "8e5d3962db9cf943a2195a08983d8b4d24c08b0664cd859ba74e1123c10aa2ef",
      filename: "Agthia 2 (11).pdf",
    },
    {
      jobId: "0e240fb9c3f26c08a4cf4f2d9b7cfaf449f6c20ff8f4c34ae79c56d07ce7374a",
      filename: "Agthia 2 (12).pdf",
    },
    {
      jobId: "d6d2150b8f59d591f2592a9f4a8b3707e45972c386bb3e1361991f17a966c742",
      filename: "Agthia 2 (13).pdf",
    },
    {
      jobId: "8a979b12ac0cfb55e856af66e4e64fb548faa1e1be95a3bd7182fc7eac969c77",
      filename: "Agthia 2 (14).pdf",
    },
    {
      jobId: "5574b529fdc45bd3df0c25a2f4feec63d932f49f951b3189ae2334ec478ebdc2",
      filename: "Agthia 2 (15).pdf",
    },
    {
      jobId: "4ffdfa56e153b130ac57be6c006393fa3120b4ddb011e8afad54995f1433b562",
      filename: "Agthia 2 (16).pdf",
    },
    {
      jobId: "86194610d8409dab2c7912dd61048f223eb0a1a5c887333cf3517e7519e1bce5",
      filename: "Agthia 2 (17).pdf",
    },
    {
      jobId: "7f8c652e6fb29d01061d5503c96419305336dee9cb6ca4851ee458b1401496a7",
      filename: "Agthia 2 (18).pdf",
    },
    {
      jobId: "16d0b773a08079e65d36627cb7fd1c7b86bd10efcb5b26e50b2ce695f77883e3",
      filename: "Agthia 2 (19).pdf",
    },
    {
      jobId: "bdfea235d044c83988578b8f5964bcd301cb4df034ec739749cc3c906743c2e5",
      filename: "Agthia 2 (2).pdf",
    },
    {
      jobId: "ad6969a9701eb62aca617502fda1e2108bdb8bb7ac1669dfa5a5d8f1e8beb64b",
      filename: "Agthia 2 (20).pdf",
    },
    {
      jobId: "7c0fddd9f50cff617c7daad2508a83b84ea936a479212f77ede1ee4e6b15fa80",
      filename: "Agthia 2 (21).pdf",
    },
    {
      jobId: "3d93952f2ea4ac355d5cb1f65ce00bbf8676e8fbc97dbdec10577e1ccf7686af",
      filename: "Agthia 2 (22).pdf",
    },
    {
      jobId: "55dfff9d0ea179dfeb831d582d7ccaf8677e2253139867de498e65f260f06f84",
      filename: "Agthia 2 (23).pdf",
    },
    {
      jobId: "bae705010a50456a3bd6c1e3e265b5a22d4493ae20eeb4268a9f65a76e47aa5d",
      filename: "Agthia 2 (24).pdf",
    },
    {
      jobId: "eb02281a99096179a214227f68c8771411c04fef768006b225aee0180136b42b",
      filename: "Agthia 2 (25).pdf",
    },
    {
      jobId: "6621cdb66c3152a00db23682ab347b2245d166114640df662c3c8b9de90d2429",
      filename: "Agthia 2 (3).pdf",
    },
    {
      jobId: "51d065322d3a4b44753c8b53e51bd64d1769e61dc9c52abceba3366ce6e4b512",
      filename: "Agthia 2 (4).pdf",
    },
    {
      jobId: "f66270e5859315a79d844f30b51e52e59b9e8a8b3a793779cbacb0064a50b97a",
      filename: "Agthia 2 (5).pdf",
    },
    {
      jobId: "f457af11922ff43384154acf3abc882798c82adf639eeb9308a4dcd4f8909e65",
      filename: "Agthia 2 (6).pdf",
    },
    {
      jobId: "2b0992c9c99921578c7c385e5ea145ba7b84369724d8f4aab125d0d1f7901bfc",
      filename: "Agthia 2 (7).pdf",
    },
    {
      jobId: "c65482b0333b6181a7c7c24cca18d2e4caf86f82fcfe1243d2d3ad698247a9f6",
      filename: "Agthia 2 (8).pdf",
    },
    {
      jobId: "9535daffa13860f99a52d074c3eba0c0f4224ccdc4729b7287f4f55fbca6ae0d",
      filename: "Agthia 2 (9).pdf",
    },
    {
      jobId: "d4d940237b418540cf9a7a94998c3bd736768c1d06eea4ea454e31d71445a29c",
      filename: "Agthia 2.pdf",
    },
    {
      jobId: "8a4f946123ea613a6b32c92dc00143aa817b2ae2dea80d020db5a80f53bfe87a",
      filename: "Agthia 3 (10).pdf",
    },
    {
      jobId: "e9dd25551dcb35217dc47a4b8ff6bd7262768faab8e509d23e915452150bb490",
      filename: "Agthia 3 (11).pdf",
    },
    {
      jobId: "455564d9f8fb69c37ad983b4fdfb0100cf16690f49add24b0971f296c708e37e",
      filename: "Agthia 3 (12).pdf",
    },
    {
      jobId: "675f56c96c081c235ae0277fb5c8d0adbeee0d6f45215a8a20e1c28fe708c29b",
      filename: "Agthia 3 (13).pdf",
    },
    {
      jobId: "27a5eb9aedcb9d11f81253b243b4774bea2e092071033dd4c0ffe44a4e704172",
      filename: "Agthia 3 (14).pdf",
    },
    {
      jobId: "10776718203ffe8d19080b055a399c3abfa086581dabc7567d46055debde1772",
      filename: "Agthia 3 (15).pdf",
    },
    {
      jobId: "03a2302fd24b12393934f8cbd503d26d49b7c26ee8c8cbed50ccbb1883bfc0e3",
      filename: "Agthia 3 (2).pdf",
    },
    {
      jobId: "3b34498a4ab1f8c18fee45046c842bfda9baa356e878cf5c11b7ea88e3d0d50b",
      filename: "Agthia 3 (3).pdf",
    },
    {
      jobId: "85393e8bed7247a5d6cc6b6c52d9adeda8fa772742691946d4a7802f941d264c",
      filename: "Agthia 3 (4).pdf",
    },
    {
      jobId: "cb052f26d9c8943f2877eaade9da464e1f7d9a4d00656064bc0eb3c8c740e29c",
      filename: "Agthia 3 (5).pdf",
    },
    {
      jobId: "e3c6781982a138282dd0f392a61480988ea74060fa0e6a9b48165f8894fc04a8",
      filename: "Agthia 3 (6).pdf",
    },
    {
      jobId: "38a76e968cd4bf685d74b6dbbb671e4ee982994767287aef39d3c82eff8d462e",
      filename: "Agthia 3 (7).pdf",
    },
    {
      jobId: "c96979bc577b5d43343c602d3253843cec732d3291c953278685c5c33729cfcd",
      filename: "Agthia 3 (8).pdf",
    },
    {
      jobId: "c33453764932ea204d3f4070a108d3ce77773ae536df32e61cdc9d16e4ad3a79",
      filename: "Agthia 3 (9).pdf",
    },
    {
      jobId: "d710eee612dc3a7f41de334229e5cbfd8ee5a260de3a8fcd2424ee81ea436eca",
      filename: "Agthia 3.pdf",
    },
    {
      jobId: "923a82e3c32efc18ba4ce9e59102fd470fcfb621054a881364c98831060449bc",
      filename: "Agthia 4 (10).pdf",
    },
    {
      jobId: "35706ad671e03bdae384491e6de2c5df173c76fb70f8a6b8f2e7f6c763376266",
      filename: "Agthia 4 (11).pdf",
    },
    {
      jobId: "50ccf7bd5e6100d187c714bd1333a94420280a01eeb01f58498ba0ad1a2647d4",
      filename: "Agthia 4 (12).pdf",
    },
    {
      jobId: "cf27e6f58f5e223154999b373d5d0ab9a934fce74a58472eeb82d66b7b3ae999",
      filename: "Agthia 4 (13).pdf",
    },
    {
      jobId: "b3fd1e7079202385baeb9c9db0f0b766865f94a788a1e2ecae22717fa680b649",
      filename: "Agthia 4 (2).pdf",
    },
    {
      jobId: "f1ff0b59b73120c1dc3247d184fc0810ffb9b2185689fbbd939cca71cf1b0060",
      filename: "Agthia 4 (3).pdf",
    },
    {
      jobId: "e5c5cc59cff302ae5f9f27fe3c1ede218516cfa9910e2939a37edad830345dab",
      filename: "Agthia 4 (4).pdf",
    },
    {
      jobId: "065ec4be22529b641011de5f9e05e0c8f2f8b4fd949d74445b8752d1f840a650",
      filename: "Agthia 4 (5).pdf",
    },
    {
      jobId: "6ecdc16dbfbd2b022d03bb32d0694fcb92cb982e405f73e8c2c2d4295c251162",
      filename: "Agthia 4 (6).pdf",
    },
    {
      jobId: "9ba5ddd763dcfaedc68497fd4b5d720147891a8938c5b24f12fe10b0ba5c20f6",
      filename: "Agthia 4 (7).pdf",
    },
    {
      jobId: "25f0b175c64ae4ff502e1116ef1aa9977fdcb4e7e6f1c8676eeb6bd464343001",
      filename: "Agthia 4 (8).pdf",
    },
    {
      jobId: "d1c5c5b7486a2271975a08bd459b9aa030816cbe30be176bcc3274f62bfb8c5b",
      filename: "Agthia 4 (9).pdf",
    },
    {
      jobId: "45725f22bd4a942905af633eb8c9536745d798af8cfc1b9f6fb8f4aa2efe384f",
      filename: "Agthia 4.pdf",
    },
    {
      jobId: "2eb019e9051c8eb808f8de57ae83b5036cfcffb2aebf3374c3f75dc705ef371f",
      filename: "Agthia 5 (2).pdf",
    },
    {
      jobId: "951bdbb82f161ff5e4a5981573a9f1461a8413b2508be174cfc96246b12e69e2",
      filename: "Agthia 5 (3).pdf",
    },
    {
      jobId: "f6a9df226ffa9afa079b2ac7ef8184531ca22867a4cbf9b5d8c7025ac5673084",
      filename: "Agthia 5 (4).pdf",
    },
    {
      jobId: "64383d04a8dad5f127ca6125f37305588b5c2b396e620f3c0a30ccedc6aa26bd",
      filename: "Agthia 5 (5).pdf",
    },
    {
      jobId: "cc23fd868cbf1cb216c89f14a9641a2dab36389f2bf8f3453113eff215fd8c4e",
      filename: "Agthia 5 (6).pdf",
    },
    {
      jobId: "16e1850b1dafed219596fb4fdbe7491a0f6e2c7330e7b3360fa8751016abcb66",
      filename: "Agthia 5 (7).pdf",
    },
    {
      jobId: "698b919c889499d773758cb472cb99c7c99cf0b54f5faf7e9556ad8256e09708",
      filename: "Agthia 5 (8).pdf",
    },
    {
      jobId: "fe92bb9b98418c3d2a60935ff8dd88dbfede56bcdf243f4f7ea1abe38990e6c5",
      filename: "Agthia 5 (9).pdf",
    },
    {
      jobId: "eb2b0ea9f3f805eecd7642948314db369c88deaeb2bf576cb5ea2342fe165af9",
      filename: "Agthia 5.pdf",
    },
    {
      jobId: "45f97bee8fee96bd8401d216f41ca457b2a3fd236ea6a728ba872cc085927bac",
      filename: "Agthia 6 (2).pdf",
    },
    {
      jobId: "5fd22ca4ece53ba85da2aeb850156c6ef59f4fac7fbf739b1c71ab995ec95e8f",
      filename: "Agthia 6 (3).pdf",
    },
    {
      jobId: "525ede318381760550e63855cf771eea16890ed428c75838e28d691386cbaf12",
      filename: "Agthia 6 (4).pdf",
    },
    {
      jobId: "c4c36146cdf62e677f3e2200df67533538a60c908ea925d3411b197943f6d58a",
      filename: "Agthia 6.pdf",
    },
    {
      jobId: "d6fc9a980352cdeac82176ff1ac72075b7f88ce62b53297ec76bec1085ef4ffc",
      filename: "Agthia 7.pdf",
    },
    {
      jobId: "d5537876f1f22ed1e2be84b50b4a2a3faa845bb3860942b6efe2a8391bff10d0",
      filename: "Agthia 8.pdf",
    },
    {
      jobId: "8ff08eb9577917e0b218185263fabcaed869f5ad808e4510ccb69d3ceb3b2ca2",
      filename: "Agthia.pdf",
    },
  ];
  final_result = [];
  const a = await Promise.all(
    jobIds.map(async (i, _index) => {
      return new Promise(async (resolve, _reject) => {
        setTimeout(async()=>{
          const result = await extract.getAsyncExpenseAnalysis(i.jobId);
          console.log("NAME", i.filename);
          result?.expenseData?.map((j) => {
            let data = j;
            console.log(j)
            // data["INVOIVE_NUMBER"] = i.
            data["FILE_NAME"] = i.filename;
            data["NAME"] = result.summary.NAME[0];
            data["DATE"] = result.summary.INVOICE_RECEIPT_DATE[0];
            data["TOTAL"] = getTotal(result.summary.TOTAL[data["PAGENUMBER"]]);
            final_result.push(data);
            resolve(data);
          });
          resolve({})
        },200)
      });
    })
  );
  console.log("AWAIT OVER")
  let converter = require("json-2-csv");
  const csv = await converter.json2csv(final_result, {});
  console.log("CONST CSV")
  fs.writeFile("res.csv", csv, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
    let destination = path.join(__dirname, "report.xlsx");
    try {
      convertCsvToXlsx(source, destination);
    } catch (e) {
      console.error(e.toString());
    }
  });
};

const getJobId = async (files) => {
  return Promise.all(
    files.map(async (i, index) => {
      return new Promise((resolve, _reject) => {
        setTimeout(async () => {
          console.log("FILENAME......", i);
          const jobData = await extract.startAsyncExpenseAnalysis(i);
          const jobId = jobData?.JobId;
          resolve({ jobId, filename: i });
        }, 2000 * index);
      });
    })
  );
};

const startAsyncDataFromMultiplePDFs = async () => {
  const files = await getPDFsFromBucket();
  getJobId(files).then((res) => {
    let json = JSON.stringify(res);
    fs.writeFile("jobids.json", json, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  });
  console.log("DONE!");
  return "";
};

const getPDFsFromBucket = async () => {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    // The default and maximum number of keys returned is 1000. This limits it to
    // one for demonstration purposes.
    MaxKeys: 1,
  });

  try {
    let isTruncated = true;

    console.log("Your bucket contains the following objects:\n");
    let contents = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await client.send(command);
      const contentsList = Contents.map((c) => c.Key);
      contents.push(contentsList[0]);
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }
    return contents;
  } catch (err) {
    console.error(err);
  }
};
// const data = getDataFromMultiplePDFs(['Moaserat.pdf'])
// console.log(data)
// startAsyncDataFromMultiplePDFs();

getAsyncDataFromMultiplePDFs();
