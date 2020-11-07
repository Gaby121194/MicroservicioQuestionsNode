
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

  async function create(req: IUserSessionRequest, res: express.Response) {
    const result = await service.create(req.user.user.id, req.body);
    res.json({
      id: result.id,
      articleId: result.articleId,
      message: result.question,
    });
  }

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

 