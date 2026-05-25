export abstract class IEntity<EditInput> {
  id: string | null;

  abstract edit(input: EditInput): void;
}
