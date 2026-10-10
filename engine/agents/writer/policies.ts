export const WRITER_POLICY = Object.freeze({
 may: ['read-approved-inputs', 'produce-one-draft', 'return-structured-result'],
 mustNot: ['research', 'write-source', 'write-content', 'publish', 'approve', 'invoke-agent', 'execute-shell'],
 destination: 'LAB/drafts', maxModelCalls: 1,
});

