export class Surveyanswer {
  public id: string;
  public answer: string;
  public created_date: string;
  public modified_date: boolean;
  public account_created: string;
  public question: string;
  public by: string;

  constructor(
    id: string,
    answer: string,
    created_date: string,
    modified_date: boolean,
    account_created: string,
    question: string,
    by: string
  ) {
    this.id = id;
    this.answer = answer;
    this.created_date = created_date;
    this.modified_date = modified_date;
    this.account_created = account_created;
    this.question = question;
    this.by = by;
  }
}
