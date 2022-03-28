import * as core from '@actions/core';
import path from 'path';
import * as fs from 'fs';
import { GCPFusionService } from './gcp-fusion-service';


async function run() {
  try {
    const fusionUrlParameter: string = core.getInput('fusion-url')|| process.env.FUSION_URL || '';
    const gcpFusionService = new GCPFusionService(fusionUrlParameter);
    const namespaces = await gcpFusionService.getNamespaces();
    const workspace: string = process.env.GITHUB_WORKSPACE as string || __dirname;
    const backupDir = path.join(workspace, 'pipelines');
    if (!fs.existsSync(backupDir)){
      fs.mkdirSync(backupDir);
    }
    for (const namespace of namespaces) {
      const pipelines = await gcpFusionService.getNamespacePipelines(namespace);
      console.log('Found:', pipelines.length, 'pipelines in namespace', namespace);
      const namespaceDir = path.join(backupDir, namespace);
      if (pipelines.length === 0) {
        continue;
      }
      if (!fs.existsSync(namespaceDir)) {
        fs.mkdirSync(namespaceDir);
      }
      for (const pipeline of pipelines) {
        const pipelineContent = await gcpFusionService.getPipeline(namespace, pipeline);
        const pipelineContentString = JSON.stringify(pipelineContent, null, 2);
        const pathToFile = path.join(namespaceDir,`${pipeline}.json`);
        await writeFile(pathToFile, pipelineContentString);
      }
  }
 
  } catch (error) {
    core.setFailed(error as any)
    console.log(error);
    return;
  }
}
  /**
   * Gets the contents of a file in your project's workspace
   *
   * ```js
   * const myFile = tools.readFile('README.md')
   * ```
   *
   * @param filename - Name of the file
   * @param encoding - Encoding (usually utf8)
   */
  async function writeFile (filename: string, content: string) {
    

    //const pathToFile = path.join(workspace, filename)

    // if (!fs.existsSync(pathToFile)) {
    //   throw new Error(`File ${filename} could not be found in your project's workspace. You may need the actions/checkout action to clone the repository first.`)
    // }

    return fs.promises.writeFile(filename, content, { encoding: 'utf8', flag: 'w'});
  }

run();
