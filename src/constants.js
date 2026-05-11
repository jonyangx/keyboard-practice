// Finger zones mapping
const FINGER_ZONES = {
  lp: { name: '左小指 L-Pinky',  keys: ['a','q','z','1'], color: '#ff6b6b' },
  lr: { name: '左无名指 L-Ring',  keys: ['s','w','x','2'], color: '#ffa06b' },
  lm: { name: '左中指 L-Mid',    keys: ['d','e','c','3'], color: '#ffd93d' },
  li: { name: '左食指 L-Index',  keys: ['f','r','v','4','5','g','t','b'], color: '#53d769' },
  ri: { name: '右食指 R-Index',  keys: ['h','y','n','6','7','j','u','m'], color: '#4ecdc4' },
  rm: { name: '右中指 R-Mid',    keys: ['k','i',',','8'], color: '#45b7d1' },
  rr: { name: '右无名指 R-Ring',  keys: ['l','o','.','9'], color: '#9b59b6' },
  rp: { name: '右小指 R-Pinky',  keys: [';','p','/','0'], color: '#e84393' },
};

// Build reverse map: key → { zone, color, name }
const KEY_MAP = {};
for (const [zone, data] of Object.entries(FINGER_ZONES)) {
  for (const key of data.keys) {
    KEY_MAP[key] = { zone, color: data.color, name: data.name };
  }
}

// Lesson definitions
const LESSONS = [
  { id: 'home-row',   name: '基准键 Home Row',       keys: ['a','s','d','f','j','k','l',';'],              duration: 60, speed: 1.5, bg1: '#2d5a3d', bg2: '#3a7a4a', ground: '#53d769' },
  { id: 'home-top',   name: '基准+上排 Top+Home',     keys: ['a','s','d','f','j','k','l',';','e','i'],      duration: 60, speed: 1.6, bg1: '#3a2d5a', bg2: '#4a3a7a', ground: '#9b59b6' },
  { id: 'top-row',    name: '上排键 Top Row',          keys: ['q','w','e','r','t','y','u','i','o','p'],      duration: 60, speed: 1.7, bg1: '#5a3a2d', bg2: '#7a4a3a', ground: '#ffa06b' },
  { id: 'home-top-full', name: '基准+上排综合 Full',   keys: ['a','s','d','f','j','k','l',';','q','w','e','r','t','y','u','i','o','p'], duration: 70, speed: 1.8, bg1: '#2d4a5a', bg2: '#3a6a7a', ground: '#45b7d1' },
  { id: 'bottom-row', name: '下排键 Bottom Row',       keys: ['z','x','c','v','b','n','m',',','.','/'],     duration: 60, speed: 1.7, bg1: '#5a2d3a', bg2: '#7a3a4a', ground: '#e84393' },
  { id: 'all-rows',   name: '全键盘 Full Keyboard',    keys: ['a','s','d','f','j','k','l',';','q','w','e','r','t','y','u','i','o','p','z','x','c','v','b','n','m',',','.','/'], duration: 90, speed: 2.0, bg1: '#1a3a1a', bg2: '#2a5a2a', ground: '#00d2ff' },
];

// Word lists for vocabulary practice mode
const WORD_LISTS = {
  ielts: {
    name: '雅思 IELTS',
    color: '#ff6b6b',
    words: [
      'abandon', 'ability', 'able', 'abnormal', 'aboard', 'abolish', 'absence', 'absolute', 'absorb', 'abstract',
      'absurd', 'abundant', 'academic', 'accelerate', 'accept', 'access', 'accident', 'accommodate', 'accompany', 'account',
      'accurate', 'achieve', 'acid', 'acknowledge', 'acquire', 'adapt', 'adequate', 'adjust', 'administer', 'adolescent',
      'advocate', 'aesthetic', 'affect', 'affiliate', 'affirm', 'afford', 'aggregate', 'aggressive', 'agriculture', 'allocate',
      'alter', 'alternative', 'amateur', 'ambiguous', 'ambition', 'ambitious', 'amend', 'ample', 'analyze', 'ancestor',
      'ancient', 'annual', 'anticipate', 'apparent', 'appeal', 'appreciate', 'approach', 'appropriate', 'approximate', 'arbitrary',
      'architecture', 'arena', 'argument', 'arise', 'arouse', 'arrange', 'articulate', 'artificial', 'artistic', 'aspect',
      'assemble', 'assess', 'asset', 'assign', 'assimilate', 'assist', 'associate', 'assume', 'assure', 'atmosphere',
      'attach', 'attain', 'attempt', 'attend', 'attitude', 'attorney', 'attribute', 'auction', 'audit', 'author',
      'authority', 'automatic', 'autonomous', 'available', 'average', 'aware', 'barrier', 'battery', 'behalf', 'behave',
      'behalf', 'behave', 'belief', 'beneficial', 'benefit', 'bias', 'bid', 'blame', 'bond', 'boost',
      'boundary', 'breach', 'brief', 'budget', 'bulk', 'calculate', 'capacity', 'capture', 'career', 'category',
      'cease', 'challenge', 'channel', 'chapter', 'character', 'characteristic', 'charge', 'chronic', 'circumstance', 'civil',
      'claim', 'clarify', 'classic', 'client', 'cluster', 'code', 'coherent', 'coincide', 'collapse', 'combat',
      'combine', 'command', 'comment', 'commit', 'commodity', 'communicate', 'community', 'company', 'comparative', 'compare',
      'compel', 'compensate', 'competence', 'competition', 'compile', 'complaint', 'complement', 'complex', 'component', 'compose',
      'compound', 'comprehensive', 'comprise', 'compute', 'conceive', 'concentrate', 'concept', 'concern', 'conclude', 'concrete',
      'condemn', 'conduct', 'confer', 'confine', 'confirm', 'conflict', 'conform', 'confuse', 'congress', 'consensus',
      'consequence', 'conservative', 'considerable', 'consist', 'consistent', 'consolidate', 'constant', 'construct', 'consult', 'consume',
      'contaminate', 'contemporary', 'contend', 'context', 'continual', 'contract', 'contrast', 'contribute', 'controversy', 'convention',
      'convert', 'convey', 'convince', 'cooperate', 'coordinate', 'core', 'corporate', 'correspond', 'council', 'counter',
      'coverage', 'crack', 'craft', 'create', 'credible', 'criteria', 'crucial', 'culture', 'currency', 'cycle',
      'data', 'debate', 'decade', 'decline', 'decorate', 'dedicate', 'deem', 'defeat', 'defend', 'deficit',
      'define', 'delegate', 'deliberate', 'deliver', 'demand', 'democratic', 'demonstrate', 'denial', 'denote', 'dense',
      'depart', 'dependent', 'depict', 'deposit', 'derive', 'deserve', 'desirable', 'destination', 'destroy', 'detail',
      'detect', 'devise', 'diagnose', 'diameter', 'differ', 'differentiate', 'dimension', 'diminish', 'discipline', 'discrete',
      'dispute', 'distinct', 'distort', 'distribute', 'district', 'diverse', 'document', 'domain', 'domestic', 'dominant',
      'donate', 'dramatic', 'duration', 'dynamic', 'economic', 'edit', 'educate', 'effect', 'efficiency', 'elaborate',
      'element', 'eliminate', 'embody', 'embrace', 'emerge', 'emission', 'emotion', 'emphasis', 'empirical', 'enable',
      'encounter', 'endure', 'enforce', 'enhance', 'enormous', 'ensure', 'entitle', 'entity', 'environment', 'episode',
      'equation', 'equilibrium', 'equip', 'equivalent', 'eradicate', 'escalate', 'essence', 'estimate', 'ethnic', 'evaluate',
      'eventual', 'evidence', 'evident', 'evolve', 'exceed', 'exception', 'exclude', 'execute', 'exhibit', 'exile',
      'expand', 'expense', 'explicit', 'exploit', 'explore', 'expose', 'external', 'fabric', 'facilitate', 'factor',
      'factual', 'feasible', 'feature', 'federal', 'feedback', 'fiction', 'figure', 'file', 'finance', 'finite',
      'flavor', 'flexibility', 'fluctuate', 'focus', 'forbid', 'format', 'former', 'formula', 'fortune', 'foundation',
      'fraction', 'fragment', 'framework', 'frank', 'frequency', 'frustrate', 'function', 'fundamental', 'furthermore', 'gender',
      'generate', 'generation', 'genetic', 'genuine', 'geographic', 'global', 'goal', 'govern', 'grant', 'graph',
      'habitat', 'halt', 'harmony', 'hazard', 'heritage', 'hierarchical', 'highlight', 'highlight', 'historic', 'hypothesis',
      'identical', 'identify', 'ideology', 'ignorance', 'illustrate', 'image', 'immense', 'implement', 'implicit', 'impose',
      'impress', 'improvement', 'incident', 'incline', 'incompatible', 'incorporate', 'increase', 'indicate', 'indirect', 'individual',
      'induce', 'inference', 'influence', 'inform', 'infrastructure', 'inherent', 'inhibit', 'initial', 'inject', 'innovation',
      'input', 'inquiry', 'insight', 'inspect', 'inspire', 'install', 'instance', 'institution', 'instruction', 'intact',
      'integral', 'integrate', 'intellectual', 'intelligent', 'intense', 'interact', 'interest', 'interior', 'intermediate', 'internal',
      'interpret', 'interval', 'intervene', 'intrinsic', 'investigate', 'investment', 'invoke', 'involve', 'irritate', 'isolate',
      'junction', 'justify', 'knowledge', 'label', 'labor', 'lapse', 'lateral', 'launch', 'layer', 'layout', 'leadership',
      'legislation', 'legitimate', 'liberal', 'licence', 'likelihood', 'limitation', 'link', 'literal', 'locate', 'logic',
      'logical', 'maintain', 'major', 'manifest', 'manipulate', 'margin', 'marine', 'massive', 'mature', 'maximize', 'mechanism',
      'media', 'median', 'mediate', 'medical', 'medium', 'mental', 'method', 'migrate', 'military', 'minimal',
      'minimize', 'minimum', 'minor', 'mission', 'modify', 'monitor', 'moral', 'motivate', 'multiple', 'mutual',
      'namely', 'narrative', 'navigate', 'negative', 'negotiate', 'network', 'neutral', 'norm', 'normal', 'notable',
      'notion', 'novel', 'numerous', 'objective', 'obligation', 'observation', 'observe', 'obstacle', 'obtain', 'occupy',
      'occurrence', 'offset', 'ongoing', 'operate', 'opponent', 'opportunity', 'oppose', 'option', 'organic', 'orient',
      'origin', 'outcomes', 'output', 'overall', 'overlap', 'paradigm', 'parallel', 'parameter', 'participate', 'partner',
      'passive', 'perceive', 'permanent', 'persist', 'perspective', 'phase', 'phenomenon', 'philosophy', 'physical', 'planet',
      'policy', 'political', 'portion', 'positive', 'potential', 'poverty', 'practical', 'precise', 'predict', 'predominant',
      'preliminary', 'premise', 'premium', 'prepare', 'present', 'preserve', 'prestige', 'previous', 'primarily', 'principal',
      'principle', 'priority', 'proactive', 'probable', 'procedure', 'proceed', 'process', 'profile', 'profit', 'profound',
      'progress', 'project', 'prolong', 'prominent', 'promote', 'proportion', 'proposal', 'prosecute', 'prospect', 'protocol',
      'province', 'provision', 'psychology', 'publication', 'publicity', 'pursue', 'qualitative', 'quantify', 'quantity', 'quote',
      'radical', 'random', 'range', 'rank', 'ratio', 'reactor', 'realistic', 'rebel', 'recall', 'recession',
      'recipient', 'reckon', 'recognition', 'recommend', 'reconstruct', 'recovery', 'recycle', 'reference', 'refine', 'reflect',
      'reform', 'refugee', 'regime', 'region', 'register', 'regulate', 'reinforce', 'reject', 'relax', 'release',
      'relevant', 'reliable', 'relief', 'religion', 'reluctant', 'remain', 'remark', 'remedy', 'remind', 'remote',
      'remove', 'render', 'renew', 'replace', 'represent', 'reproduce', 'request', 'require', 'research', 'resident',
      'resolve', 'resource', 'respond', 'restore', 'restrict', 'result', 'retain', 'retire', 'retreat', 'reveal',
      'revenue', 'reverse', 'revise', 'revival', 'revolution', 'rigid', 'role', 'route', 'rubbish', 'sacrifice',
      'sample', 'sanction', 'satisfaction', 'satisfy', 'scale', 'scenario', 'schedule', 'scheme', 'scope', 'score',
      'scrutiny', 'sector', 'secure', 'seek', 'segment', 'seminar', 'senior', 'sensitive', 'sequence', 'series',
      'session', 'setting', 'severity', 'shed', 'shift', 'shock', 'significant', 'similar', 'simulate', 'situation',
      'sketch', 'species', 'specific', 'specify', 'sponsor', 'spontaneous', 'spot', 'stability', 'stable', 'statistical',
      'status', 'steadily', 'stimulate', 'strategy', 'stress', 'structure', 'studio', 'submit', 'subordinate', 'subsequent',
      'subsidy', 'substance', 'substitute', 'subtle', 'suburb', 'successive', 'sufficient', 'summarize', 'superior', 'supplement',
      'suppose', 'suppress', 'survey', 'survival', 'survive', 'susceptible', 'suspend', 'sustain', 'symbol', 'sympathy',
      'systematic', 'tactic', 'target', 'technical', 'technique', 'technology', 'temporary', 'tendency', 'terminate', 'territory',
      'testify', 'therapy', 'thermal', 'thesis', 'thorough', 'thread', 'threat', 'timeline', 'tolerance', 'tone',
      'topic', 'toxic', 'trace', 'track', 'tradition', 'traffic', 'trail', 'transfer', 'transform', 'transit',
      'transition', 'translate', 'transmit', 'transparent', 'transport', 'tremendous', 'trend', 'trigger', 'trigger', 'triumph',
      'ultimate', 'undergo', 'underline', 'underlying', 'undermine', 'undertake', 'unequal', 'uniform', 'union', 'unique',
      'unlike', 'update', 'upgrade', 'utilize', 'utter', 'vacant', 'vague', 'valid', 'validate', 'valuable',
      'variable', 'variant', 'variation', 'vehicle', 'venture', 'verify', 'version', 'via', 'violate', 'virtual',
      'visible', 'vision', 'visual', 'volume', 'voluntary', 'wage', 'wander', 'warrant', 'wealth', 'welfare',
      'widespread', 'withdraw', 'witness', 'witness', 'workforce', 'worth', 'worthwhile', 'worthy', 'yield'
    ]
  },
  gre: {
    name: 'GRE',
    color: '#ffa06b',
    words: [
      'aberrant', 'abeyance', 'abscond', 'abstemious', 'abstinence', 'abysmal', 'accolade', 'acerbic', 'acquiesce', 'acrimony',
      'adamant', 'admonish', 'adulation', 'adversary', 'advert', 'aesthetic', 'affable', 'aggrandize', 'alacrity', 'amalgamate',
      'ambivalent', 'ameliorate', 'anachronism', 'anathema', 'ancillary', 'anomaly', 'antipathy', 'apathy', 'appease', 'approbation',
      'arbiter', 'archaic', 'arduous', 'artless', 'ascetic', 'assuage', 'astute', 'atone', 'audacious', 'austere',
      'avarice', 'banal', 'beguile', 'belligerent', 'beneficent', 'benevolent', 'bombastic', 'boorish', 'burgeon', 'burnish',
      'cacophony', 'cajole', 'candor', 'capitulate', 'capricious', 'caricature', 'cater', 'chicanery', 'coalesce', 'coerce',
      'cogent', 'commensurate', 'compendium', 'complacent', 'complicit', 'conciliatory', 'concur', 'condone', 'conflagration', 'connoisseur',
      'consternation', 'contemplate', 'contentious', 'contravene', 'conundrum', 'conventional', 'convoluted', 'copious', 'corroborate', 'credulous',
      'culpable', 'cursory', 'dearth', 'debacle', 'decorum', 'deference', 'defunct', 'deleterious', 'delineate', 'demagogue',
      'demeanor', 'denigrate', 'denouement', 'deprecate', 'derogatory', 'desiccate', 'despondent', 'destitute', 'desultory', 'deterrent'
    ]
  },
  cet4: {
    name: '大学英语四级 CET-4',
    color: '#53d769',
    words: [
      'abandon', 'ability', 'able', 'abnormal', 'aboard', 'absence', 'absolute', 'absorb', 'abstract', 'abundant',
      'academic', 'accept', 'access', 'accident', 'accompany', 'account', 'accurate', 'achieve', 'acid', 'acquire',
      'adapt', 'adequate', 'adjust', 'administration', 'admire', 'admit', 'adopt', 'adult', 'advance', 'adventure',
      'advice', 'advise', 'affair', 'affect', 'afford', 'afraid', 'agency', 'agenda', 'agent', 'agree',
      'agreement', 'ahead', 'aid', 'aim', 'air', 'aircraft', 'airline', 'airport', 'alarm', 'album',
      'alcohol', 'alike', 'alive', 'allow', 'alloy', 'almost', 'alone', 'along', 'already', 'also',
      'alter', 'alternative', 'although', 'altitude', 'always', 'amaze', 'ambition', 'ambulance', 'among', 'amount',
      'amuse', 'analyze', 'ancient', 'anger', 'angle', 'angry', 'animal', 'announce', 'annual', 'anticipate',
      'anxiety', 'anxious', 'any', 'anybody', 'anyone', 'anything', 'anyway', 'anywhere', 'apart', 'apartment'
    ]
  },
  cet6: {
    name: '大学英语六级 CET-6',
    color: '#4ecdc4',
    words: [
      'abnormal', 'abolish', 'absence', 'absolute', 'absorb', 'abstract', 'abundant', 'academic', 'accelerate', 'accept',
      'access', 'accident', 'accommodate', 'accompany', 'account', 'accurate', 'achieve', 'acknowledge', 'acquire', 'adapt',
      'adequate', 'adjust', 'administer', 'adolescent', 'adopt', 'adult', 'advocate', 'aesthetic', 'affect', 'affiliate',
      'affirm', 'afford', 'aggregate', 'aggressive', 'agriculture', 'allocate', 'alter', 'alternative', 'amateur', 'ambiguous',
      'ambition', 'amend', 'ample', 'analyze', 'ancestor', 'ancient', 'annual', 'anticipate', 'apparent', 'appeal',
      'appreciate', 'approach', 'appropriate', 'approximate', 'arbitrary', 'architecture', 'arena', 'argument', 'arise', 'arouse',
      'arrange', 'articulate', 'artificial', 'artistic', 'aspect', 'assemble', 'assess', 'asset', 'assign', 'assimilate',
      'assist', 'associate', 'assume', 'assure', 'atmosphere', 'attach', 'attain', 'attempt', 'attend', 'attitude',
      'attorney', 'attribute', 'auction', 'audit', 'author', 'authority', 'automatic', 'autonomous', 'available', 'average'
    ]
  },
  fce: {
    name: 'FCE 剑桥英语',
    color: '#45b7d1',
    words: [
      'abandon', 'ability', 'able', 'abnormal', 'aboard', 'abolish', 'absence', 'absolute', 'absorb', 'abstract',
      'absurd', 'abundant', 'academic', 'accelerate', 'accept', 'access', 'accident', 'accommodate', 'accompany', 'account',
      'accurate', 'achieve', 'acid', 'acknowledge', 'acquire', 'adapt', 'adequate', 'adjust', 'administer', 'adolescent',
      'advocate', 'aesthetic', 'affect', 'affiliate', 'affirm', 'afford', 'aggregate', 'aggressive', 'agriculture', 'allocate',
      'alter', 'alternative', 'amateur', 'ambiguous', 'ambition', 'ambitious', 'amend', 'ample', 'analyze', 'ancestor',
      'ancient', 'annual', 'anticipate', 'apparent', 'appeal', 'appreciate', 'approach', 'appropriate', 'approximate', 'arbitrary',
      'architecture', 'arena', 'argument', 'arise', 'arouse', 'arrange', 'articulate', 'artificial', 'artistic', 'aspect',
      'assemble', 'assess', 'asset', 'assign', 'assimilate', 'assist', 'associate', 'assume', 'assure', 'atmosphere',
      'attach', 'attain', 'attempt', 'attend', 'attitude', 'attorney', 'attribute', 'auction', 'audit', 'author'
    ]
  },
  nce: {
    name: '新概念英语 NCE',
    color: '#9b59b6',
    words: [
      'hello', 'world', 'good', 'morning', 'afternoon', 'evening', 'night', 'day', 'week', 'month',
      'year', 'time', 'name', 'sir', 'madam', 'mr', 'mrs', 'miss', 'nice', 'meet',
      'please', 'thanks', 'sorry', 'pardon', 'help', 'open', 'close', 'door', 'window', 'table',
      'desk', 'chair', 'bed', 'room', 'floor', 'ceiling', 'wall', 'picture', 'father', 'mother',
      'brother', 'sister', 'family', 'hand', 'finger', 'arm', 'leg', 'foot', 'head', 'eye',
      'ear', 'nose', 'mouth', 'hair', 'body', 'car', 'bus', 'train', 'plane', 'ship',
      'boat', 'bike', 'taxi', 'stop', 'station', 'airport', 'office', 'factory', 'school', 'university',
      'college', 'hospital', 'hotel', 'restaurant', 'shop', 'street', 'road', 'city', 'town', 'village',
      'country', 'north', 'south', 'east', 'west', 'left', 'right', 'front', 'back', 'up',
      'down', 'sit', 'stand', 'walk', 'run', 'jump', 'read', 'write', 'speak', 'listen'
    ]
  }
};

module.exports = { FINGER_ZONES, KEY_MAP, LESSONS, WORD_LISTS };