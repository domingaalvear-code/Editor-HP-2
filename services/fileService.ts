import { Document, Packer, Paragraph, TextRun, AlignmentType, LineRuleType } from 'docx';
import saveAs from 'file-saver';

// This is a global variable from the script loaded in index.html
declare const pdfjsLib: any;

export const parsePdf = async (file: File): Promise<string> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error("No se pudo leer el archivo."));
      }
      try {
        const typedarray = new Uint8Array(event.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        resolve(fullText);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        reject(new Error("No se pudo analizar el archivo PDF. Podría estar corrupto o en un formato no compatible."));
      }
    };

    fileReader.onerror = () => {
      reject(new Error("Error al leer el archivo."));
    };

    fileReader.readAsArrayBuffer(file);
  });
};


export const generateDocx = async (text: string, fileName: string) => {
    const paragraphs = text.split('\n').map(line => {
        const children: TextRun[] = [];
        // Split by asterisks to detect italicized parts, and filter out empty strings
        const parts = line.split(/(\*.*?\*)/g).filter(part => part);

        parts.forEach(part => {
            if (part.startsWith('*') && part.endsWith('*')) {
                children.push(new TextRun({
                    text: part.substring(1, part.length - 1), // Remove asterisks
                    font: "Calibri",
                    size: 22,
                    italics: true,
                }));
            } else {
                children.push(new TextRun({
                    text: part,
                    font: "Calibri",
                    size: 22,
                    italics: false,
                }));
            }
        });

        return new Paragraph({
            children: children.length > 0 ? children : [new TextRun("")], // Handle empty lines
            spacing: {
                line: 240, // 1.0 line spacing (240 is 1x)
                lineRule: LineRuleType.EXACT,
            },
            alignment: AlignmentType.JUSTIFIED,
        });
    });
    
    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });

    try {
        const blob = await Packer.toBlob(doc);
        saveAs(blob, fileName);
    } catch (error) {
        console.error("Error generating DOCX file:", error);
        alert("No se pudo generar el archivo DOCX.");
    }
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix e.g. "data:image/png;base64,"
            const base64 = result.split(',')[1];
            if (base64) {
                resolve(base64);
            } else {
                reject(new Error("No se pudo convertir el archivo a base64."));
            }
        };
        reader.onerror = error => reject(error);
    });
};