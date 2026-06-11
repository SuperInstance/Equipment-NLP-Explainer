"use strict";
/**
 * Equipment-NLP-Explainer — Tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("../index");
// Helper to create a simple pattern
function makePattern(overrides = {}) {
    const explainer = new index_1.NLPExplainer();
    return explainer.createPattern(overrides.id || 'test-1', overrides.name || 'Test Pattern', overrides.type || 'decision', [{ name: 'input1', value: 42, source: 'user' }], [{ name: 'output1', value: 'result', isFinal: true }], [{ expression: 'x > 10', result: true, reasoning: 'x is 42 which is greater than 10', confidence: 0.95 }], [{ type: 'filter', description: 'Filtered values above threshold', reasoning: 'Applied threshold filter' }], overrides.confidence ?? 0.9);
}
// ═══════════════════════════════════════════════════════════════════
// NLPExplainer Core Tests (14 tests)
// ═══════════════════════════════════════════════════════════════════
(0, vitest_1.describe)('NLPExplainer', () => {
    let explainer;
    (0, vitest_1.beforeEach)(() => { explainer = new index_1.NLPExplainer(); });
    (0, vitest_1.it)('should create with default options', () => {
        (0, vitest_1.expect)(explainer).toBeDefined();
        (0, vitest_1.expect)(explainer.getLanguage()).toBe('en');
    });
    (0, vitest_1.it)('should create with custom language', () => {
        const es = new index_1.NLPExplainer({ language: 'es' });
        (0, vitest_1.expect)(es.getLanguage()).toBe('es');
    });
    (0, vitest_1.it)('should list supported languages', () => {
        const langs = explainer.getSupportedLanguages();
        (0, vitest_1.expect)(langs).toContain('en');
        (0, vitest_1.expect)(langs).toContain('es');
        (0, vitest_1.expect)(langs).toContain('zh');
    });
    (0, vitest_1.it)('should change language', () => {
        explainer.setLanguage('zh');
        (0, vitest_1.expect)(explainer.getLanguage()).toBe('zh');
    });
    (0, vitest_1.it)('should explain a logic pattern', () => {
        const pattern = makePattern();
        const explanation = explainer.explain(pattern);
        (0, vitest_1.expect)(explanation).toBeDefined();
        (0, vitest_1.expect)(explanation.summary).toBeTruthy();
        (0, vitest_1.expect)(explanation.steps.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(explanation.language).toBe('en');
    });
    (0, vitest_1.it)('should include reasoning chain when requested', () => {
        const pattern = makePattern();
        const explanation = explainer.explain(pattern, { includeReasoningChain: true });
        (0, vitest_1.expect)(explanation.reasoningChain).toBeDefined();
        (0, vitest_1.expect)(explanation.reasoningChain.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should include audit trail when requested', () => {
        const pattern = makePattern();
        const explanation = explainer.explain(pattern, { includeAuditTrail: true });
        (0, vitest_1.expect)(explanation.auditTrail).toBeDefined();
    });
    (0, vitest_1.it)('should include confidence explanation', () => {
        const pattern = makePattern();
        const explanation = explainer.explain(pattern, { includeConfidenceExplanation: true });
        (0, vitest_1.expect)(explanation.confidenceExplanation).toBeDefined();
        (0, vitest_1.expect)(explanation.confidenceExplanation.rawScore).toBeGreaterThanOrEqual(0);
    });
    (0, vitest_1.it)('should explain a tile', () => {
        const pattern = makePattern();
        const result = explainer.explainTile('tile-1', 'MyTile', pattern);
        (0, vitest_1.expect)(result.tileId).toBe('tile-1');
        (0, vitest_1.expect)(result.tileName).toBe('MyTile');
        (0, vitest_1.expect)(result.explanation).toBeDefined();
        (0, vitest_1.expect)(result.pattern).toBeDefined();
    });
    (0, vitest_1.it)('should explain a decision', () => {
        const result = explainer.explainDecision('dec-1', 'Approve loan', 'Credit score above threshold', 0.85);
        (0, vitest_1.expect)(result.decisionId).toBe('dec-1');
        (0, vitest_1.expect)(result.decision).toBe('Approve loan');
        (0, vitest_1.expect)(result.reasoning).toBeTruthy();
        (0, vitest_1.expect)(result.confidence).toBeDefined();
    });
    (0, vitest_1.it)('should explain WHY', () => {
        const pattern = makePattern();
        const why = explainer.explainWhy(pattern);
        (0, vitest_1.expect)(typeof why).toBe('string');
        (0, vitest_1.expect)(why.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should explain WHAT', () => {
        const pattern = makePattern();
        const what = explainer.explainWhat(pattern);
        (0, vitest_1.expect)(typeof what).toBe('string');
        (0, vitest_1.expect)(what.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should explain HOW', () => {
        const pattern = makePattern();
        const how = explainer.explainHow(pattern);
        (0, vitest_1.expect)(typeof how).toBe('string');
        (0, vitest_1.expect)(how.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should create patterns correctly', () => {
        const pattern = makePattern();
        (0, vitest_1.expect)(pattern.id).toBe('test-1');
        (0, vitest_1.expect)(pattern.inputs.length).toBe(1);
        (0, vitest_1.expect)(pattern.outputs.length).toBe(1);
        (0, vitest_1.expect)(pattern.conditions.length).toBe(1);
        (0, vitest_1.expect)(pattern.transformations.length).toBe(1);
    });
});
// ═══════════════════════════════════════════════════════════════════
// ConfidenceExplainer Tests (10 tests)
// ═══════════════════════════════════════════════════════════════════
(0, vitest_1.describe)('ConfidenceExplainer', () => {
    let ce;
    (0, vitest_1.beforeEach)(() => { ce = new index_1.ConfidenceExplainer('en'); });
    (0, vitest_1.it)('should explain high confidence', () => {
        const result = ce.explainConfidence(0.95);
        (0, vitest_1.expect)(result.rawScore).toBe(0.95);
        (0, vitest_1.expect)(result.level).toBeTruthy();
        (0, vitest_1.expect)(result.description).toBeTruthy();
    });
    (0, vitest_1.it)('should explain low confidence', () => {
        const result = ce.explainConfidence(0.15);
        (0, vitest_1.expect)(result.rawScore).toBe(0.15);
        (0, vitest_1.expect)(result.level).toBeTruthy();
    });
    (0, vitest_1.it)('should explain moderate confidence', () => {
        const result = ce.explainConfidence(0.55);
        (0, vitest_1.expect)(result.rawScore).toBe(0.55);
    });
    (0, vitest_1.it)('should include confidence factors', () => {
        const factors = [
            { name: 'data-quality', description: 'Clean input data', impact: 'positive', magnitude: 0.3 },
            { name: 'model-age', description: 'Model needs retraining', impact: 'negative', magnitude: 0.2 },
        ];
        const result = ce.explainConfidence(0.8, factors);
        (0, vitest_1.expect)(result.factors).toBeDefined();
        (0, vitest_1.expect)(result.factors.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should provide interpretation', () => {
        const result = ce.explainConfidence(0.75);
        (0, vitest_1.expect)(result.interpretation).toBeTruthy();
    });
    (0, vitest_1.it)('should work in Spanish', () => {
        const ceES = new index_1.ConfidenceExplainer('es');
        const result = ceES.explainConfidence(0.9);
        (0, vitest_1.expect)(result).toBeDefined();
    });
    (0, vitest_1.it)('should work in Chinese', () => {
        const ceZH = new index_1.ConfidenceExplainer('zh');
        const result = ceZH.explainConfidence(0.9);
        (0, vitest_1.expect)(result).toBeDefined();
    });
    (0, vitest_1.it)('should handle zero confidence', () => {
        const result = ce.explainConfidence(0);
        (0, vitest_1.expect)(result.rawScore).toBe(0);
    });
    (0, vitest_1.it)('should handle perfect confidence', () => {
        const result = ce.explainConfidence(1.0);
        (0, vitest_1.expect)(result.rawScore).toBe(1.0);
    });
    (0, vitest_1.it)('should describe level for various scores', () => {
        const scores = [0.1, 0.3, 0.5, 0.7, 0.9];
        const levels = new Set(scores.map(s => ce.explainConfidence(s).level));
        // Should have different levels for different scores
        (0, vitest_1.expect)(levels.size).toBeGreaterThan(1);
    });
});
// ═══════════════════════════════════════════════════════════════════
// Convenience Functions Tests (6 tests)
// ═══════════════════════════════════════════════════════════════════
(0, vitest_1.describe)('Convenience Functions', () => {
    (0, vitest_1.it)('createExplainer should return NLPExplainer', () => {
        const e = (0, index_1.createExplainer)({ language: 'en' });
        (0, vitest_1.expect)(e).toBeDefined();
        (0, vitest_1.expect)(e instanceof index_1.NLPExplainer).toBe(true);
    });
    (0, vitest_1.it)('explain should return NLPExplanation', () => {
        const pattern = makePattern();
        const result = (0, index_1.explain)(pattern);
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result.summary).toBeTruthy();
    });
    (0, vitest_1.it)('explainConfidence should return ConfidenceExplanation', () => {
        const result = (0, index_1.explainConfidence)(0.85);
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result.rawScore).toBe(0.85);
    });
    (0, vitest_1.it)('explainConfidence with factors', () => {
        const result = (0, index_1.explainConfidence)(0.7, [
            { name: 'test', description: 'Test factor', impact: 'positive', magnitude: 0.1 },
        ]);
        (0, vitest_1.expect)(result).toBeDefined();
    });
    (0, vitest_1.it)('explainDecision should return DecisionExplanation', () => {
        const result = (0, index_1.explainDecision)('deploy', 'Tests pass', 0.9);
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result.decision).toBe('deploy');
    });
    (0, vitest_1.it)('explainDecision in Spanish', () => {
        const result = (0, index_1.explainDecision)('aprobar', 'Buen resultado', 0.85, 'es');
        (0, vitest_1.expect)(result).toBeDefined();
    });
});
//# sourceMappingURL=nlp.test.js.map