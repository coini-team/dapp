export class EmailToCustomerDto<T> {
  emails: string[];

  subject: string;

  templateName: string;

  context?: T | Partial<T>;
}
export class SingleEmailDto {
  email: string;

  subject: string;

  template: string;

  context?: EmailContext;
}

export class EmailContext {
  name: string;

  url: string;

  message: string;
}
