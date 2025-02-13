import {LanguageModelUsage, NoObjectGeneratedError} from "ai";

export interface GenerateObjectResult<T> {
  object: T;
  usage: LanguageModelUsage;
}

export async function handleGenerateObjectError<T>(error: unknown): Promise<GenerateObjectResult<T>> {
  if (NoObjectGeneratedError.isInstance(error)) {
    console.error('Object not generated according to the schema, fallback to manual parsing');
    try {
      const partialResponse = JSON.parse((error as any).text);
      return {
        object: partialResponse as T,
        usage: (error as any).usage
      };
    } catch (parseError) {
      throw error;
    }
  }
  throw error;
}
