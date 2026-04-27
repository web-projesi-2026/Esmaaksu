const fs = require('fs');
let css = fs.readFileSync('frontend/assets/css/global.css', 'utf8');

// Use regex to find all [data-theme='light'] blocks
const regex = /\[data-theme=\"light\"\][^{]*\{[^}]*\}/g;
let additions = '\n/* REPLICATED READER THEME OVERRIDES */\n';

let match;
while ((match = regex.exec(css)) !== null) {
    let block = match[0];
    if (block.includes('--primary:')) continue; // skip the root variables block, we already added them

    // Replace light -> reader
    let readerBlock = block.replace(/\[data-theme=\"light\"\]/g, '[data-theme=\"reader\"]');
    
    // Replace light mode hardcoded colors with reader mode colors
    readerBlock = readerBlock.replace(/#fff(fff)?/gi, '#FAF4E5');
    readerBlock = readerBlock.replace(/rgba\(255,\s*255,\s*255,/gi, 'rgba(250, 244, 229,');
    readerBlock = readerBlock.replace(/#1A1A2E/gi, '#3A2F25');
    readerBlock = readerBlock.replace(/#f0f0f5/gi, '#EBE1C9');
    readerBlock = readerBlock.replace(/#444460/gi, '#5C4D3F');
    readerBlock = readerBlock.replace(/#8888A0/gi, '#7A6959');

    // Mute the primary purples to the new brown primary where explicitly used
    readerBlock = readerBlock.replace(/108,\s*92,\s*231/gi, '139, 90, 43');

    additions += readerBlock + '\n';
}

fs.appendFileSync('frontend/assets/css/global.css', additions);
console.log('Reader CSS appended successfully!');
