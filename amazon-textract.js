// Import required AWS SDK clients and commands for Node.js
const textract = require("@aws-sdk/client-textract");
const credential = require("@aws-sdk/credential-providers");
const fs = require("fs");

const { AnalyzeExpenseCommand, StartExpenseAnalysisCommand , GetExpenseAnalysisCommand, TextractClient } = textract;
const { fromIni } = credential;
const JSON_FILE = "./resultaws.json";

// Set the AWS Region.
const REGION = "ap-south-1"; //e.g. "us-east-1"
const profileName = "default";
// Create SNS service object.
const textractClient = new TextractClient({ region: REGION });

const bucket = "invoices-shop";
const output_bucket = "output-textract-fazna"
const photo = "Moaserat.pdf";
if (fs.existsSync(JSON_FILE)) fs.unlinkSync(JSON_FILE);

const getInput = (name) => ({ // StartExpenseAnalysisRequest
  DocumentLocation: { // DocumentLocation
    S3Object: { // S3Object
      Bucket: bucket,
      Name: name,
      // Version: "STRING_VALUE",
    },
  },
  NotificationChannel: { // NotificationChannel
    SNSTopicArn: "arn:aws:sns:ap-south-1:805686771640:textract", // required
    RoleArn: "arn:aws:iam::805686771640:role/sns", // required
  },
  OutputConfig: { // OutputConfig
    S3Bucket: output_bucket, // required
    S3Prefix: "sample",
  },
});

const getDataFromPdf = async (name) => {
  const params = {
    Document: {
      S3Object: {
        Bucket: bucket,
        Name: name,
      },
    },
  };
  const data = await process_text_detection_and_return(params);
  const replacedData = replaceArraysWithFirstElement(data)
//   console.log(replacedData)
  return replacedData;
};

// Set params
const replaceArraysWithFirstElement = (data) => {
//    console.log(data)
   const result = []
   return data

}

const process_text_detection = async (params) => {
  try {
    const aExpense = new AnalyzeExpenseCommand(params);
    const response = await textractClient.send(aExpense);

    let json = JSON.stringify(response);
    fs.writeFile("resultaws.json", json, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });

    console.log("SUMMARY");
    response.ExpenseDocuments.forEach((doc) => {
      doc.SummaryFields.forEach((items) => {
        console.log(items?.Type?.Text, "---", items?.ValueDetection?.Text);
      });
    });
    console.log("EXPENSE");

    response.ExpenseDocuments.forEach((doc) => {
      doc.LineItemGroups.forEach((items) => {
        items.LineItems.forEach((fields) => {
          fields.LineItemExpenseFields.forEach((expenseFields) => {
            console.log(
              expenseFields?.Type?.Text,
              " ---",
              expenseFields?.ValueDetection?.Text
            );
          });
        });
      });
    });
    return response; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

const getDictFromTotalbyPages = (items,oldtotalByPages) => {
  let totalByPages = oldtotalByPages
  const pageNumber = items?.PageNumber;
  if(!(pageNumber in totalByPages)) {
    totalByPages[pageNumber] == [items?.ValueDetection?.Text]
  }
  else {
    let value = totalByPages[pageNumber]
    value.push(items?.ValueDetection?.Text)
    totalByPages[pageNumber] = value
  }
  return totalByPages
}

const process_response = (response) => {
  const summary = {};
  const totalByPages = {}
  let invoiceId = ""
  // console.log(response)
  response.ExpenseDocuments.forEach((doc,index) => {
    doc.SummaryFields.forEach((items) => {
      if(items?.Type?.Text == "INVOICE_RECEIPT_ID") {
        invoiceId = items?.ValueDetection?.Text
      }
      if(items?.Type?.Text == "TOTAL") {
        const pageNumber = items?.PageNumber;
        if(pageNumber in totalByPages) {
          let value = totalByPages[pageNumber]
          value.push(items?.ValueDetection?.Text)
          totalByPages[pageNumber] = value
        }
        else {
          totalByPages[pageNumber] = [items?.ValueDetection?.Text]
        }
      }
      const type = items?.Type?.Text
      if (items?.Type?.Text in summary) {
        
        let value = summary[type];
        value.push(items?.ValueDetection?.Text);
        summary[type] = value;
      } else {
        summary[type] = [items?.ValueDetection?.Text];
      }
    });
  });
  summary["TOTAL"] = totalByPages

  const expense = {};
  const expenseData = []
  response.ExpenseDocuments.forEach((doc) => {
    doc.LineItemGroups.forEach((myItems) => {
      myItems.LineItems.forEach((fields) => {
        const newItem = {}
        let page = 0
        fields.LineItemExpenseFields.forEach((items) => {
          page = items?.PageNumber
          newItem[items?.Type?.Text] = items?.ValueDetection?.Text
          if (items?.Type?.Text in expense) {
            let type = items?.Type?.Text
            let value = expense[type];
            value.push(items?.ValueDetection?.Text);
            expense[type] = value;
          } else {
            expense[items?.Type?.Text] = [items?.ValueDetection?.Text];
          }
        });
        newItem["PAGENUMBER"] = page
        console.log(invoiceId)
        newItem["INVOICE_ID"]= invoiceId
        expenseData.push(newItem)
      });
    });
  });
  return {
    summary,
    expense,
    expenseData
  }

}

const process_text_detection_and_return = async (params) => {
  try {
    const aExpense = new AnalyzeExpenseCommand(params);
    const response = await textractClient.send(aExpense);

    let json = JSON.stringify(response);
    fs.writeFile("resultaws.json", json, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
    const summary = {};
    console.log("SUMMARY");
    response.ExpenseDocuments.forEach((doc) => {
      doc.SummaryFields.forEach((items) => {
        // console.log(items?.Type?.Text, "---", items?.ValueDetection?.Text);
        type = items?.Type?.Text;
        // console.log("TYPE", type);
        if (items?.Type?.Text in summary) {
          let value = summary[type];
        //   console.log("SUMMARY TYPE", summary[type]);
          value.push(items?.ValueDetection?.Text);
          summary[type] = value;
        } else {
          summary[type] = [items?.ValueDetection?.Text];
        }
      });
    });
    console.log("EXPENSE");
    const expense = {};
    const expenseData = []
    response.ExpenseDocuments.forEach((doc) => {
      doc.LineItemGroups.forEach((myItems) => {
        myItems.LineItems.forEach((fields) => {
            const newItem = {}
          fields.LineItemExpenseFields.forEach((items) => {
            // console.log(expenseFields)
            newItem[items?.Type?.Text] = items?.ValueDetection?.Text
            // console.log(items?.Type?.Text, "---", items?.ValueDetection?.Text);
            if (items?.Type?.Text in expense) {
              let value = expense[type];
            //   console.log("expense TYPE", expense[type]);
              value.push(items?.ValueDetection?.Text);
              expense[type] = value;
            } else {
              expense[items?.Type?.Text] = [items?.ValueDetection?.Text];
            }
          });
          expenseData.push(newItem)
        });
      });
    });
    return {
      expense,
      expenseData,
      summary,
    }; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

const startAsyncExpenseAnalysis = async(name) => {
  console.log("NAME",name)
  // const input = getInput(name)
  const input = { // StartExpenseAnalysisRequest
    DocumentLocation: { // DocumentLocation
      S3Object: { // S3Object
        Bucket: bucket,
        Name: name,
        // Version: "STRING_VALUE",
      },
    },
    NotificationChannel: { // NotificationChannel
      SNSTopicArn: "arn:aws:sns:ap-south-1:805686771640:textract", // required
      RoleArn: "arn:aws:iam::805686771640:role/sns", // required
    },
    OutputConfig: { // OutputConfig
      S3Bucket: output_bucket, // required
      S3Prefix: "sample",
    },
  }
  const command = new StartExpenseAnalysisCommand(input);
  const response = await textractClient.send(command);
  return response;
}

const getAsyncExpenseAnalysis = async(jobId) => {
  try{
    const input = {
      JobId: jobId, // required
      MaxResults: Number("10"),
    };
    const command = new GetExpenseAnalysisCommand(input);
    await new Promise(r => setTimeout(r, 1000));
    const response = await textractClient.send(command);
    const result = process_response(response)
    // console.log(result)
    return result
  }catch(err) {
    console.log(err)
    console.log("TIMEOUT")
    await new Promise(r => setTimeout(r, 5000));
    console.log("TIMEOUT OVER")
  }

}

// startAsyncExpenseAnalysis()
module.exports.getDataFromPdf = getDataFromPdf;
module.exports.startAsyncExpenseAnalysis = startAsyncExpenseAnalysis
module.exports.getAsyncExpenseAnalysis = getAsyncExpenseAnalysis