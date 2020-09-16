export class Surveyquestion {
  public id: string;
  public question: string;
  public category: string;
  public survey_type: string;
  public created_date: string;
  public modified_date: string;

  constructor(
    id: string,
    question: string,
    category: string,
    survey_type: string,
    created_date: string,
    modified_date: string
  ) {
    this.id = id;
    this.question = question;
    this.category = category;
    this.survey_type = survey_type;
    this.created_date = created_date;
    this.modified_date = modified_date;
  }
}
