"use strict";
/**
 * @superinstance/equipment-nlp-explainer
 *
 * Equipment that generates human-readable descriptions of cell logic and operations.
 * Transforms complex decision logic into natural language explanations that answer
 * not just WHAT was decided, but WHY it was decided.
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfidenceExplainer = exports.LogicTranslator = exports.default = exports.NLPExplainer = void 0;
exports.createExplainer = createExplainer;
exports.explain = explain;
exports.explainConfidence = explainConfidence;
exports.explainDecision = explainDecision;
exports.explainReasoningChain = explainReasoningChain;
// Main equipment class
const NLPExplainer_js_1 = require("./NLPExplainer.js");
var NLPExplainer_js_2 = require("./NLPExplainer.js");
Object.defineProperty(exports, "NLPExplainer", { enumerable: true, get: function () { return NLPExplainer_js_2.NLPExplainer; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(NLPExplainer_js_2).default; } });
// Core modules
const ConfidenceExplainer_js_1 = require("./ConfidenceExplainer.js");
var LogicTranslator_js_1 = require("./LogicTranslator.js");
Object.defineProperty(exports, "LogicTranslator", { enumerable: true, get: function () { return LogicTranslator_js_1.LogicTranslator; } });
var ConfidenceExplainer_js_2 = require("./ConfidenceExplainer.js");
Object.defineProperty(exports, "ConfidenceExplainer", { enumerable: true, get: function () { return ConfidenceExplainer_js_2.ConfidenceExplainer; } });
/**
 * Quick factory function to create an NLP explainer instance
 */
function createExplainer(options) {
    return new NLPExplainer_js_1.NLPExplainer(options);
}
/**
 * Quick explanation function - explain a logic pattern
 */
function explain(pattern, options) {
    const explainerInstance = new NLPExplainer_js_1.NLPExplainer(options);
    return explainerInstance.explain(pattern, options);
}
/**
 * Quick confidence explanation function
 */
function explainConfidence(score, factors, language = 'en') {
    const confidenceExplainer = new ConfidenceExplainer_js_1.ConfidenceExplainer(language);
    return confidenceExplainer.explainConfidence(score, factors);
}
/**
 * Create a simple decision explanation
 */
function explainDecision(decision, reasoning, confidence, language = 'en') {
    const explainerInstance = new NLPExplainer_js_1.NLPExplainer({ language });
    return explainerInstance.explainDecision(`decision-${Date.now()}`, decision, reasoning, confidence);
}
/**
 * Create a reasoning chain explanation
 */
function explainReasoningChain(steps, language = 'en') {
    const explainerInstance = new NLPExplainer_js_1.NLPExplainer({ language });
    return explainerInstance.explainReasoningChain(`chain-${Date.now()}`, steps);
}
//# sourceMappingURL=index.js.map