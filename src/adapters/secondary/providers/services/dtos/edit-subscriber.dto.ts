export class EditSubscriberDto {
  constructor(
    public external_id: string,
    public name?: string,
    public provider?: string,
    public longitude?: number,
    public latitude?: number,
    public notifier?: string,
  ) {}
}
