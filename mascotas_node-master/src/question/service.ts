import {  IQuestion, Question, QuestionSchema } from "./schema";
import * as error from "../server/error";
import { hasUncaughtExceptionCaptureCallback } from "process";
import { measureMemory } from "vm";
import { ObjectId } from "mongodb";
import { use } from "passport";
import { IUser } from "../token";
import { sendQuestion, sendResponse } from "../rabbit/questionService";
import { rejects } from "assert";
import { constants } from "fs";
const mongoose = require("mongoose");

interface CreateQuestion{
  text?: string,
  articleId?: string
}


export async function create(userId: string, body: CreateQuestion): Promise<IQuestion> {
  return new Promise((resolve, reject) => {
       
            const result = new Question();
            result.userEmmiter = userId;
            result.articleId= body.articleId
            result.addQuestion(body.text);
            result.save().then((res)=> {
              sendQuestion(res);
              resolve(res)
            },
            ()=> {reject(error)})
          
    });
}




  

  
export async function getAll(articleId: string): Promise<IQuestion[]> {
  
  return new Promise<IQuestion[]>((resolve, reject) => {
    Question.find({
      articleId: articleId,
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

export async function responseQuestion(user: IUser, questionId: string, body: ResponseQuestion): Promise<IQuestion> {
  try {
    if (user.permissions.indexOf('admin') > 0){
     const current = await Question.findById(questionId);
      if (!current) {
        throw error.ERROR_NOT_FOUND;
      }
      if (current.response != ""){
        return Promise.reject("Ya esta contestada esta pregunta");
      } 
      
      return new Promise((resolve, reject) => {
     
        current.userReceptor = user.id;
        current.addResponse(body.text, user.name);
        current.save().then((res)=> {
          sendResponse(res);
          resolve(res)
        },
        ()=> {reject(error)})
      
       })
    }else{
      return Promise.reject("No tiene permiso para contestar esta pregunta");
    }
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


