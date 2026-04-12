/**
 * Equipment-NLP-Explainer — Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NLPExplainer, ConfidenceExplainer, LogicTranslator, createExplainer, explain, explainConfidence, explainDecision } from '../index';
import type { LogicPattern, ConfidenceFactor } from '../index';

// Helper to create a simple pattern
function makePattern(overrides: Partial<LogicPattern> = {}): LogicPattern {
  const explainer = new NLPExplainer();
  return explainer.createPattern(
    overrides.id || 'test-1',
    overrides.name || 'Test Pattern',
    (overrides as any).type || 'decision',
    [{ name: 'input1', value: 42, source: 'user' }],
    [{ name: 'output1', value: 'result', isFinal: true }],
    [{ expression: 'x > 10', result: true, reasoning: 'x is 42 which is greater than 10', confidence: 0.95 }],
    [{ type: 'filter', description: 'Filtered values above threshold', reasoning: 'Applied threshold filter' }],
    overrides.confidence ?? 0.9
  );
}

// ═══════════════════════════════════════════════════════════════════
// NLPExplainer Core Tests (14 tests)
// ═══════════════════════════════════════════════════════════════════

describe('NLPExplainer', () => {
  let explainer: NLPExplainer;
  beforeEach(() => { explainer = new NLPExplainer(); });

  it('should create with default options', () => {
    expect(explainer).toBeDefined();
    expect(explainer.getLanguage()).toBe('en');
  });

  it('should create with custom language', () => {
    const es = new NLPExplainer({ language: 'es' });
    expect(es.getLanguage()).toBe('es');
  });

  it('should list supported languages', () => {
    const langs = explainer.getSupportedLanguages();
    expect(langs).toContain('en');
    expect(langs).toContain('es');
    expect(langs).toContain('zh');
  });

  it('should change language', () => {
    explainer.setLanguage('zh');
    expect(explainer.getLanguage()).toBe('zh');
  });

  it('should explain a logic pattern', () => {
    const pattern = makePattern();
    const explanation = explainer.explain(pattern);
    expect(explanation).toBeDefined();
    expect(explanation.summary).toBeTruthy();
    expect(explanation.steps.length).toBeGreaterThan(0);
    expect(explanation.language).toBe('en');
  });

  it('should include reasoning chain when requested', () => {
    const pattern = makePattern();
    const explanation = explainer.explain(pattern, { includeReasoningChain: true });
    expect(explanation.reasoningChain).toBeDefined();
    expect(explanation.reasoningChain.length).toBeGreaterThan(0);
  });

  it('should include audit trail when requested', () => {
    const pattern = makePattern();
    const explanation = explainer.explain(pattern, { includeAuditTrail: true });
    expect(explanation.auditTrail).toBeDefined();
  });

  it('should include confidence explanation', () => {
    const pattern = makePattern();
    const explanation = explainer.explain(pattern, { includeConfidenceExplanation: true });
    expect(explanation.confidenceExplanation).toBeDefined();
    expect(explanation.confidenceExplanation.rawScore).toBeGreaterThanOrEqual(0);
  });

  it('should explain a tile', () => {
    const pattern = makePattern();
    const result = explainer.explainTile('tile-1', 'MyTile', pattern);
    expect(result.tileId).toBe('tile-1');
    expect(result.tileName).toBe('MyTile');
    expect(result.explanation).toBeDefined();
    expect(result.pattern).toBeDefined();
  });

  it('should explain a decision', () => {
    const result = explainer.explainDecision('dec-1', 'Approve loan', 'Credit score above threshold', 0.85);
    expect(result.decisionId).toBe('dec-1');
    expect(result.decision).toBe('Approve loan');
    expect(result.reasoning).toBeTruthy();
    expect(result.confidence).toBeDefined();
  });

  it('should explain WHY', () => {
    const pattern = makePattern();
    const why = explainer.explainWhy(pattern);
    expect(typeof why).toBe('string');
    expect(why.length).toBeGreaterThan(0);
  });

  it('should explain WHAT', () => {
    const pattern = makePattern();
    const what = explainer.explainWhat(pattern);
    expect(typeof what).toBe('string');
    expect(what.length).toBeGreaterThan(0);
  });

  it('should explain HOW', () => {
    const pattern = makePattern();
    const how = explainer.explainHow(pattern);
    expect(typeof how).toBe('string');
    expect(how.length).toBeGreaterThan(0);
  });

  it('should create patterns correctly', () => {
    const pattern = makePattern();
    expect(pattern.id).toBe('test-1');
    expect(pattern.inputs.length).toBe(1);
    expect(pattern.outputs.length).toBe(1);
    expect(pattern.conditions.length).toBe(1);
    expect(pattern.transformations.length).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════
// ConfidenceExplainer Tests (10 tests)
// ═══════════════════════════════════════════════════════════════════

describe('ConfidenceExplainer', () => {
  let ce: ConfidenceExplainer;
  beforeEach(() => { ce = new ConfidenceExplainer('en'); });

  it('should explain high confidence', () => {
    const result = ce.explainConfidence(0.95);
    expect(result.rawScore).toBe(0.95);
    expect(result.level).toBeTruthy();
    expect(result.description).toBeTruthy();
  });

  it('should explain low confidence', () => {
    const result = ce.explainConfidence(0.15);
    expect(result.rawScore).toBe(0.15);
    expect(result.level).toBeTruthy();
  });

  it('should explain moderate confidence', () => {
    const result = ce.explainConfidence(0.55);
    expect(result.rawScore).toBe(0.55);
  });

  it('should include confidence factors', () => {
    const factors: ConfidenceFactor[] = [
      { name: 'data-quality', description: 'Clean input data', impact: 'positive', magnitude: 0.3 },
      { name: 'model-age', description: 'Model needs retraining', impact: 'negative', magnitude: 0.2 },
    ];
    const result = ce.explainConfidence(0.8, factors);
    expect(result.factors).toBeDefined();
    expect(result.factors.length).toBeGreaterThan(0);
  });

  it('should provide interpretation', () => {
    const result = ce.explainConfidence(0.75);
    expect(result.interpretation).toBeTruthy();
  });

  it('should work in Spanish', () => {
    const ceES = new ConfidenceExplainer('es');
    const result = ceES.explainConfidence(0.9);
    expect(result).toBeDefined();
  });

  it('should work in Chinese', () => {
    const ceZH = new ConfidenceExplainer('zh');
    const result = ceZH.explainConfidence(0.9);
    expect(result).toBeDefined();
  });

  it('should handle zero confidence', () => {
    const result = ce.explainConfidence(0);
    expect(result.rawScore).toBe(0);
  });

  it('should handle perfect confidence', () => {
    const result = ce.explainConfidence(1.0);
    expect(result.rawScore).toBe(1.0);
  });

  it('should describe level for various scores', () => {
    const scores = [0.1, 0.3, 0.5, 0.7, 0.9];
    const levels = new Set(scores.map(s => ce.explainConfidence(s).level));
    // Should have different levels for different scores
    expect(levels.size).toBeGreaterThan(1);
  });
});

// ═══════════════════════════════════════════════════════════════════
// Convenience Functions Tests (6 tests)
// ═══════════════════════════════════════════════════════════════════

describe('Convenience Functions', () => {
  it('createExplainer should return NLPExplainer', () => {
    const e = createExplainer({ language: 'en' });
    expect(e).toBeDefined();
    expect(e instanceof NLPExplainer).toBe(true);
  });

  it('explain should return NLPExplanation', () => {
    const pattern = makePattern();
    const result = explain(pattern);
    expect(result).toBeDefined();
    expect(result.summary).toBeTruthy();
  });

  it('explainConfidence should return ConfidenceExplanation', () => {
    const result = explainConfidence(0.85);
    expect(result).toBeDefined();
    expect(result.rawScore).toBe(0.85);
  });

  it('explainConfidence with factors', () => {
    const result = explainConfidence(0.7, [
      { name: 'test', description: 'Test factor', impact: 'positive', magnitude: 0.1 },
    ]);
    expect(result).toBeDefined();
  });

  it('explainDecision should return DecisionExplanation', () => {
    const result = explainDecision('deploy', 'Tests pass', 0.9);
    expect(result).toBeDefined();
    expect(result.decision).toBe('deploy');
  });

  it('explainDecision in Spanish', () => {
    const result = explainDecision('aprobar', 'Buen resultado', 0.85, 'es');
    expect(result).toBeDefined();
  });
});
