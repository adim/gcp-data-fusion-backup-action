"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const gcp_fusion_service_1 = require("./gcp-fusion-service");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fusionUrlParameter = core.getInput('fusion-url') || process.env.FUSION_URL || '';
            const gcpFusionService = new gcp_fusion_service_1.GCPFusionService(fusionUrlParameter);
            const namespaces = yield gcpFusionService.getNamespaces();
            const workspace = process.env.GITHUB_WORKSPACE || __dirname;
            const backupDir = path_1.default.join(workspace, 'pipelines');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir);
            }
            for (const namespace of namespaces) {
                const pipelines = yield gcpFusionService.getNamespacePipelines(namespace);
                console.log('Found:', pipelines.length, 'pipelines in namespace', namespace);
                const namespaceDir = path_1.default.join(backupDir, namespace);
                if (pipelines.length === 0) {
                    console.log('No pipelines found in namespace', namespace);
                    continue;
                }
                if (!fs.existsSync(namespaceDir)) {
                    fs.mkdirSync(namespaceDir);
                }
                for (const pipeline of pipelines) {
                    const pipelineContent = yield gcpFusionService.getPipeline(namespace, pipeline);
                    const pipelineContentString = JSON.stringify(pipelineContent, null, 2);
                    const pathToFile = path_1.default.join(namespaceDir, `${pipeline}.json`);
                    yield writeFile(pathToFile, pipelineContentString);
                }
            }
        }
        catch (error) {
            core.setFailed(error);
            console.log(error);
            return;
        }
    });
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
function writeFile(filename, content) {
    return __awaiter(this, void 0, void 0, function* () {
        //const pathToFile = path.join(workspace, filename)
        // if (!fs.existsSync(pathToFile)) {
        //   throw new Error(`File ${filename} could not be found in your project's workspace. You may need the actions/checkout action to clone the repository first.`)
        // }
        return fs.promises.writeFile(filename, content, { encoding: 'utf8', flag: 'w' });
    });
}
run();
