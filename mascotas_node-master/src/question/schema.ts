import * as mongoose from "mongoose";
import { strict } from "assert";

export interface IQuestion extends mongoose.Document {
  articleId: string;
  userEmmiter: string;
  userReceptor: string;
  nameReceptor: string;
  question: string;
  response: string;
  dateresponse: Date;
  created: Date;
  enabled: Boolean;
  addQuestion: Function;
  addResponse: Function
}



  export let QuestionSchema = new mongoose.Schema({
    
    articleId: {
      type: String,
      default: "",
      trim: true,
      required: "El id del articulo por el que se hace la pregunta"

    },
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
      },
      nameReceptor: {
        type: String,
        default: "",
        trim: true,
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

 QuestionSchema.methods.addResponse = function (response: String, name: String) {
  this.response = response;
  this.nameReceptor= name;
  this.dateresponse= Date.now();
  return;
};


  export let Question = mongoose.model<IQuestion>("Question", QuestionSchema);