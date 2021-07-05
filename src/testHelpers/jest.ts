export function itBehavesLike(
  example: (...args: unknown[]) => [string, () => Promise<boolean>],
  ...args: unknown[]
): void {
  describe(`behaves like ${example.name}`, () => {
    const exampleExecute = example(...args);
    it(exampleExecute[0], exampleExecute[1]);
  });
}
