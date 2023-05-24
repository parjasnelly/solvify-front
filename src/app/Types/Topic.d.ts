declare namespace Topic {
  export interface Entity {
    id: string;
    subjectId: string;
    name: string;
    englishNAme: string;
  }

  export interface SubTopicEntity {
    id: string;
    topicId: string;
    name: string;
    englishNAme: string;
  }
}
