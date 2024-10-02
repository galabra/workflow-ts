import fs from 'fs';
import path from 'path';
import jsYaml from 'js-yaml';

import JsonConversionUtils from '../utils/JsonConversionUtils';
import FileSystemUtils from '../utils/FileSystemUtils';

export default async function convertWorkflowsToWacFiles(
  outputDir: string,
): Promise<void> {
  FileSystemUtils.ensureDirExists(outputDir);

  const filePaths = FileSystemUtils.findWorkflowsPaths();
  filePaths.forEach(({ fileName, filePath }) => {
    fs.readFile(filePath, null, (readingError, content) => {
      if (readingError !== null) {
        console.error(`Failed to read file "${filePath}"`, readingError);
        return;
      }

      const json = jsYaml.load(content.toString()) as object;
      const fileContent = JsonConversionUtils.convertJsonToTypescript(
        fileName,
        json,
      );

      const outputFileName = `${fileName}.wac.ts`;
      const outputPath = path.resolve(outputDir, outputFileName);

      fs.writeFile(outputPath, fileContent, null, (writingError) => {
        if (writingError !== null) {
          console.error(`Failed to write file "${outputPath}"`, writingError);
        } else {
          console.log(
            `Successfully converted workflow file "${fileName}" -> "${outputFileName}"`,
          );
        }
      });
    });
  });
}
