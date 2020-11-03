import * as mongoose from "mongoose";
import { strict } from "assert";

export interface IQuestion extends mongoose.Document {
  questionId: string;
  userEmmiter: string;
  userReceptor: string;
  nameEmmiter: string;
  nameReceptor: string;
  question: string;
  response: string;
  dateresponse: Date;
  created: Date;
  updated: Date;
  deleted: Date;
  enabled: Boolean;
  addQuestion: Function;
  addResponse: Function
}

export interface IMessage extends mongoose.Document {
    messageId?: string;
    text: string;
    created?: Date;
    sender: string,
    nameSender?: string

  }

  export let QuestionSchema = new mongoose.Schema({
    
    userEmmiter: {
        type: String,
        default: "",
        trim: true,
        required: "El userId del user que hacer la pregunta",

      },
    userReceptor: {
        type: String,
        default: "",
        trim: true,
        required: "El userId del user que recibe la pregunta",
      },

    question: {
      type: String,
      required: "La pregunta que se quiere realizar",
      trim: true,
      default: ""

  },

  response: {
    type: String,
      trim: true,
      default: ""

  },

  dateresponse: {
    type: Date,
    default: null
  },

    created: {
      type: Date,
      default: Date.now()
    },
    updated: {
      type: Date,
      default: Date.now()
    },
    deleted: {
      type: Date,
      default: null
    },
    enabled: {
      type: Boolean,
      default: true
    }
  }, { collection: "question" });


 QuestionSchema.methods.addQuestion = function (question: String) {
   this.question = question;
   this.datequestion= Date.now();
   return;
 };

 QuestionSchema.methods.addResponse = function (response: String) {
  this.response = response;
  this.dateresponse= Date.now();
  return;
};


  export let Question = mongoose.model<IQuestion>("Question", QuestionSchema);