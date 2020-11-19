
import * as express from "express";
import * as service from "../question/service";
import * as token from "../token";
import * as error from "./error";
import { Express } from "express";
import { NextFunction } from "express";



export function init(app: Express) {
    // Rutas del controlador
    app
      .route("/v1/question")
      .post(validateToken, create )
    
    app
      .route("/v1/question/:idArticle")
      .get(validateToken, getArticleQuestions);
    app
      .route("/v1/question/")
      .get(validateToken, getQuestionsSender);
    app
      .route("/v1/question/:idQuestion")
      .put(validateToken, response);

  
  }

  interface IUserSessionRequest extends express.Request {
    user: token.ISession;
  }

  /**
 * @apiDefine AuthHeader
 *
 * @apiExample {String} Header Autorización
 *    Authorization=bearer {token}
 *
 * @apiErrorExample 401 Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */

  function validateToken(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
    const auth = req.header("Authorization");
    if (!auth) {
      return error.handle(error.newError(error.ERROR_UNAUTHORIZED, "Unauthorized"), res);
    }
  
    token.validate(auth)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => error.handle(err, res));
  }

  /**
 * @api {post} /v1/question/ Realizar una question
 * @apiName Send Question
 * @apiGroup Question
 *
 * @apiDescription Realizar una question a un determinado articulo.
 *
 * @apiExample {json} Body
 *    {
 *      "arcticleId" : "{articulo actual}",
 *      "text" : "{question}",
 *    }
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 * 
 *     {
 *       "id": "{id de la question realizada}",
 *       "aritcleId": "{id del articulo al que se le realizo la question}",
 *       "message": "{contenido de la question}"
 *     }
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */

  async function create(req: IUserSessionRequest, res: express.Response) {
    const result = await service.create(req.user.user.id, req.body);
    res.json({
      id: result.id,
      articleId: result.articleId,
      message: result.question,
    });
  }

  /**
 * @api {get} /v1/question/:idArticle Obtener preguntas del articulo
 * @apiName Obtener preguntas articulo
 * @apiGroup Question
 *
 * @apiDescription Trae las preguntas realizadas a un determinado article.
 *
 * 
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "{Id de la question}",
 *       "articleId": "{Id del articulo}",
 *       "message": "{La pregunta realizada}",
 *       "response": "{La respuesta}"
 *     }
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */

  async function getArticleQuestions(req: IUserSessionRequest, res: express.Response) {
    const result = await service.getAll(req.params.idArticle);
    res.json(result.map(u => {
      return {
        id: u._id,
        articleId: u.articleId,
        message: u.question,
        response: u.response
      };
    }));
  }

  /**
 * @api {get} /v1/question Obtener preguntas del usuario
 * @apiName Obtener preguntas usuario
 * @apiGroup Question
 *
 * @apiDescription Trae las preguntas realizadas por el usuario actual.
 *
 * 
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "{Id de la question}",
 *       "articleId": "{Id del articulo}",
 *       "message": "{La pregunta realizada}",
 *       "response": "{La respuesta}"
 *     }
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
  async function getQuestionsSender(req: IUserSessionRequest, res: express.Response) {
    const result = await service.getQuestions(req.user.user.id);
    res.json(result.map(u => {
      return {
        id: u._id,
        articleId: u.articleId,
        message: u.question,
        response: u.response
      };
    }));
  }

  /**
 * @api {post} /v1/question/:idQuestion Responde una pregunta
 * @apiName Responder pregunta
 * @apiGroup Question
 *
 * @apiDescription Responder una pregunta.
 *
 * @apiExample {json} Body
 *    {
 *      "text" : "{respuesta enviada}",
 *    }
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 * 
 *     {
 *       "id": "{Id de la question}",
 *       "articleId": "{Id del articulo}",
 *       "message": "{La pregunta realizada}",
 *       "response": "{La respuesta}"
 *     }
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */

  async function response(req: IUserSessionRequest, res: express.Response) {
    const result = await service.responseQuestion(req.user.user, req.params.idQuestion, req.body);
    res.json({
        id: result.id,
        articleId: result.articleId,
        message: result.question,
        response: result.response
      }
      );
  }

 