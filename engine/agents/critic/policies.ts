export const CRITIC_POLICY = Object.freeze({
 may: ['read-exact-draft', 'read-approved-research', 'produce-one-review'],
 mustNot: ['rewrite-draft', 'new-research', 'write-source', 'write-content', 'publish', 'approve', 'invoke-agent', 'execute-shell'],
 destination: 'LAB/reviews', maxModelCalls: 1,
});

