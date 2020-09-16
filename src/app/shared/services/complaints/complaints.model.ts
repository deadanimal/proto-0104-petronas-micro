export class Complaint {
  public id: string;
  public name: string;
  public email: string;
  public phone: string;
  public complaint: string;
  public complaint_category: string;
  public supporting_docs: string;
  public created_date: string;
  public modified_date: string;

  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    complaint: string,
    complaint_category: string,
    supporting_docs: string,
    created_date: string,
    modified_date: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.complaint = complaint;
    this.complaint_category = complaint_category;
    this.supporting_docs = supporting_docs;
    this.created_date = created_date;
    this.modified_date = modified_date;
  }
}
