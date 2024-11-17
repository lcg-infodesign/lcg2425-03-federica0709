let data; // I dati del CSV
let dataObj; // L'oggetto con i dati
let waveWidth = 80;  // Altezza per ogni glifo, cioè l'onda
let gutter = 20;
let waveAmplitude = 10; // Altezza delle onde
let waveSpacing =10;  // Distanza verticale tra le onde
let waveFrequency = 0.1; // Frequenza delle onde
let yPos = 130; //coordinata y da cui partono i fiumi

function preload() {
  // Carica il file CSV
  data = loadTable("asset/rivers-data.csv", "csv", "header");
}

function setup() {
     //dataObj = data.getObject();
     dataObj = data.getRows().map(row => {
      // Estrai il valore della colonna `length` e converti in numero
      return {
        name: row.get("name"),
        countries: row.get("countries"),
        continent: row.get("continent"),
        length: parseFloat(row.get("length")),
        outflow: row.get("outflow")
      };
    });

    // Rimuovi duplicati basati sul nome del fiume
    const uniqueRivers = new Set();
    dataObj = dataObj.filter(item => {
        const isDuplicate = uniqueRivers.has(item.name);
        uniqueRivers.add(item.name);
        return !isDuplicate;
    });

    let maxRiverLength = Math.max(...dataObj.map(item => item.length));

  // Verifica la struttura di `dataObj` dopo la conversione
  console.log("Data after conversion:", dataObj);

  // Recupera i dati sotto forma di oggetto
 
  // Ordina i dati per lunghezza in ordine decrescente
  dataObj.sort((a, b) => b.length - a.length);
  // Verifica l’ordine dei dati
  console.log("Data after sorting:", dataObj);
  
  // Calcola l'altezza totale necessaria per visualizzare tutti i glifi
  let totalWidth = waveWidth * dataObj.length + waveAmplitude * (175 + gutter); 
  //aggiungo 100 perchè altrimenti l'ultimo rimane tagliato fuori dalla finestra
  createCanvas(totalWidth, windowHeight);
  background("#c8ddd2");

  elem=createElement("h1", "Rivers in the world");
  elem.position(30,0);
  

  let xPos = 0;  // Posizione iniziale per il primo glifo
  let maxWaveLength = 0;  // Variabile per tracciare l'onda più lunga

  for (let i = 0; i < dataObj.length; i++) {
  
    //waveLength mappata alla lunghezza del fiume:
    // La variabile waveLength è calcolata usando map() in base 
    // alla lunghezza del fiume, per rendere ogni glifo proporzionale 
    // alla lunghezza effettiva del fiume. Più lungo è il fiume, maggiore 
    // sarà waveLength, rendendo il glifo visivamente più lungo.
    // Map la lunghezza del fiume per decidere la larghezza del glifo
    
      let item = dataObj[i];
      
      // Assicurati che `item.length` sia un numero valido
      if (!isNaN(item.length)) {
        // Mappa la lunghezza del fiume per decidere la larghezza del glifo
        // Modifica i valori 0 e 10000 in base ai dati reali
        let waveLength = map(item.length, 0, 10000, 180, height); 
        maxWaveLength = max(maxWaveLength, waveLength);  // Aggiorna l'onda più lunga
        // Disegna il glifo per rappresentare il fiume
        drawGlyph(xPos, waveLength);

        // Disegna il nome del fiume sotto l'onda, ruotato di 90 gradi
        push(); // Salva lo stato corrente del canvas
        translate(xPos + 70, yPos); // Posiziona il testo alla base dell'onda
        rotate(-HALF_PI); // Ruota di 90 gradi verso sinistra
        fill(0); // Colore del testo nero
        noStroke(); // Rimuove il bordo del testo
        textAlign(RIGHT, CENTER); // Allinea il testo a destra e centrato
        textSize(10); // Dimensione del testo
        textStyle(BOLD);
        text(item.name.toUpperCase(), 0, -27); // Scrive il nome del fiume
        pop(); // Ripristina lo stato originale

        // Disegna gli altri elementi (cerchio, outflow, lunghezza, ecc.)
        // Incrementa la posizione verticale per il prossimo glifo
        
        // inserisco un piccolo cerchio 
        if(item.continent==="Africa"){
          fill("black");
        } else if(item.continent==="South America" || item.continent==="North America"){
           fill("red");
        }else if(item.continent==="Asia"){
          fill("yellow");
        }else if(item.continent==="Europe"){
          fill("green");
        }else if(item.continent==="Oceania" || item.continent==="Australia"){
          fill("blue");
        }

        noStroke();
        circle(xPos+70, yPos-30, 10);

      // Posiziona il testo dell'outflow alla fine dell'onda in orizzontale
      fill(0);
      noStroke();
      textAlign(CENTER); // Allinea il testo al centro
      textSize(10);
      text(item.outflow, xPos+80, waveLength+20); // Posiziona il testo orizzontale dopo la fine dell'onda
        
     
   
      textSize(12);
      text(item.length, xPos+70, yPos-10); 

        xPos += waveWidth + gutter;
      } else {
        console.log("Invalid length for item:", item);
      }
    }
    noLoop();

      // legenda
    elem=createElement("h4","Legenda");
    elem.position(30, maxWaveLength + 35);

 

    // Disegna un'onda corta nella legenda
    drawShortWave(50, maxWaveLength + yPos -30);
  }


function draw() {
  // Il disegno è statico, quindi non serve codice qui
}

function drawGlyph(xPos, waveLength) {
  stroke(0);
  strokeWeight(5);
  stroke("#5980d4");
  noFill();
  
  

  // Disegna un'onda orizzontale con la larghezza proporzionale 
  // alla lunghezza del fiume trasposta utilizzando il comando map

    beginShape();
    for (let y = yPos; y < waveLength; y++) {
      let x = waveAmplitude * sin(y * waveFrequency) + waveSpacing + 60;
      vertex(x+xPos, y);
    }
    endShape();
}


function drawShortWave(xPos, yPos) {
  noStroke();
  circle(xPos+15, yPos-20, 10);
  
  push();
  fill(0);
  noStroke();
  textAlign(CENTER); // Allinea il testo al centro
  textSize(10);
  text('length', xPos+20, yPos-5); // Scrive il nome del fiume
  pop();

  push();
  fill(0);
  noStroke();
  translate(xPos +100, yPos+80); // Posiziona il testo alla base dell'onda
  rotate(-HALF_PI); // Ruota di 90 gradi 
  textAlign(CENTER); // Allinea il testo al centro
  textSize(10);
  text('river name', 60, -100); // Scrive il nome del fiume
  pop();


  stroke("#5980d4");
  strokeWeight(3);
  noFill();

  beginShape();
  for (let y = 0; y < 50; y++) {
      let x = waveAmplitude * sin(y * waveFrequency) + waveSpacing + 10;
      vertex(x + xPos, y+yPos);
  }
  endShape();

  // Aggiungi testo esplicativo accanto all'onda corta
  fill(0);
  noStroke();
  textSize(10);
  text("Outflow", xPos+10, yPos + 60);
}
