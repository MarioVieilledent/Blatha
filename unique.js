/**
 * Script pour enlever les doublons d'une liste mots
 * Pour Blatha
 * 
 * N’accepte que des fichier .txt
 * 
 * N'accepte que des listes de la forme :
 * <numéro>. <terme anglais>: <terme français>
 * 
 * Commande pour simplifier une liste :
 * node unique.js <nom_du_fichier>
 */

const fs = require('fs'); // Read and write files
let filename = process.argv[2]; // File name in args

let words = []; // Single instance words
let wordsAlreadyExist = []; // Multiple instance words

// If ends with .txt, remove it
filename.endsWith('.txt') ? filename = filename.substring(0, filename.length - 4) : {};

// Read input file
fs.readFile(filename + '.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Impossible de lire le fichier ' + filename);
    console.error(err); // Error reading file
  } else {
    const lines = data.split('\n');

    const regexWord = /(\d{1,4}).\s?(.*?):\s?(.*)/; // Regex matching a line and gathering elements
    const regexChapter = /\[(.*)\]/;

    lines.forEach(line => { // For all lines
      // Match a chapter
      const isChapter = line.match(regexChapter);
      if (isChapter) {
        words.push(isChapter[1]);
      } else {
        // Match a definition (word)
        const matches = line.match(regexWord);
        if (matches) {
          const alreadyExistIndex = words.findIndex(w => w.english?.trim().toLowerCase() === matches[2].trim().toLowerCase());
          if (alreadyExistIndex === -1) { // Word is new
            words.push({
              id: matches[1],
              english: matches[2],
              french: [matches[3]],
            });
          } else { // Word already exist
            if (words[alreadyExistIndex].french[0].trim().toLocaleLowerCase() !== matches[3].trim().toLocaleLowerCase()) {
              // Si la définition est différente, on en rajoute une
              words[alreadyExistIndex].french.push(matches[3]); // Ajout de l'autre définition pour même terme
            }
            wordsAlreadyExist.push({
              id: matches[1],
              english: matches[2],
              french: [matches[3]],
            });
            console.log(matches[2] + ' en double');
          }
        }
      }
    });

    // Log for user
    console.log(`\n${words.length + wordsAlreadyExist.length} mots traités dont ${wordsAlreadyExist.length} en double.`);

    // Build unique instance word list
    let output = '';
    words.forEach(word => {
      if (typeof word === 'string') { // Is a chapter
        output += `\n[${word}]\n\n`;
      } else {
        output += `${word.id}. ${word.english}: ${word.french.join(' - ')}\n`;
      }
    });

    // Write in an output txt file the simplified list
    let outfilename = filename + '_unique_list.txt';
    fs.writeFile(outfilename, output, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Fichier ${outfilename} créé.`);
      }
    });

    // Write in an output json file the simplified list
    outfilename = filename + '_unique_list.json';
    fs.writeFile(outfilename, JSON.stringify(words), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Fichier ${outfilename} créé.`);
      }
    });
  }
});