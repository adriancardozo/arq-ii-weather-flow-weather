export class LoginInput {
  constructor(
    public id: string | null,
    public email: string,
  ) {}

  plain(): Record<string, any> {
    return { id: this.id, email: this.email };
  }
}
