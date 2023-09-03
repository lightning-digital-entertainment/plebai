import { YoutubeParameters } from "serpapi/types/src/engines/youtube";
import { getJson } from "serpapi";
import { YoutubeTranscript } from "youtube-transcript";
import * as fs from 'fs';
import { Document, IDocument,ZepClient } from "@getzep/zep-js";
import * as path from 'path';
import * as readline from 'readline';



const zepApiUrl =  "";
const collectionName = 'karera001';




async function createCollection() {



    console.log(`Creating collection ${collectionName}`);

    const client = await ZepClient.init(zepApiUrl);


    const collection = await client.document.addCollection({
       name: collectionName,
       embeddingDimensions: 1536, // this must match the embedding dimensions of your embedding model
       description: "vivek2024 campaign", // optional
       metadata: { 'title': 'HR and jobs information' }, // optional
       isAutoEmbedded: true, // optional (default: true) - whether Zep should  automatically embed documents
    });

    console.log(collection);

}

async function uploadDocuments() {



   const client = await ZepClient.init(zepApiUrl);
   const collection = await client.document.getCollection(collectionName);
   const filename = '/Users/arunnedunchezian/Downloads/hr\ datasets/companies_single_line.csv';


   console.log('File name is: ', filename)


      // const chunks = readChunkFromFile(filePath, maxChunk);

      const text = fs.readFileSync(filename, "utf8");
      const chunks = splitStringIntoChunks(text, 500);


      const filteredChunks: string[] = chunks.filter(str => str.trim() !== '');
      console.log(filteredChunks);
      const documents = filteredChunks.map(
            (chunk) =>

               new Document({

                  content: chunk,
                  // document_id: filename, // optional document ID used in your system
                  metadata: { title: filename }, // optional metadata
               })
         );

         console.log(
            `Adding ${documents.length} documents to collection ${collectionName}`
         );

         const uuids = await collection.addDocuments(documents);

         console.log(
            `Added ${uuids.length} documents to collection ${collectionName}`
         );


   await checkEmbeddingStatus(client, collectionName);

   // Index the collection
   console.log(`Indexing collection ${collectionName}`);
   await collection.createIndex(true);

}

async function deleteCollection() {



    console.log(`deleting collection ${collectionName}`);

    const client = await ZepClient.init(zepApiUrl);


    const collection = await client.document.deleteCollection(collectionName);

    console.log(collection);

}



async function checkStatus() {

    const client = await ZepClient.init(zepApiUrl);
    await checkEmbeddingStatus(client, collectionName);

    const collection = await client.document.getCollection(collectionName);

        // Index the collection
        console.log(`Indexing collection ${collectionName}`);
        await collection.createIndex(true);



}

async function queryDocs() {

    const client = await ZepClient.init(zepApiUrl);
    const collection = await client.document.getCollection(collectionName);



    const query = "what jobs available in company Goldbelt, Incorporated ";
    const searchResults = await collection.search(
       {
          text: query,
       },
       3
    );
    console.log(
       `Found ${searchResults.length} documents matching query '${query}'`
    );
    printResults(searchResults);

    const newSearchResults = await collection.search(
        {
           text: query
        },
        3
     );
     console.log(
        `Found ${newSearchResults.length} documents matching query '${query}'`
     );
     printResults(newSearchResults);

      // Search by embedding
   const interestingDocument = newSearchResults[0];
   console.log(
      `Searching for documents similar to:\n${interestingDocument.content}\n`
   );
   if (!interestingDocument.embedding) {
      throw new Error("No embedding found for document");
   }
   const vectorToSearch = new Float32Array(interestingDocument.embedding);
   const embeddingSearchResults = await collection.search(
      {
         embedding: vectorToSearch,
      },
      3
   );
   console.log(
      `Found ${embeddingSearchResults.length} documents matching embedding`
   );
   printResults(embeddingSearchResults);



}

// getYttranscripts();
// deleteCollection();
// createCollection();
// uploadDocuments();
// checkStatus();
 queryDocs();




function saveTextToFile(filename: string, text: string): void {
    fs.writeFile(filename, text, (err) => {
        if (err) {
            console.error("Error writing to file:", err);
        } else {
            console.log(`Text saved to ${filename}`);
        }
    });
}

export function readChunkFromFile(file: string, chunkSize: number): string[] {
    const text = fs.readFileSync(file, "utf8");
    const chunks = naiveSplitText(text, chunkSize);
    console.log(
       `Splitting text into ${chunks.length} chunks of max size ${chunkSize} characters.`
    );
    return chunks;
 }

 export function naiveSplitText(text: string, maxChunkSize: number): string[] {
    // Naive text splitter chunks document into chunks of maxChunkSize,
    // using paragraphs and sentences as guides.

    const chunks: string[] = [];

    // Remove extraneous whitespace
    text = text.split(/\s+/).join(" ");

    // Split into paragraphs
    let paragraphs = text.split("\n\n");

    // Clean up paragraphs
    paragraphs = paragraphs.map((p) => p.trim()).filter((p) => p.length > 0);

    for (const paragraph of paragraphs) {
       if (paragraph.length > 0 && paragraph.length <= maxChunkSize) {
          chunks.push(paragraph);
       } else {
          const sentences = paragraph.split(". ");
          let currentChunk = "";

          for (const sentence of sentences) {
             if (currentChunk.length + sentence.length > maxChunkSize) {
                chunks.push(currentChunk);
                currentChunk = sentence;
             } else {
                currentChunk += (currentChunk ? ". " : "") + sentence;
             }
          }

          if (currentChunk) {
             chunks.push(currentChunk);
          }
       }
    }

    return chunks;
 }


 async function checkEmbeddingStatus(
    client: ZepClient,
    collectionName2: string
 ): Promise<void> {
    let c = await client.document.getCollection(collectionName2);

    while (c.status !== "ready") {
       console.log(
          `Embedding status: ${c.document_embedded_count}/${c.document_count} documents embedded`
       );
       // Wait for 1 second
       await new Promise((resolve) => setTimeout(resolve, 1000));

       // Fetch the collection again to get the updated status
       c = await client.document.getCollection(collectionName2);
    }
 }

 export function printResults(results: IDocument[]): void {
    for (const result of results) {
       console.log(
          `${result.content} - ${JSON.stringify(result.metadata)} -> ${
             result.score
          }\n`
       );
    }
 }

 export function getResults(results: IDocument[]): string {

    let data=''
    for (const result of results) {
       data = data + " " + result.content;
    }

    return data;
 }

 function splitStringIntoChunks(str: string, chunkSize: number): string[] {
    const words = str.split(/\s+/); // Split the string into an array of words
    const chunks: string[] = [];
    let currentChunk = '';

    for (const word of words) {
      if ((currentChunk + word).length <= chunkSize) {
        currentChunk += (currentChunk === '' ? '' : ' ') + word;
      } else {
        chunks.push(currentChunk);
        currentChunk = word;
      }
    }

    if (currentChunk !== '') {
      chunks.push(currentChunk);

    }

    return chunks;
  }
