"use strict";

import { IRabbitMessage } from "./tools/common";

import {  RabbitTopicPublisher } from "./tools/topicPublisher";

interface IResponseDoneMessage {
    questionId: string;
    responseText: string;
}
interface IQuestionDoneMessage {
    questionId: string;
    questionText: string;
}



export async function sendQuestion(questionId: string, questionText: string): Promise<any> {
    const message: IRabbitMessage = {
        type: "question-send",
        exchange: "question",
        message: {
            questionId: questionId,
            questionText: questionText
        }
    };

    const topicPublisher= new RabbitTopicPublisher(message.exchange);
    topicPublisher.send(message);
}


export async function sendResponse(questionId: string, responseText: string): Promise<any> {
    const message: IRabbitMessage = {
        type: "question-response",
        exchange: "question",
        message: {
            questionId: questionId,
            responseText: responseText
        }
    };

    const topicPublisher= new RabbitTopicPublisher(message.exchange);
    topicPublisher.send(message);
}
