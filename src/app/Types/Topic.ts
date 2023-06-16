export interface Topic {
  id: string;
  subjectId: string;
  name: string;
}

export interface AddTopicObject {
  name: string;
  subject_id: string;
}

export interface TopicResponseObject {
  _id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  topicId: string;
  name: string;
  englishNAme: string;
}
