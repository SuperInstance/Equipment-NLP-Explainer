/**
 * @superinstance/equipment-nlp-explainer
 *
 * Equipment that generates human-readable descriptions of cell logic and operations.
 * Transforms complex decision logic into natural language explanations that answer
 * not just WHAT was decided, but WHY it was decided.
 *
 * @packageDocumentation
 */
import { NLPExplainer } from './NLPExplainer.js';
export { NLPExplainer, default as default } from './NLPExplainer.js';
export { LogicTranslator } from './LogicTranslator.js';
export { ConfidenceExplainer } from './ConfidenceExplainer.js';
export type { SupportedLanguage, TranslationStrings, LogicPattern, LogicPatternType, LogicStructure, PatternInput, PatternOutput, EvaluatedCondition, AppliedTransformation, NLPExplanation, ExplanationDetails, ExplanationStep, ReasoningStep, ConfidenceExplanation, ConfidenceFactor, AuditTrailEntry, NLPExplainerOptions, TileExplanation, DecisionExplanation, ChainExplanation, NLPTile, } from './types.js';
/**
 * Quick factory function to create an NLP explainer instance
 */
export declare function createExplainer(options?: import('./types.js').NLPExplainerOptions): NLPExplainer;
/**
 * Quick explanation function - explain a logic pattern
 */
export declare function explain(pattern: import('./types.js').LogicPattern, options?: import('./types.js').NLPExplainerOptions): import('./types.js').NLPExplanation;
/**
 * Quick confidence explanation function
 */
export declare function explainConfidence(score: number, factors?: import('./types.js').ConfidenceFactor[], language?: import('./types.js').SupportedLanguage): import('./types.js').ConfidenceExplanation;
/**
 * Create a simple decision explanation
 */
export declare function explainDecision(decision: string, reasoning: string, confidence: number, language?: import('./types.js').SupportedLanguage): import('./types.js').DecisionExplanation;
/**
 * Create a reasoning chain explanation
 */
export declare function explainReasoningChain(steps: Array<{
    premise: string;
    conclusion: string;
    evidence?: string[];
    confidence: number;
}>, language?: import('./types.js').SupportedLanguage): import('./types.js').ChainExplanation;
//# sourceMappingURL=index.d.ts.map