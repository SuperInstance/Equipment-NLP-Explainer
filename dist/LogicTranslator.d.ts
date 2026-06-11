/**
 * LogicTranslator - Translates logic patterns to natural language
 *
 * This module handles the conversion of formal logic patterns into
 * human-readable natural language descriptions in multiple languages.
 */
import type { SupportedLanguage, TranslationStrings, LogicPattern, LogicStructure, EvaluatedCondition, AppliedTransformation, PatternInput, PatternOutput, NLPExplanation } from './types.js';
/**
 * LogicTranslator class for converting logic to natural language
 */
export declare class LogicTranslator {
    private language;
    private translations;
    private customTerminology;
    constructor(language?: SupportedLanguage, customTerminology?: Record<string, string>);
    /**
     * Get current language
     */
    getLanguage(): SupportedLanguage;
    /**
     * Set language
     */
    setLanguage(language: SupportedLanguage): void;
    /**
     * Get translations for current language
     */
    getTranslations(): TranslationStrings;
    /**
     * Translate a single term
     */
    translate(term: string): string;
    /**
     * Translate a logic pattern to natural language
     */
    translatePattern(pattern: LogicPattern): string;
    /**
     * Translate pattern type to description
     */
    private translatePatternType;
    /**
     * Describe complexity level
     */
    describeComplexity(structure: LogicStructure): string;
    /**
     * Describe inputs used
     */
    describeInputs(inputs: PatternInput[]): string;
    /**
     * Describe conditions evaluated
     */
    describeConditions(conditions: EvaluatedCondition[]): string;
    /**
     * Describe transformations applied
     */
    describeTransformations(transformations: AppliedTransformation[]): string;
    /**
     * Describe outputs produced
     */
    describeOutputs(outputs: PatternOutput[]): string;
    /**
     * Describe confidence level
     */
    describeConfidence(confidence: number): string;
    /**
     * Format a value for display
     */
    private formatValue;
    /**
     * Build a complete explanation for a pattern
     */
    buildExplanation(pattern: LogicPattern, _detailLevel?: 'brief' | 'normal' | 'detailed' | 'comprehensive'): NLPExplanation;
    /**
     * Build explanation steps
     */
    private buildSteps;
    /**
     * Build reasoning chain
     */
    private buildReasoningChain;
    /**
     * Build detailed explanation
     */
    private buildDetails;
    /**
     * Build confidence explanation
     */
    private buildConfidenceExplanation;
    /**
     * Get confidence level text
     */
    private getConfidenceLevel;
    /**
     * Get confidence interpretation
     */
    private getConfidenceInterpretation;
    /**
     * Extract insights from a pattern
     */
    private extractInsights;
}
export default LogicTranslator;
//# sourceMappingURL=LogicTranslator.d.ts.map