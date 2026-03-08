import { and, db, eq, pipeStepsStatusTable } from "@repo/database";
export function createStep<TInput, R>(config: {
  step: string;
  stepFunction: (
    input: TInput,
    ctx: { compilationId: string; stepStatusId: number },
  ) => Promise<R> | R;
}) {
  return async (input: TInput, compilationId: string): Promise<R> => {
    const foundStepStatus = await db
      .select()
      .from(pipeStepsStatusTable)
      .where(
        and(
          eq(pipeStepsStatusTable.compilationId, compilationId),
          eq(pipeStepsStatusTable.step, config.step),
        ),
      );

    const foundStepStatusId = foundStepStatus[0]?.id;

    if (foundStepStatusId) {
      await db
        .update(pipeStepsStatusTable)
        .set({ status: "running" })
        .where(eq(pipeStepsStatusTable.id, foundStepStatusId));
    }

    const newStepStatus =
      foundStepStatus.length > 0
        ? foundStepStatus
        : await db
            .insert(pipeStepsStatusTable)
            .values({
              compilationId,
              step: config.step,
              status: "running",
            })
            .returning();

    const stepStatus = newStepStatus[0];

    if (!stepStatus) {
      throw new Error(
        `[create-step] Failed to create step status for ${config.step}`,
      );
    }

    try {
      const result = await config.stepFunction(input, {
        compilationId,
        stepStatusId: stepStatus.id,
      });

      await db
        .update(pipeStepsStatusTable)
        .set({ status: "completed" })
        .where(eq(pipeStepsStatusTable.id, stepStatus.id));

      return result;
    } catch (error) {
      await db
        .update(pipeStepsStatusTable)
        .set({ status: "failed" })
        .where(eq(pipeStepsStatusTable.id, stepStatus.id));
      throw error;
    }
  };
}
