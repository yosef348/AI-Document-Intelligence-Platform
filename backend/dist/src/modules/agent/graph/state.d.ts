export type RetrievedChunk = {
    chunkId: string;
    chunkText: string;
    pageNumber: number | null;
    score: number;
};
export type AgentFinding = {
    findingType: string;
    severity: string;
    confidence: number;
    title: string;
    summary: string;
    explanation: string;
    evidence: Record<string, unknown>;
    location: Record<string, unknown> | null;
};
export declare const AgentState: import("@langchain/langgraph").AnnotationRoot<{
    documentId: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    organizationId: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    documentType: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    retrievedChunks: {
        (annotation: import("@langchain/langgraph").SingleReducer<RetrievedChunk[], RetrievedChunk[]>): import("@langchain/langgraph").BaseChannel<RetrievedChunk[], RetrievedChunk[] | import("@langchain/langgraph").OverwriteValue<RetrievedChunk[]>, unknown>;
        (): import("@langchain/langgraph").LastValue<RetrievedChunk[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    analysisResult: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    findings: {
        (annotation: import("@langchain/langgraph").SingleReducer<AgentFinding[], AgentFinding[]>): import("@langchain/langgraph").BaseChannel<AgentFinding[], AgentFinding[] | import("@langchain/langgraph").OverwriteValue<AgentFinding[]>, unknown>;
        (): import("@langchain/langgraph").LastValue<AgentFinding[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    error: {
        (annotation: import("@langchain/langgraph").SingleReducer<string | null, string | null>): import("@langchain/langgraph").BaseChannel<string | null, string | import("@langchain/langgraph").OverwriteValue<string | null> | null, unknown>;
        (): import("@langchain/langgraph").LastValue<string | null>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    status: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
}>;
export type AgentStateType = typeof AgentState.State;
