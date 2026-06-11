/**
 * ConfidenceExplainer - Explains confidence scores in plain terms
 *
 * This module translates numeric confidence scores into human-readable
 * explanations with context about what factors influenced the score.
 */
import type { SupportedLanguage, ConfidenceExplanation, ConfidenceFactor } from './types.js';
/**
 * ConfidenceExplainer class for explaining confidence scores
 */
export declare class ConfidenceExplainer {
    private language;
    private thresholds;
    private factorTemplates;
    constructor(language?: SupportedLanguage);
    /**
     * Get current language
     */
    getLanguage(): SupportedLanguage;
    /**
     * Set language
     */
    setLanguage(language: SupportedLanguage): void;
    /**
     * Explain a confidence score
     */
    explainConfidence(score: number, factors?: ConfidenceFactor[]): ConfidenceExplanation;
    /**
     * Get a quick level description for a score
     */
    getLevel(score: number): string;
    /**
     * Get recommendation for a score
     */
    getRecommendation(score: number): string;
    /**
     * Compare two confidence scores
     */
    compareScores(score1: number, score2: number): string;
    /**
     * Explain multiple confidence factors
     */
    explainFactors(factors: ConfidenceFactor[]): string;
    /**
     * Generate confidence breakdown
     */
    generateBreakdown(score: number, componentScores: Record<string, number>): string;
    /**
     * Find the appropriate threshold for a score
     */
    private findThreshold;
    /**
     * Build description for a confidence score
     */
    private buildDescription;
    /**
     * Build interpretation for a confidence score
     */
    private buildInterpretation;
    /**
     * Infer factors from a confidence score
     */
    private inferFactors;
    /**
     * Create a factor description
     */
    createFactor(factorType: string, impact: 'positive' | 'negative' | 'neutral', magnitude: number, customDescription?: string): ConfidenceFactor;
    /**
     * Aggregate multiple confidence scores
     */
    aggregateScores(scores: number[], method?: 'average' | 'min' | 'max' | 'weighted'): number;
    /**
     * Explain why a score changed
     */
    explainScoreChange(oldScore: number, newScore: number, reason: string): string;
}
export default ConfidenceExplainer;
//# sourceMappingURL=ConfidenceExplainer.d.ts.map