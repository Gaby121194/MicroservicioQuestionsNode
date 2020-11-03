import { IMessage, IQuestion, Question, QuestionSchema } from "./schema";
import * as error from "../server/error";
import { hasUncaughtExceptionCaptureCallback } from "process";
import { IUser } from "../user/user";
import { measureMemory } from "vm";
import { ObjectId } from "mongodb";
import { use } from "passport";
const mongoose = require("mongoose");

interface CreateQuestion{
  receptorId?: string,
  text?: string
}


export async function create(userId: string, body: CreateQuestion): Promise<IQuestion> {
  return new Promise((resolve, reject) => {
    Question.findOne({
        userEmmiter: userId,
        userReceptor: body.receptorId,
        question: body.text,
        enabled: true
    }, function (err: any, question: IQuestion) {
        if (err) return reject(err);

        if (!question) {
       
            const result = new Question();
            result.userEmmiter = userId;
            result.userReceptor= body.receptorId;
            result.addQuestion(body.text);
            result.save(function (err: any) {
                if (err) return reject(err);
                resolve(result);
            });
        } 
        else{
          resolve(question)
        }
    });
});

}



  

  
export async function getAll(userId: string): Promise<IQuestion[]> {
  
  return new Promise<IQuestion[]>((resolve, reject) => {
    Question.find({
      userReceptor: userId,
      enabled: true
    },
        function (err: any, questions: IQuestion[]) {
            if (err) return reject(err);
            resolve(questions);
        });
});
}

export async function getQuestions(userId: string): Promise<IQuestion[]> {
  
  return new Promise<IQuestion[]>((resolve, reject) => {
    Question.find({
      userEmmiter: userId,
      enabled: true
    },
        function (err: any, questions: IQuestion[]) {
            if (err) return reject(err);
            resolve(questions);
        });
});
}

interface ResponseQuestion {
  text?: string
}

export async function responseQuestion(userId: string, questionId: string, body: ResponseQuestion): Promise<IQuestion> {
  try {
    let current: IQuestion;
    if (questionId) {
      current = await Question.findById(questionId);
      if (!current) {
        throw error.ERROR_NOT_FOUND;
      }
      if (current.response == ""){
        if(current.userReceptor == userId){
          current.addResponse(body.text)
        }
        else{
          return Promise.reject("No tiene permiso para contestar esta pregunta");
        }
        
      }
      else{
        return Promise.reject("Ya esta contestada esta pregunta");
      }
    } 

    await current.save();
    return Promise.resolve(current);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function findById(userId: string, questionId: string): Promise<IQuestion> {
  try {
    const result = await Question.findOne({
      user: userId,
      _id: questionId,
      enabled: true
    }).exec();
    if (!result) {
      throw error.ERROR_NOT_FOUND;
    }
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

