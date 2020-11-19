"use strict";

import { IQuestion } from "../question/schema";
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

/**
 * @api {direct} question/question-done Pregunta realizada
 * @apiGroup RabbitMQ POST
 *
 * @apiDescription Question enviá un mensaje a un topic llamado question-send (se usara para estadisticas)
 *
 * @apiExample {json} Mensaje
 *     {
 *        "type": "question-send",
 *        "exchange": "question",
 *         "message": {
 *             "questionId": "{Id de la question}",
                "questionText": "{texto de la pregunta}"
 *        }
 *     }
 */

/**
 * Enviá una pregunta realizada por un usuario sobre un articulo para que sea utilizado en posteriores estadisticas
 */


export async function sendQuestion(question: IQuestion): Promise<any> {
    const message: IRabbitMessage = {
        type: "question-send",
        exchange: "question",
        message: {
            questionId: question.id,
            questionText: question.question,
            articleId: question.articleId
        }
    };

    const topicPublisher= new RabbitTopicPublisher(message.exchange);
    topicPublisher.send(message);
}

/**
 * @api {direct} question/response-done Respuesta realizada
 * @apiGroup RabbitMQ POST
 *
 * @apiDescription Question enviá un mensaje a un topic llamado question-response (se usara para estadisticas)
 *
 * @apiExample {json} Mensaje
 *     {
 *        "type": "question-response",
 *        "exchange": "question",
 *         "message": {
 *             "questionId": "{Id de la question}",
 *              "articleId": "{Id del articulo que se realizo la respuesta}"
 *               "responseText": "{texto de la respuesta}"
 *        }
 *     }
 */

/**
 * Enviá una respuesta realizada por un usuario admin sobre un articulo para que sea utilizado en posteriores estadisticas
 */



export async function sendResponse(question: IQuestion): Promise<any> {
    const message: IRabbitMessage = {
        type: "question-response",
        exchange: "question",
        message: {
            questionId: question.id,
            articleId: question.articleId,
            responseText: question.response
        }
    };

    const topicPublisher= new RabbitTopicPublisher(message.exchange);
    topicPublisher.send(message);
}
