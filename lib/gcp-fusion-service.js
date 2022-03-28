"use strict";
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
exports.GCPFusionService = void 0;
const axios_1 = __importDefault(require("axios"));
const { GoogleAuth } = require('google-auth-library');
class GCPFusionService {
    constructor(fusionUrl) {
        this.fusionUrl = fusionUrl;
        this.googleAuth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
    }
    getNamespaces() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenApi = yield this.googleAuth.getAccessToken();
            const token = tokenApi.toString().split('...')[0];
            const response = yield axios_1.default.request({
                url: `https://${this.fusionUrl}/api/v3/namespaces`,
                headers: { 'Authorization': 'Bearer ' + token }
            });
            return response.data.map(x => x.name);
        });
    }
    getNamespacePipelines(namespace) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenApi = yield this.googleAuth.getAccessToken();
            const token = tokenApi.toString().split('...')[0];
            const response = yield axios_1.default.request({
                url: `https://${this.fusionUrl}/api/v3/namespaces/${namespace}/apps`,
                headers: { 'Authorization': 'Bearer ' + token }
            });
            return response.data.map(x => x.name);
        });
    }
    getPipeline(namespace, pipeline) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenApi = yield this.googleAuth.getAccessToken();
            const token = tokenApi.toString().split('...')[0];
            const response = yield axios_1.default.request({
                url: `https://${this.fusionUrl}/api/v3/namespaces/${namespace}/apps/${pipeline}`,
                headers: { 'Authorization': 'Bearer ' + token }
            });
            return response.data;
        });
    }
}
exports.GCPFusionService = GCPFusionService;
