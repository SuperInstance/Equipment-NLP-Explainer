/**
 * NLPExplainer - Main Equipment Class
 *
 * Equipment that generates human-readable descriptions of cell logic and operations.
 * Transforms complex decision logic into natural language explanations that answer
 * not just WHAT was decided, but WHY it was decided.
 */
import type { Equipment, EquipmentSlot, OriginCore, Tile, CostMetrics, BenefitMetrics, TriggerThresholds, EquipmentDescription } from './types.js';
import type { SupportedLanguage, NLPExplanation, NLPExplainerOptions, LogicPattern, TileExplanation, DecisionExplanation, ChainExplanation, AuditTrailEntry, ConfidenceExplanation, ConfidenceFactor } from './types.js';
/**
 * NLPExplainer Equipment
 *
 * This equipment transforms cell logic into natural language descriptions,
 * explaining WHY decisions were made, mapping confidence scores to human-
 * understandable terms, and generating audit trails in prose form.
 */
export declare class NLPExplainer implements Equipment {
    readonly name = "NLPExplainer";
    readonly slot: EquipmentSlot;
    readonly version = "1.0.0";
    readonly description = "Generates human-readable descriptions of cell logic and operations";
    readonly cost: CostMetrics;
    readonly benefit: BenefitMetrics;
    readonly triggerThresholds: TriggerThresholds;
    private translator;
    private confidenceExplainer;
    private explanationCache;
    private options;
    constructor(options?: NLPExplainerOptions);
    /**
     * Equip the agent with this equipment
     */
    equip(_agent: OriginCore): Promise<void>;
    /**
     * Unequip the agent from this equipment
     */
    unequip(_agent: OriginCore): Promise<void>;
    /**
     * Get equipment description
     */
    describe(): EquipmentDescription;
    /**
     * Convert this equipment to a Tile
     */
    asTile(): Tile;
    /**
     * Get current language setting
     */
    getLanguage(): SupportedLanguage;
    /**
     * Set language for explanations
     */
    setLanguage(language: SupportedLanguage): void;
    /**
     * Get supported languages
     */
    getSupportedLanguages(): SupportedLanguage[];
    /**
     * Explain a logic pattern
     */
    explain(pattern: LogicPattern, options?: NLPExplainerOptions): NLPExplanation;
    /**
     * Explain a tile and its logic
     */
    explainTile(tileId: string, tileName: string, logic: LogicPattern): TileExplanation;
    /**
     * Explain a specific decision
     */
    explainDecision(decisionId: string, decision: string, reasoning: string, confidence: number, alternatives?: Array<{
        description: string;
        whyRejected: string;
    }>): DecisionExplanation;
    /**
     * Explain a reasoning chain
     */
    explainReasoningChain(chainId: string, steps: Array<{
        premise: string;
        conclusion: string;
        evidence?: string[];
        confidence: number;
    }>): ChainExplanation;
    /**
     * Generate audit trail in prose form
     */
    generateAuditTrail(pattern: LogicPattern): AuditTrailEntry[];
    /**
     * Explain a confidence score
     */
    explainConfidence(score: number, factors?: ConfidenceFactor[]): ConfidenceExplanation;
    /**
     * Compare two confidence scores
     */
    compareConfidence(score1: number, score2: number): string;
    /**
     * Explain WHY a decision was made
     */
    explainWhy(pattern: LogicPattern): string;
    /**
     * Explain WHAT was decided
     */
    explainWhat(pattern: LogicPattern): string;
    /**
     * Explain HOW the decision was made
     */
    explainHow(pattern: LogicPattern): string;
    /**
     * Create a logic pattern from components
     */
    createPattern(id: string, name: string, type: LogicPattern['type'], inputs: Array<{
        name: string;
        value: unknown;
        source: string;
    }>, outputs: Array<{
        name: string;
        value: unknown;
        isFinal?: boolean;
    }>, conditions: Array<{
        expression: string;
        result: boolean;
        reasoning: string;
        confidence: number;
    }>, transformations: Array<{
        type: string;
        description: string;
        reasoning: string;
    }>, confidence: number): LogicPattern;
    /**
     * Get cached explanation
     */
    getCachedExplanation(cacheKey: string): NLPExplanation | undefined;
    /**
     * Clear explanation cache
     */
    clearCache(): void;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        size: number;
        keys: string[];
    };
    private getCacheKey;
    private buildChainSummary;
}
export default NLPExplainer;
//# sourceMappingURL=NLPExplainer.d.ts.map