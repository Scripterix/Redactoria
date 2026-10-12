# Promotion audit

- schemaVersion: 3
- result: PROMOTED_PUBLIC
- scope: public-production
- candidateRef: lab/candidates/markdown/article.json
- candidateHash: 0a1ba6f4d6bdddea87613b138fc8c7cac82b5f6b76f26ceeb386c37b3b18e35e
- articleHash: d6335cf1be4fa58d16b4fb86eb0759c5b237605ec1da0ebbd519c8010197de57
- decisionRef: lab/decisions/markdown-publication.json
- decisionHash: cd5f924f255308d15c21eb4400074eec6d4bd868edf650350aefe3ed4f31e59c
- approvedBy: human
- criticReviewRef: lab/reviews/markdown/critic-review.json
- criticReviewHash: 8afb63434eb8ec0eab7e91a6c54aaaf0b305ce570c641432c6206942a93afbf7
- sourceDecisionRef: lab/decisions/markdown-rewrite.json
- sourceDecisionHash: 879b4dcf06566f77c8e94d18f4d3bcb342375698b3514b81a2b9987a108cad1a
- researchApprovalRef: lab/decisions/markdown-research-acceptance.json
- researchApprovalHash: 66bda1cb9fb89c984e548376da4037f28fcae867412ccbdda54c3e3e11b3d993
- researchPacketRef: lab/research/markdown/research.json
- researchPacketHash: b0f943639dbb9ab7e0e7f9cabacce5569fb6eccbe16258a5a3f42bb83d516dcd
- destination: content/articles/markdown-podstawy.md
- contentHash: 2ef7bc42076830ed4f2b3070b1feb695ce135d4751fbfcda0404e62f17c3f463
- localPath: /artykuly/markdown-podstawy/
- remotePublicationApproved: true
- transforms: ["Content Collection YAML front matter","Removed exact human-approved technical LAB/draft note"]

No LLM or article regeneration. Git commit, push and deployment remain outside this deterministic gate.
