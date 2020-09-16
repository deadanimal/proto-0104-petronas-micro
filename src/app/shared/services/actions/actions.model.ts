export class Action {
  public id: string;
  public name: string;
  public detail: string;
  public created_date: string;
  public modified_date: string;
  public by: string;

  constructor(
    id: string,
    name: string,
    detail: string,
    created_date: string,
    modified_date: string,
    by
  ) {
    this.id = id;
    this.name = name;
    this.detail = detail;
    this.created_date = created_date;
    this.modified_date = modified_date;
    this.by = by;
  }
}
