import fs from 'fs';
import path from 'path';

const WORKFLOW_FILE_EXTENSION = '.yml';

export default class FileSystemUtils {
  public static ensureDirExists(outputDir: string): void {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
      console.log(`Created a new directory "${outputDir}"`);
    }
  }

  public static findWorkflowsPaths(): { fileName: string; filePath: string }[] {
    const rootDir = FileSystemUtils.findRootDirectory(process.cwd());
    const githubDir = path.resolve(rootDir, '.github');

    if (!fs.existsSync(githubDir)) {
      console.warn(
        'Could not find the ".github" directory, so assuming there are no workflows',
      );
      return [];
    }

    const workflowsDir = path.resolve(githubDir, 'workflows');
    if (!fs.existsSync(workflowsDir)) {
      console.warn(
        'Could not find the ".github/workflows" directory, so assuming there are no workflows',
      );
      return [];
    }

    return fs
      .readdirSync(workflowsDir)
      .filter((filePath) => filePath.endsWith(WORKFLOW_FILE_EXTENSION))
      .map((filePath) => ({
        fileName: filePath
          .split('/')
          .pop()
          .replace(WORKFLOW_FILE_EXTENSION, ''),
        filePath: path.resolve(workflowsDir, filePath),
      }));
  }

  private static findRootDirectory(currentPath: string, depth = 0): string {
    if (depth > 10) {
      console.error(
        "Couldn't find root directory. Try running the script from another directory",
      );
    }

    const filesToCheck = [
      'package.json',
      '.gitignore',
      'README.md',
      'node_modules',
    ];
    const exists = filesToCheck.some((fileName) => {
      const pathToCheck = path.resolve(currentPath, fileName);
      return fs.existsSync(pathToCheck);
    });

    if (exists) {
      return currentPath;
    }

    const parent = path.resolve(currentPath, '..');
    return this.findRootDirectory(parent, depth + 1);
  }
}
