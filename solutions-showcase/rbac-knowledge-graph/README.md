# RBAC-Secured Enterprise Knowledge Graph

Technical moat project spec for enterprise GraphRAG with ACL-aware retrieval.

## Business Pain

Data sovereignty and PII leakage block enterprise RAG adoption when access controls are not enforced during retrieval.

## Technical Architecture

- Neo4j graph layer
- LangChain retrieval pipeline
- Metadata filtering for source-system ACLs
- PII scrubbing and audit logging

