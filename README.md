# @superinstance/equipment-nlp-explainer

![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![SuperInstance](https://img.shields.io/badge/fleet-SuperInstance-orange)

Equipment that generates human-readable descriptions of cell logic and operations. Explains **WHY** a decision was made, not just **WHAT** was decided.

## Why This Exists

Cell logic produces boolean outcomes, confidence scores, and decision chains. Those outputs are meaningful to the system but opaque to humans. This equipment sits in the `EXPLANATION` slot and translates formal logic patterns into natural language — including reasoning chains, confidence breakdowns, and audit trails.

In the SuperInstance ecosystem where ternary decisions {-1, 0, +1} drive agent behavior, the NLP Explainer makes those decisions inspectable. When Spreadsheet-ai shows a user "Cell 23 is anomalous," this equipment generates the explanation: *why* it's anomalous, *what* conditions triggered it, and *how confident* the system is.

## Installation

```bash
npm install @superinstance/equipment-nlp-explainer
```

Requires TypeScript. Build with `npm run build`.

## Usage

### Quick explanation

```typescript
import { createExplainer, explain, explainConfidence } from '@superinstance/equipment-nlp-explainer';

// One-liner explanation
const explanation = explain({
  id: 'loan-1',
  name: 'Loan Approval',
  type: 'decision',
  structure: { complexity: 3, stepCount: 2, isNested: false, branchingFactor: 2 },
  inputs: [
    { id: 'i1', name: 'creditScore', value: 750, type: 'number', source: 'bureau', wasUsed: true },
    { id: 'i2', name: 'income', value: 85000, type: 'number', source: 'application', wasUsed: true },
  ],
  outputs: [
    { id: 'o1', name: 'approved', value: true, type: 'boolean', isFinal: true },
  ],
  conditions: [
    {
      id: 'c1', expression: 'creditScore >= 700', left: 'creditScore',
      operator: '>=', right: '700', result: true,
      reasoning: 'Credit score 750 exceeds minimum 700', confidence: 0.95,
    },
    {
      id: 'c2', expression: 'income >= 50000', left: 'income',
      operator: '>=', right: '50000', result: true,
      reasoning: 'Income $85,000 meets $50,000 threshold', confidence: 0.98,
    },
  ],
  transformations: [],
  confidence: 0.92,
});

console.log(explanation.summary);
// "This is a decision-making process involving 2 steps..."
```

### WHY / WHAT / HOW breakdown

```typescript
const explainer = createExplainer({ language: 'en' });

// Separate explanations by question type
const why = explainer.explainWhy(pattern);   // Why was this decided?
const what = explainer.explainWhat(pattern);  // What was decided?
const how = explainer.explainHow(pattern);    // How was it decided?
```

### Confidence explanation

```typescript
const conf = explainer.explainConfidence(0.92);
console.log(conf.level);
// "high confidence"
console.log(conf.interpretation);
// "A 92% confidence indicates the decision is highly reliable..."

// With contributing factors
const confDetailed = explainer.explainConfidence(0.75, [
  { name: 'data_quality', contribution: 0.3, description: 'Clean input data' },
  { name: 'model_certainty', contribution: 0.45, description: 'Strong model output' },
]);
```

### Multi-language support

```typescript
const explainerEN = createExplainer({ language: 'en' });
const explainerES = createExplainer({ language: 'es' });
const explainerZH = createExplainer({ language: 'zh' });

explainerEN.explainConfidence(0.85).level;  // "high confidence"
explainerES.explainConfidence(0.85).level;  // "alta confianza"
explainerZH.explainConfidence(0.85).level;  // "高置信度"

// Switch at runtime
explainer.setLanguage('es');
```

### Reasoning chain explanation

```typescript
const chain = explainer.explainReasoningChain('risk-analysis', [
  {
    premise: 'Customer has 5+ years of history',
    conclusion: 'Customer is established',
    evidence: ['Account created 2019', 'Consistent activity'],
    confidence: 0.92,
  },
  {
    premise: 'Customer is established',
    conclusion: 'Lower churn risk',
    evidence: ['Established customers have 15% churn vs 45% for new'],
    confidence: 0.88,
  },
]);

console.log(chain.summary);
// "Starting from 'Customer has 5+ years of history', after 2 reasoning steps,
//  we conclude: Lower churn risk"
```

### Audit trail generation

```typescript
const trail = explainer.generateAuditTrail(pattern);
// Each entry: { id, timestamp, action, actor, description, result, confidence }
```

## API Reference

### NLPExplainer (Equipment)

```typescript
class NLPExplainer implements Equipment {
  readonly name: string = 'NLPExplainer';
  readonly slot: EquipmentSlot = 'EXPLANATION';
  readonly version: string = '1.0.0';
  readonly cost: CostMetrics;        // 30MB, 10% CPU, 200ms latency
  readonly benefit: BenefitMetrics;  // +0.05 accuracy, +0.1 confidence
  readonly triggerThresholds: TriggerThresholds;
  
  constructor(options?: NLPExplainerOptions)
  
  explain(pattern: LogicPattern, options?: NLPExplainerOptions): NLPExplanation
  explainWhy(pattern: LogicPattern): string
  explainWhat(pattern: LogicPattern): string
  explainHow(pattern: LogicPattern): string
  explainConfidence(score: number, factors?: ConfidenceFactor[]): ConfidenceExplanation
  explainDecision(id, decision, reasoning, confidence, alternatives): DecisionExplanation
  explainReasoningChain(chainId, steps): ChainExplanation
  generateAuditTrail(pattern: LogicPattern): AuditTrailEntry[]
  
  setLanguage(lang: SupportedLanguage): void
  describe(): EquipmentDescription
  asTile(): Tile
}
```

### NLPExplainerOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `language` | `'en'` \| `'es'` \| `'zh'` | `'en'` | Output language |
| `detailLevel` | `'brief'` \| `'normal'` \| `'detailed'` \| `'comprehensive'` | `'normal'` | Explanation depth |
| `includeReasoningChain` | `boolean` | `true` | Include reasoning steps |
| `includeAuditTrail` | `boolean` | `true` | Include audit trail |
| `includeConfidenceExplanation` | `boolean` | `true` | Include confidence breakdown |
| `maxLength` | `number` | `5000` | Max explanation length |
| `customTerminology` | `Record<string, string>` | `{}` | Custom term translations |
| `targetAudience` | `'technical'` \| `'business'` \| `'general'` \| `'expert'` | `'general'` | Audience level |

### LogicTranslator

```typescript
class LogicTranslator {
  constructor(language?: SupportedLanguage)
  translatePattern(pattern: LogicPattern): string
}
```

### ConfidenceExplainer

```typescript
class ConfidenceExplainer {
  constructor(language?: SupportedLanguage)
  explainConfidence(score: number, factors?: ConfidenceFactor[]): ConfidenceExplanation
}
```

### Confidence Level Mapping

| Score | Level | Interpretation |
|-------|-------|----------------|
| 0.90–1.00 | Very High | Near-absolute certainty |
| 0.75–0.89 | High | Small margin of uncertainty |
| 0.60–0.74 | Moderate | Meaningful uncertainty |
| 0.40–0.59 | Low | Treat as suggestion |
| 0.00–0.39 | Very Low | Manual review required |

### Key Types

```typescript
interface LogicPattern {
  id: string;
  name: string;
  type: 'decision' | 'transformation' | 'validation' | 'aggregation' |
        'branching' | 'iteration' | 'composition' | 'fallback';
  structure: LogicStructure;
  inputs: PatternInput[];
  outputs: PatternOutput[];
  conditions: EvaluatedCondition[];
  transformations: AppliedTransformation[];
  confidence: number;
}

interface NLPExplanation {
  id: string;
  language: SupportedLanguage;
  summary: string;
  details: ExplanationDetails;
  steps: ExplanationStep[];
  reasoningChain: ReasoningStep[];
  confidenceExplanation: ConfidenceExplanation;
  auditTrail: AuditTrailEntry[];
  insights: string[];
}
```

## Architecture

```
Equipment-NLP-Explainer/
├── src/
│   ├── index.ts               # Public API + factory functions
│   ├── NLPExplainer.ts        # Main Equipment class (EXPLANATION slot)
│   ├── LogicTranslator.ts     # Formal logic → natural language
│   ├── ConfidenceExplainer.ts # Numeric scores → human terms
│   ├── types.ts               # All interfaces and type definitions
│   └── __tests__/
│       └── nlp.test.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

```
┌──────────────────────────────────────────┐
│            NLPExplainer (Equipment)       │
│              slot: EXPLANATION            │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────┐ ┌────────────────┐   │
│  │LogicTranslator │ │ConfidenceExpl- │   │
│  │pattern → prose │ │ainer           │   │
│  │                │ │score → level   │   │
│  └───────┬────────┘ └───────┬────────┘   │
│          │                  │            │
│          ↓                  ↓            │
│  ┌─────────────────────────────────┐     │
│  │       NLPExplanation            │     │
│  │  summary + details + steps      │     │
│  │  reasoningChain + auditTrail    │     │
│  │  confidenceExplanation          │     │
│  └─────────────────────────────────┘     │
│                                          │
└──────────────────────────────────────────┘
```

## Related SuperInstance Crates

- **Spreadsheet-ai** — Uses NLP Explainer for the NL interface to ternary cells
- **linguistic-polyformalism-shell** — Provides different thinking styles for explanation modes
- **starter-agent** — Defines the `Equipment` interface this package implements
- **ternary-agent** — Agents whose decisions get explained by this equipment
- **dissertation-engine** — Consumes audit trails for formal verification

## License

MIT © SuperInstance Team
