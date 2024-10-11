const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '..', 'client', 'widgets');
const outputFilePath = path.join(__dirname, '..', 'dist', 'customWidgetsMetadata.json');

const metadata = [];

fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const componentPath = path.join(componentsDir, file);
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    const componentName = file.replace('.jsx', '');
    
    // Extract HTMLElementName from the component file
    const htmlElementNameMatch = componentContent.match(/export\s+const\s+HTMLElementName\s*=\s*['"]([^'"]+)['"]/);
    const htmlElementName = htmlElementNameMatch ? htmlElementNameMatch[1] : null;

    if (htmlElementName) {
      metadata.push({ ComponentName: componentName, HTMLElementName: htmlElementName });
    } else {
      console.warn(`HTMLElementName not found for component: ${componentName}`);
    }
  }
});

fs.writeFileSync(outputFilePath, JSON.stringify(metadata, null, 2));
console.log('Metadata file generated successfully.');