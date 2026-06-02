import { Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { AgentStateType } from '../state';

const logger = new Logger('ReasonNode');

function buildPrompt(documentType: string, documentText: string): string {
  const normalizedType = documentType.toLowerCase();

  if (normalizedType === 'invoice') {
    return `You are an invoice auditor. Analyze the following invoice text
and identify anomalies, errors, and concerns.
Focus on: duplicate entries, unusual amounts, missing fields,
vendor inconsistencies, and date issues.
Document text: ${documentText}
Return a JSON object with key 'analysis' containing your detailed findings.`;
  }

  return `You are a contract risk analyst. Analyze the following contract text
and identify risks, missing clauses, unusual terms, and important dates.
Focus on: termination clauses, liability limitations, payment terms,
governing law, auto-renewal clauses, and indemnification.
Document text: ${documentText}
Return a JSON object with key 'analysis' containing your detailed findings.`;
}

export async function reasonNode(
  state: AgentStateType,
  openaiApiKey: string,
): Promise<Partial<AgentStateType>> {
  logger.log(`Starting reason node for document ${state.documentId}`);

  const documentText = state.retrievedChunks
    .map((chunk) => chunk.chunkText)
    .join('\n');
  const prompt = buildPrompt(state.documentType, documentText);

  try {
    const model = new ChatOpenAI({
      apiKey: openaiApiKey,
      model: 'gpt-4o',
      temperature: 0,
    });

    const response = await model.invoke(prompt);
    const analysisResult =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    logger.log(`Completed reason node for document ${state.documentId}`);

    return {
      analysisResult,
      status: 'reasoned',
      error: null,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown reason node error';
    logger.error(
      `Reason node failed for document ${state.documentId}: ${errorMessage}`,
    );
    throw error instanceof Error ? error : new Error(errorMessage);
  }
}
