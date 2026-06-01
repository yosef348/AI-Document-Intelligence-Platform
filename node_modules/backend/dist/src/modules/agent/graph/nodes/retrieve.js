"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveNode = retrieveNode;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const chunks_1 = require("../../../../database/schema/chunks");
const logger = new common_1.Logger('RetrieveNode');
async function retrieveNode(state, db) {
    logger.log(`Starting retrieve node for document ${state.documentId}`);
    const maxChunks = 50;
    const chunkRows = await db.db
        .select({
        chunkId: chunks_1.chunks.id,
        chunkText: chunks_1.chunks.chunkText,
        pageNumber: chunks_1.chunks.pageNumber,
    })
        .from(chunks_1.chunks)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(chunks_1.chunks.organizationId, state.organizationId), (0, drizzle_orm_1.eq)(chunks_1.chunks.documentId, state.documentId), (0, drizzle_orm_1.isNull)(chunks_1.chunks.deletedAt)))
        .orderBy((0, drizzle_orm_1.asc)(chunks_1.chunks.chunkIndex))
        .limit(maxChunks + 1);
    const wasTruncated = chunkRows.length > maxChunks;
    const retrievedChunkRows = chunkRows.slice(0, maxChunks);
    if (wasTruncated) {
        logger.warn(`Document ${state.documentId} has more than ${maxChunks} chunks; analysis limited to first ${maxChunks} chunks`);
    }
    const retrievedChunks = retrievedChunkRows.map((chunk) => ({
        chunkId: chunk.chunkId,
        chunkText: chunk.chunkText,
        pageNumber: chunk.pageNumber,
        score: 1,
    }));
    logger.log(`Completed retrieve node for document ${state.documentId} with ${retrievedChunks.length} chunks`);
    return {
        retrievedChunks,
        status: 'retrieved',
        error: null,
    };
}
//# sourceMappingURL=retrieve.js.map