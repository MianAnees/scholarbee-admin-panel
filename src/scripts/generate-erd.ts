// import fs from 'fs';
// import path from 'path';
// import { CollectionConfig } from 'payload/types';

export const generateERD = () => {
    // const collectionsDir = path.join(__dirname, '../collections'); // Adjust the path as necessary
    console.log("---- in dir of collections----");
    // const files = fs.readdirSync(collectionsDir);

    // let output = '';

    // files.forEach(file => {
    //     const collectionPath = path.join(collectionsDir, file);
    //     try {
    //         const collection: CollectionConfig = require(collectionPath).default;
    //         console.log("Processing file: ", file);

    //         if (!collection.slug || !Array.isArray(collection.fields)) {
    //             throw new Error(`Invalid collection format in file: ${file}`);
    //         }

    //         const tableName = collection.slug;
    //         let tableDefinition = `Table ${tableName} {\n  id int [pk, increment]\n`;

    //         collection.fields.forEach(field => {
    //             if (field.type !== 'relationship') {
    //                 tableDefinition += `  ${field?.name} ${field.type}\n`;
    //             } else {
    //                 tableDefinition += `  ${field?.name}_id int [ref: > ${field.relationTo}.id]\n`;
    //             }
    //         });

    //         tableDefinition += '}\n\n';
    //         output += tableDefinition;
    //     } catch (error) {
    //         console.error(`Error processing file ${file}:`, error.message);
    //     }
    // });

    // fs.writeFileSync('erd_output.txt', output);
    // console.log('ERD definitions written to erd_output.txt');
    // return output
    return true
};

generateERD();
