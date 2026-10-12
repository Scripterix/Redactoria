# Promotion audit

- schemaVersion: 3
- result: PROMOTED_PUBLIC
- scope: public-production
- candidateRef: lab/candidates/api-http-json/article.json
- candidateHash: 3b957da470556b9b7c95f40e8e5c280ec36c9ad685b06f7922671f25cefa7d60
- articleHash: ee2a0cde2ea6105d61c48cc4a4af40ebbe333db4d24efa3cda62ff78791df009
- decisionRef: lab/decisions/api-http-json-publication.json
- decisionHash: b6ed19cce21fc2c50d0e46f2061b1807347616f2ed0c145768beffd7fe84ae4b
- approvedBy: human
- criticReviewRef: lab/reviews/api-http-json/critic-review.json
- criticReviewHash: 0cca9677657a20deae0b6620f54a0007d8e251031c2d552cb744e721d0f6241c
- sourceDecisionRef: lab/decisions/api-http-json-rewrite.json
- sourceDecisionHash: faa80a7e2771dd162bae43cdc9f39f6d378f30bb68693d9fa474ab5e9d3f32ee
- researchApprovalRef: lab/decisions/api-http-json-research-acceptance.json
- researchApprovalHash: adbf9baa8284e94b4ffbb5d56678133d64bbe81fbeebf1cb3b8b5830235bf4c2
- researchPacketRef: lab/research/api-http-json/research.json
- researchPacketHash: b1785e01994277e1e3eeacc1503d29408f252e41afc1f0696aebdf9bee0b224b
- destination: content/articles/api-http-json.md
- contentHash: 3da7f179e0102eaf26f69e6a832db65452a6b0e323434784a745f34f952faa9c
- localPath: /artykuly/api-http-json/
- remotePublicationApproved: true
- transforms: ["Content Collection YAML front matter","Removed exact human-approved technical LAB/draft note"]

No LLM or article regeneration. Git commit, push and deployment remain outside this deterministic gate.
